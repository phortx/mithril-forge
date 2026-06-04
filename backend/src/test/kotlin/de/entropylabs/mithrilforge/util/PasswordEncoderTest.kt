package de.entropylabs.mithrilforge.util

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class PasswordEncoderTest {
    @Test
    fun `encode should generate different hashes for same password`() {
        val password = "mySecretPassword123!"

        val hash1 = PasswordEncoder.encode(password)
        val hash2 = PasswordEncoder.encode(password)

        assertTrue(hash1.isNotBlank())
        assertTrue(hash2.isNotBlank())
        assertNotEquals(hash1, hash2)
    }

    @Test
    fun `matches should return true for correct password`() {
        val password = "mySecretPassword123!"
        val encoded = PasswordEncoder.encode(password)

        assertTrue(PasswordEncoder.matches(password, encoded))
    }

    @Test
    fun `matches should return false for incorrect password`() {
        val password = "mySecretPassword123!"
        val wrongPassword = "wrongPassword!"
        val encoded = PasswordEncoder.encode(password)

        assertFalse(PasswordEncoder.matches(wrongPassword, encoded))
    }
}
