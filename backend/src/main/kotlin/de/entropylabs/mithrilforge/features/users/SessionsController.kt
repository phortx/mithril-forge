package de.entropylabs.mithrilforge.features.users

import de.entropylabs.mithrilforge.services.TokenService
import de.entropylabs.mithrilforge.util.PasswordEncoder
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
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
            val cookie = sessionCookie(user.id.value)

            return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(mapOf("email" to user.email))
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            mapOf("error" to "Unknown email / password combination"),
        )
    }

    private fun sessionCookie(userId: UUID): ResponseCookie {
        val token = tokenService.generateSessionToken(userId)

        return ResponseCookie.from("session_token", token)
            .httpOnly(true)
            .path("/")
            .maxAge(Duration.ofDays(7))
            .sameSite("Strict")
            .build()
    }
}
