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
        request.headerNames.asSequence().forEach { headerName ->
            // Do not forward the Host header, let RestTemplate set it to eu.i.posthog.com
            // Do not forward Origin/Referer if you want to mask it, but usually fine
            if (!headerName.equals("host", ignoreCase = true) && !headerName.equals("connection", ignoreCase = true)) {
                headers.addAll(headerName, request.getHeaders(headerName).toList())
            }
        }

        // Forward the client's real IP to PostHog
        val forwardedFor = request.getHeader("X-Forwarded-For")
        val clientIp = forwardedFor?.split(",")?.firstOrNull()?.trim() ?: request.remoteAddr
        headers.set("X-Forwarded-For", clientIp)

        val entity = HttpEntity(body, headers)

        return try {
            restTemplate.exchange(
                URI(targetUrl),
                HttpMethod.valueOf(request.method),
                entity,
                ByteArray::class.java,
            )
        } catch (e: HttpStatusCodeException) {
            ResponseEntity.status(e.statusCode).headers(e.responseHeaders).body(e.responseBodyAsByteArray)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }
}
