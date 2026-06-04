package de.entropylabs.mithrilforge

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration::class)
class StatusControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun `GET api-status returns ok`() {
        mockMvc
            .get("/api/status")
            .andExpect {
                status { isOk() }
                jsonPath("$.status") { value("ok") }
                jsonPath("$.app") { value("mithril-forge") }
                jsonPath("$.database") { value("connected") }
            }
    }
}
