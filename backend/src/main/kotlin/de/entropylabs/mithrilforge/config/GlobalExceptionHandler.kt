package de.entropylabs.mithrilforge.config

import com.auth0.jwt.exceptions.JWTVerificationException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, String>> {
        val errorMessage =
            ex.bindingResult.fieldErrors
                .firstOrNull()
                ?.defaultMessage ?: "Invalid request"
        return ResponseEntity.badRequest().body(mapOf("error" to errorMessage))
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(ex: IllegalArgumentException): ResponseEntity<Map<String, String>> =
        ResponseEntity.badRequest().body(mapOf("error" to (ex.message ?: "Unknown error")))

    @ExceptionHandler(JWTVerificationException::class)
    fun handleJWTVerificationException(ex: JWTVerificationException): ResponseEntity<Map<String, String>> =
        ResponseEntity.badRequest().body(mapOf("error" to "token invalid"))
}
