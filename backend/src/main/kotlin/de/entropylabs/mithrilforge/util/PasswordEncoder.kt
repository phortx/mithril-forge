package de.entropylabs.mithrilforge.util

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

object PasswordEncoder {
    private val encoder = BCryptPasswordEncoder()

    fun encode(password: String): String = encoder.encode(password).orEmpty()

    fun matches(
        rawPassword: String,
        encodedPassword: String,
    ): Boolean = encoder.matches(rawPassword, encodedPassword)
}
