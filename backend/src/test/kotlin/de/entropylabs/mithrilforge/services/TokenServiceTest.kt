package de.entropylabs.mithrilforge.services

import com.auth0.jwt.exceptions.JWTVerificationException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

class TokenServiceTest {
    private val secret = "test-secret-key-that-needs-to-be-long-enough"
    private val tokenService = TokenService(secret = secret)

    @Test
    fun `generateConfirmationToken should generate a valid JWT`() {
        val userId = UUID.randomUUID()
        val email = "test@example.com"

        val token = tokenService.generateConfirmationToken(userId, email)

        assertNotNull(token)
        assertTrue(token.isNotBlank())
    }

    @Test
    fun `verifyToken should successfully verify a valid token and return correct claims`() {
        val userId = UUID.randomUUID()
        val email = "test@example.com"

        val token = tokenService.generateConfirmationToken(userId, email)
        val decodedJWT = tokenService.verifyToken(token)

        assertEquals("mithril-forge", decodedJWT.issuer)
        assertEquals(userId.toString(), decodedJWT.subject)
        assertEquals(email, decodedJWT.getClaim("email").asString())
    }

    @Test
    fun `verifyToken should throw exception for tampered token`() {
        val userId = UUID.randomUUID()
        val email = "test@example.com"

        val token = tokenService.generateConfirmationToken(userId, email)
        val tamperedToken = token + "a"

        assertThrows<JWTVerificationException> {
            tokenService.verifyToken(tamperedToken)
        }
    }

    @Test
    fun `verifyToken should throw exception for token signed with different secret`() {
        val userId = UUID.randomUUID()
        val email = "test@example.com"

        val token = tokenService.generateConfirmationToken(userId, email)

        val differentTokenService = TokenService(secret = "different-secret")
        assertThrows<JWTVerificationException> {
            differentTokenService.verifyToken(token)
        }
    }

    @Test
    fun `generateSessionToken should embed a 7-day expiry claim`() {
        val userId = UUID.randomUUID()
        val before = Instant.now().plus(7, ChronoUnit.DAYS).minus(1, ChronoUnit.MINUTES)

        val token = tokenService.generateSessionToken(userId)

        val decoded = tokenService.verifyToken(token)
        val after = Instant.now().plus(7, ChronoUnit.DAYS).plus(1, ChronoUnit.MINUTES)
        assertNotNull(decoded.expiresAt)
        val expiresAt = decoded.expiresAt.toInstant()
        assertTrue(expiresAt.isAfter(before))
        assertTrue(expiresAt.isBefore(after))
    }

    @Test
    fun `generateSessionToken should produce a verifiable token`() {
        val userId = UUID.randomUUID()

        val token = tokenService.generateSessionToken(userId)

        val decoded = tokenService.verifyToken(token)
        assertEquals("mithril-forge", decoded.issuer)
        assertEquals(userId.toString(), decoded.subject)
    }
}
