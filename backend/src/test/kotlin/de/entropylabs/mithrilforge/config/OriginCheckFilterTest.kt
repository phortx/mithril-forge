package de.entropylabs.mithrilforge.config

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse

class OriginCheckFilterTest {
    private val filter = OriginCheckFilter()

    private fun postRequest(uri: String): MockHttpServletRequest =
        MockHttpServletRequest("POST", uri).apply {
            requestURI = uri
        }

    private fun runFilter(req: MockHttpServletRequest): MockHttpServletResponse {
        val res = MockHttpServletResponse()
        filter.doFilter(req, res, NoopFilterChain)
        return res
    }

    @Test
    fun `allows POST to login with allowed origin`() {
        val req = postRequest("/api/session").apply { addHeader("Origin", "https://www.mithril-forge.site") }
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }

    @Test
    fun `allows POST to signup with localhost origin`() {
        val req = postRequest("/api/users").apply { addHeader("Origin", "http://localhost:5173") }
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }

    @Test
    fun `allows POST to confirm with bare production origin`() {
        val req = postRequest("/api/users/confirm").apply { addHeader("Origin", "https://mithril-forge.site") }
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }

    @Test
    fun `falls back to Referer when Origin is absent`() {
        val req = postRequest("/api/session").apply { addHeader("Referer", "https://mithril-forge.site/login") }
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }

    @Test
    fun `falls back to Referer with port`() {
        val req =
            postRequest("/api/users/confirm").apply {
                addHeader("Referer", "http://localhost:5173/users/confirm?token=abc")
            }
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }

    @Test
    fun `rejects cross-origin request`() {
        val req = postRequest("/api/session").apply { addHeader("Origin", "https://evil.example.com") }
        val res = runFilter(req)
        assertEquals(HttpServletResponse.SC_FORBIDDEN, res.status)
        assertTrue(res.contentAsString.contains("Origin not allowed"))
    }

    @Test
    fun `rejects when Origin is the string null and Referer is missing`() {
        val req = postRequest("/api/session").apply { addHeader("Origin", "null") }
        assertEquals(HttpServletResponse.SC_FORBIDDEN, runFilter(req).status)
    }

    @Test
    fun `rejects when neither Origin nor Referer is present`() {
        val req = postRequest("/api/session")
        assertEquals(HttpServletResponse.SC_FORBIDDEN, runFilter(req).status)
    }

    @Test
    fun `rejects when Referer is on a disallowed host`() {
        val req = postRequest("/api/users").apply { addHeader("Referer", "https://evil.example.com/signup") }
        assertEquals(HttpServletResponse.SC_FORBIDDEN, runFilter(req).status)
    }

    @Test
    fun `does not check GET requests`() {
        val req = MockHttpServletRequest("GET", "/api/session").apply { requestURI = "/api/session" }
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }

    @Test
    fun `does not check POST to unprotected paths`() {
        val req = postRequest("/api/admin/users")
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }

    @Test
    fun `does not check DELETE on protected paths`() {
        val req = MockHttpServletRequest("DELETE", "/api/session").apply { requestURI = "/api/session" }
        assertEquals(HttpServletResponse.SC_OK, runFilter(req).status)
    }
}

private object NoopFilterChain : FilterChain {
    override fun doFilter(
        request: ServletRequest?,
        response: ServletResponse?,
    ) {
        // Tests only care about response status set by the filter itself.
    }
}
