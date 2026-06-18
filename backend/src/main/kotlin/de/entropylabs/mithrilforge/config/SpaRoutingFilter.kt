package de.entropylabs.mithrilforge.config

import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import org.springframework.stereotype.Component

/**
 * Filter to handle SPA routing and Documentation static files.
 * Forwards non-API and non-static routes to the React app (index.html)
 * and resolves directory indexes for the documentation.
 */
@Component
class SpaRoutingFilter : Filter {
    override fun doFilter(
        request: ServletRequest,
        response: ServletResponse,
        chain: FilterChain,
    ) {
        val req = request as HttpServletRequest
        val uri = req.requestURI

        if (uri.startsWith("/api") || uri.startsWith("/t/") || uri == "/t") {
            chain.doFilter(request, response)
            return
        }

        if (uri.startsWith("/documentation")) {
            // Check if it lacks a file extension
            if (!uri.substringAfterLast("/", "").contains(".")) {
                val targetUri = if (uri.endsWith("/")) "${uri}index.html" else "$uri/index.html"
                req.getRequestDispatcher(targetUri).forward(request, response)
                return
            }
            chain.doFilter(request, response)
            return
        }

        // If it's a file request (contains a dot), let it pass
        if (uri.substringAfterLast("/", "").contains(".")) {
            chain.doFilter(request, response)
            return
        }

        // Otherwise forward to index.html
        req.getRequestDispatcher("/index.html").forward(request, response)
    }
}
