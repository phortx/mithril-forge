package de.entropylabs.mithrilforge.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.util.AntPathMatcher
import org.springframework.web.filter.OncePerRequestFilter
import java.net.URI

/**
 * Defense-in-depth against login CSRF for unauthenticated write endpoints.
 *
 * These endpoints do not benefit from SameSite=Strict on the session cookie because
 * no session exists yet. We reject requests whose Origin (or Referer fallback) is
 * not on our allow-list. See [tracking-and-cookies.md] for the full CSRF rationale.
 *
 * Allowed origins are kept in sync with [CorsConfig].
 */
@Component
class OriginCheckFilter : OncePerRequestFilter() {
    private val protectedPaths = setOf("/api/session", "/api/users", "/api/users/confirm")

    private val allowedOriginPatterns =
        listOf(
            "https://*.mithril-forge.site",
            "https://mithril-forge.site",
            "http://localhost:*",
        )

    private val pathMatcher = AntPathMatcher()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (request.method == "POST" && request.requestURI in protectedPaths) {
            val origin = request.getHeader("Origin")
            val referer = request.getHeader("Referer")

            val originToCheck =
                when {
                    !origin.isNullOrBlank() && origin != "null" -> origin
                    !referer.isNullOrBlank() -> extractOrigin(referer)
                    else -> null
                }

            if (originToCheck == null || !isAllowed(originToCheck)) {
                response.status = HttpServletResponse.SC_FORBIDDEN
                response.contentType = MediaType.APPLICATION_JSON_VALUE
                response.writer.write("""{"error":"Origin not allowed"}""")
                return
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun extractOrigin(referer: String): String? =
        try {
            val uri = URI(referer)
            val port = if (uri.port == -1) "" else ":${uri.port}"
            "${uri.scheme}://${uri.host}$port"
        } catch (_: Exception) {
            null
        }

    private fun isAllowed(origin: String): Boolean = allowedOriginPatterns.any { pathMatcher.match(it, origin) }
}
