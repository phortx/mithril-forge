package de.entropylabs.mithrilforge.features.users

import com.auth0.jwt.exceptions.JWTVerificationException
import de.entropylabs.mithrilforge.services.TokenService
import de.entropylabs.mithrilforge.util.PasswordEncoder
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Duration
import java.util.UUID

data class LoginRequest(
    @field:NotBlank(message = "email or password invalid")
    val email: String,
    @field:NotBlank(message = "email or password invalid")
    val password: String,
)

@RestController
@RequestMapping("/api/session")
class SessionsController(
    private val userRepository: UserRepository,
    private val tokenService: TokenService,
) {
    @PostMapping
    fun login(
        @Valid @RequestBody payload: LoginRequest,
    ): ResponseEntity<Map<String, String>> {
        val user: User? = userRepository.findByEmail(payload.email)

        if (user != null && PasswordEncoder.matches(payload.password, user.passwordHash)) {
            val cookie = createSessionCookie(user.id.value)

            return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(mapOf("email" to user.email))
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            mapOf("error" to "Unknown email / password combination"),
        )
    }

    @DeleteMapping
    fun logout(): ResponseEntity<Map<String, String>> =
        ResponseEntity
            .ok()
            .header(HttpHeaders.SET_COOKIE, clearSessionCookie().toString())
            .build()

    @GetMapping
    fun session(
        @CookieValue("session_token", required = false) sessionToken: String?,
    ): ResponseEntity<Map<String, String>> {
        if (sessionToken == null) return unauthorized()

        try {
            val user = userRepository.findById(tokenService.verifyToken(sessionToken).subject)

            return if (user == null) {
                unauthorized()
            } else {
                ResponseEntity.ok().body(
                    mapOf(
                        "id" to user.id.toString(),
                        "email" to user.email,
                    ),
                )
            }
        } catch (_: JWTVerificationException) {
            return unauthorized()
        } catch (_: IllegalArgumentException) {
            return unauthorized()
        }
    }

    private fun buildCookie(
        token: String,
        maxAge: Duration,
    ): ResponseCookie =
        ResponseCookie
            .from("session_token", token)
            .httpOnly(true)
            .path("/")
            .sameSite("Strict")
            .maxAge(maxAge)
            .build()

    private fun createSessionCookie(userId: UUID): ResponseCookie =
        buildCookie(tokenService.generateSessionToken(userId), Duration.ofDays(7))

    private fun clearSessionCookie(): ResponseCookie = buildCookie("", Duration.ZERO)

    private fun unauthorized(): ResponseEntity<Map<String, String>> = ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
}
