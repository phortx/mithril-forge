package de.entropylabs.mithrilforge.services

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
class TokenService(
    @Value("${"$"}{spring.application.secret:very-secret-string}") private val secret: String,
) {
    private val algorithm by lazy { Algorithm.HMAC256(secret) }
    private val issuer = "mithril-forge"

    fun generateConfirmationToken(
        userId: UUID,
        email: String,
    ): String =
        JWT
            .create()
            .withIssuer(issuer)
            .withSubject(userId.toString())
            .withClaim("email", email)
            .withExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
            .sign(algorithm)

    fun verifyToken(token: String): DecodedJWT {
        val verifier =
            JWT
                .require(algorithm)
                .withIssuer(issuer)
                .build()

        return verifier.verify(token)
    }

    fun generateSessionToken(userId: UUID): String =
        JWT
            .create()
            .withIssuer(issuer)
            .withSubject(userId.toString())
            .withExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
            .sign(algorithm)
}
