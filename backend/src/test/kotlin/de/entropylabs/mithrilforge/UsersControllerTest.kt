package de.entropylabs.mithrilforge

import de.entropylabs.mithrilforge.features.users.UserRepository
import de.entropylabs.mithrilforge.services.TokenService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mockito.verify
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Import(TestcontainersConfiguration::class)
@Transactional
class UsersControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @MockitoBean
    lateinit var mailSender: org.springframework.mail.javamail.JavaMailSender

    @Autowired
    lateinit var tokenService: TokenService

    @Autowired
    lateinit var userRepository: UserRepository

    @Test
    fun `signUp creates user and sends email`() {
        mockMvc
            .post("/api/users") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "test@example.com", "password": "password123"}"""
            }.andExpect {
                status { isCreated() }
                jsonPath("$.email") { value("test@example.com") }
            }

        val messageCaptor = ArgumentCaptor.forClass(org.springframework.mail.SimpleMailMessage::class.java)

        verify(mailSender).send(messageCaptor.capture())

        assertEquals("test@example.com", messageCaptor.value.to?.get(0))
        assertEquals("Welcome to Mithril Forge!", messageCaptor.value.subject)
        assertTrue(messageCaptor.value.text?.contains("/users/confirm?token=") == true)

        val user = userRepository.findByEmail("test@example.com")
        requireNotNull(user)
        assertEquals("test@example.com", user.email)
    }

    @Test
    fun `signUp returns bad request for empty email or password`() {
        mockMvc
            .post("/api/users") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "", "password": "password123"}"""
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.error") { exists() }
            }

        mockMvc
            .post("/api/users") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "test@example.com", "password": ""}"""
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.error") { exists() }
            }
    }

    @Test
    fun `signUp returns conflict if email already exists`() {
        // Create user first
        mockMvc
            .post("/api/users") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "test@example.com", "password": "password123"}"""
            }.andExpect {
                status { isCreated() }
            }

        mockMvc
            .post("/api/users") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "test@example.com", "password": "password123"}"""
            }.andExpect {
                status { isConflict() }
                jsonPath("$.error") { exists() }
            }
    }

    @Test
    fun `confirm returns ok for valid token`() {
        // 1. Create a user
        mockMvc
            .post("/api/users") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "confirm@example.com", "password": "password123"}"""
            }.andExpect {
                status { isCreated() }
            }

        // 2. Capture the token sent via email
        val messageCaptor = ArgumentCaptor.forClass(org.springframework.mail.SimpleMailMessage::class.java)
        verify(mailSender).send(messageCaptor.capture())
        val text = messageCaptor.value.text ?: ""
        val token = text.substringAfter("token=")

        // 3. Confirm with token
        mockMvc
            .post("/api/users/confirm") {
                param("token", token)
            }.andExpect {
                status { isOk() }
                jsonPath("$.isConfirmed") { value("true") }
            }

        // 4. Verify user status is updated
        val user = userRepository.findByEmail("confirm@example.com")
        requireNotNull(user)
        assertTrue(user.isEmailVerified)
    }

    @Test
    fun `confirm returns bad request for invalid token`() {
        mockMvc
            .post("/api/users/confirm") {
                param("token", "invalid.jwt.token")
            }.andExpect {
                status { isBadRequest() }
                jsonPath("$.error") { exists() }
            }
    }

    @Test
    fun `confirm returns bad request for missing token`() {
        mockMvc
            .post("/api/users/confirm") {
                // No token param
            }.andExpect {
                status { isBadRequest() }
            }
    }
}
