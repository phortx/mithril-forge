package de.entropylabs.mithrilforge

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mockito.mock
import org.mockito.Mockito.reset
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.http.HttpEntity
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.web.client.RestTemplate
import java.net.URI

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Import(TestcontainersConfiguration::class, PostHogProxyControllerTest.MockRestTemplateConfig::class)
class PostHogProxyControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var restTemplate: RestTemplate

    @BeforeEach
    fun resetMock() {
        reset(restTemplate)
    }

    @Test
    fun `POST forwards JSON body to PostHog ingestion endpoint`() {
        val uriCaptor = ArgumentCaptor.forClass(URI::class.java)
        val entityCaptor = ArgumentCaptor.forClass(HttpEntity::class.java)

        `when`<ResponseEntity<ByteArray>>(
            restTemplate.exchange(
                uriCaptor.capture(),
                org.mockito.ArgumentMatchers.any(),
                entityCaptor.capture(),
                org.mockito.ArgumentMatchers.eq(ByteArray::class.java),
            ),
        ).thenReturn(ResponseEntity.ok().body(ByteArray(0)))

        val payload = """{"event":"pageview","api_key":"test"}"""
        mockMvc
            .post("/t/e/?_=1&ver=1.0&compression=") {
                contentType = MediaType.APPLICATION_JSON
                content = payload
            }.andExpect {
                status { isOk() }
            }

        verify(restTemplate).exchange(
            org.mockito.ArgumentMatchers.any(URI::class.java),
            org.mockito.ArgumentMatchers.any(),
            org.mockito.ArgumentMatchers.any(),
            org.mockito.ArgumentMatchers.eq(ByteArray::class.java),
        )

        val forwardedUri = uriCaptor.value
        assert(forwardedUri.toString().startsWith("https://eu.i.posthog.com/e/")) {
            "Expected URI to be the PostHog ingestion endpoint, was: $forwardedUri"
        }

        val capturedEntity: HttpEntity<*> = entityCaptor.value
        val forwardedBody = capturedEntity.body as ByteArray?
        assert(forwardedBody != null && forwardedBody.isNotEmpty()) {
            "Forwarded body was empty or null - this is the bug!"
        }
        val bodyString = String(forwardedBody!!, Charsets.UTF_8)
        assert(bodyString == payload) {
            "Forwarded body did not match expected.\nExpected: $payload\nActual: $bodyString"
        }
        assert(capturedEntity.headers.contentType == MediaType.APPLICATION_JSON) {
            "Expected Content-Type to be preserved as application/json, was: ${capturedEntity.headers.contentType}"
        }
    }

    @Test
    fun `POST forwards gzipped body without requiring json content type`() {
        val uriCaptor = ArgumentCaptor.forClass(URI::class.java)
        val entityCaptor = ArgumentCaptor.forClass(HttpEntity::class.java)

        `when`<ResponseEntity<ByteArray>>(
            restTemplate.exchange(
                uriCaptor.capture(),
                org.mockito.ArgumentMatchers.any(),
                entityCaptor.capture(),
                org.mockito.ArgumentMatchers.eq(ByteArray::class.java),
            ),
        ).thenReturn(ResponseEntity.ok().body(ByteArray(0)))

        val gzippedPayload: ByteArray = byteArrayOf(0x1f.toByte(), 0x8b.toByte(), 0x08, 0x00, 0x42, 0x42, 0x42, 0x42, 0x00, 0x03, 0x00)
        mockMvc
            .post("/t/e/?_=1&ver=1.0&compression=gzip-js") {
                contentType = MediaType.TEXT_PLAIN
                content = gzippedPayload
            }.andExpect {
                status { isOk() }
            }

        val forwardedBody = entityCaptor.value.body as ByteArray?
        assert(forwardedBody != null && forwardedBody.contentEquals(gzippedPayload)) {
            "Forwarded gzipped body did not match the original payload."
        }
    }

    @org.springframework.boot.test.context.TestConfiguration(proxyBeanMethods = false)
    class MockRestTemplateConfig {
        @Bean
        @Primary
        fun mockRestTemplate(): RestTemplate = mock(RestTemplate::class.java)
    }
}
