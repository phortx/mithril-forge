package de.entropylabs.mithrilforge.config

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpStatusCodeException
import org.springframework.web.client.RestTemplate
import java.net.URI

@RestController
class PostHogProxyController {
    private val restTemplate = RestTemplate()
    private val postHogHost = "https://eu.i.posthog.com"

    @RequestMapping("/t/**")
    fun proxyToPostHog(
        request: HttpServletRequest,
        body: ByteArray?,
    ): ResponseEntity<ByteArray> {
        val path = request.requestURI.removePrefix("/t")
        val queryString = request.queryString?.let { "?$it" } ?: ""
        val targetUrl = "$postHogHost$path$queryString"

        val headers = HttpHeaders()
        val excludedRequestHeaders = setOf("host", "connection", "content-length", "accept-encoding")

        request.headerNames.asSequence().forEach { headerName ->
            if (headerName.lowercase() !in excludedRequestHeaders) {
                headers.addAll(headerName, request.getHeaders(headerName).toList())
            }
        }

        // Forward the client's real IP to PostHog
        val forwardedFor = request.getHeader("X-Forwarded-For")
        val clientIp = forwardedFor?.split(",")?.firstOrNull()?.trim() ?: request.remoteAddr
        headers.set("X-Forwarded-For", clientIp)

        val entity = HttpEntity(body, headers)

        return try {
            val response =
                restTemplate.exchange(
                    URI(targetUrl),
                    HttpMethod.valueOf(request.method),
                    entity,
                    ByteArray::class.java,
                )
            ResponseEntity
                .status(response.statusCode)
                .headers(filterResponseHeaders(response.headers))
                .body(response.body)
        } catch (e: HttpStatusCodeException) {
            ResponseEntity
                .status(e.statusCode)
                .headers(filterResponseHeaders(e.responseHeaders ?: HttpHeaders()))
                .body(e.responseBodyAsByteArray)
        } catch (e: Exception) {
            e.printStackTrace()
            ResponseEntity.internalServerError().build()
        }
    }

    private fun filterResponseHeaders(originalHeaders: HttpHeaders): HttpHeaders {
        val filtered = HttpHeaders()
        val excludedResponseHeaders = setOf("transfer-encoding", "content-length", "connection")

        originalHeaders.forEach { key, values ->
            if (key.lowercase() !in excludedResponseHeaders) {
                filtered.addAll(key, values)
            }
        }
        return filtered
    }
}
