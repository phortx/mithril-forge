package de.entropylabs.mithrilforge.features.users

import de.entropylabs.mithrilforge.services.EmailService
import de.entropylabs.mithrilforge.services.TokenService
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

data class SignUpRequest(
    @field:NotBlank(message = "email or password invalid")
    val email: String,
    @field:NotBlank(message = "email or password invalid")
    val password: String,
)

@RestController
@RequestMapping("/api/users")
class UsersController(
    @Value("\${spring.application.url}") private val url: String,
    private val userRepository: UserRepository,
    private val emailService: EmailService,
    private val tokenService: TokenService,
) {
    @PostMapping("/")
    fun signUp(
        @Valid @RequestBody payload: SignUpRequest,
    ): ResponseEntity<Map<String, String>> {
        if (userRepository.findByEmail(payload.email) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                mapOf("error" to "User with this Email already exists"),
            )
        }

        val user = userRepository.create(payload.email, payload.password)
        val token = tokenService.generateConfirmationToken(user.id.value, user.email)

        emailService.sendSimpleEmail(
            to = user.email,
            subject = "Welcome to Mithril Forge!",
            text = "Click here to confirm your account: https://$url/users/confirm?token=$token",
        )

        return ResponseEntity.status(HttpStatus.CREATED).body(
            mapOf("email" to user.email),
        )
    }

    @PostMapping("/confirm")
    fun confirm(
        @RequestParam("token") token: String,
    ): ResponseEntity<Map<String, String>> {
        if (token.isBlank()) throw IllegalArgumentException("token invalid")

        val decoded = tokenService.verifyToken(token)
        val user = userRepository.findById(decoded.subject) ?: throw IllegalArgumentException("token invalid")

        if (decoded.getClaim("email").asString() != user.email) throw IllegalArgumentException("token invalid")

        userRepository.confirm(user)

        return ResponseEntity.ok(mapOf("isConfirmed" to "true"))
    }
}
