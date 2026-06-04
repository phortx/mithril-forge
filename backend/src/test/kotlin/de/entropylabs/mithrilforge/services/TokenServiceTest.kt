package de.entropylabs.mithrilforge.services

import com.auth0.jwt.exceptions.JWTVerificationException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.test.util.ReflectionTestUtils
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
}
