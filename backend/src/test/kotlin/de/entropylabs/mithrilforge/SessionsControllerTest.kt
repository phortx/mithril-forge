package de.entropylabs.mithrilforge

import de.entropylabs.mithrilforge.features.users.UserRepository
import de.entropylabs.mithrilforge.services.TokenService
import jakarta.servlet.http.Cookie
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Import(TestcontainersConfiguration::class)
@Transactional
class SessionsControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var tokenService: TokenService

    @Test
    fun `login returns ok with valid credentials and sets session cookie`() {
        userRepository.create("test@example.com", "password123")

        mockMvc
            .post("/api/session") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "test@example.com", "password": "password123"}"""
            }.andExpect {
                status { isOk() }
                jsonPath("$.email") { value("test@example.com") }
                cookie {
                    exists("session_token")
                    httpOnly("session_token", true)
                    path("session_token", "/")
                }
                header {
                    string("Set-Cookie", org.hamcrest.Matchers.containsString("SameSite=Strict"))
                    string("Set-Cookie", org.hamcrest.Matchers.containsString("Max-Age="))
                }
            }
    }

    @Test
    fun `login returns unauthorized with wrong password`() {
        userRepository.create("test@example.com", "password123")

        mockMvc
            .post("/api/session") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "test@example.com", "password": "wrongpassword"}"""
            }.andExpect {
                status { isUnauthorized() }
                jsonPath("$.error") { value("Unknown email / password combination") }
            }
    }

    @Test
    fun `login returns unauthorized with unknown email`() {
        mockMvc
            .post("/api/session") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "unknown@example.com", "password": "password123"}"""
            }.andExpect {
                status { isUnauthorized() }
                jsonPath("$.error") { value("Unknown email / password combination") }
            }
    }

    @Test
    fun `login returns bad request when email is empty`() {
        mockMvc
            .post("/api/session") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "", "password": "password123"}"""
            }.andExpect {
                status { isBadRequest() }
            }
    }

    @Test
    fun `login returns bad request when password is empty`() {
        mockMvc
            .post("/api/session") {
                contentType = MediaType.APPLICATION_JSON
                content = """{"email": "test@example.com", "password": ""}"""
            }.andExpect {
                status { isBadRequest() }
            }
    }

    @Test
    fun `logout returns ok and clears session cookie`() {
        mockMvc
            .delete("/api/session")
            .andExpect {
                status { isOk() }
                cookie {
                    exists("session_token")
                    value("session_token", "")
                    maxAge("session_token", 0)
                }
            }
    }

    @Test
    fun `session returns user data with valid cookie`() {
        val user = userRepository.create("test@example.com", "password123")
        val token = tokenService.generateSessionToken(user.id.value)

        mockMvc
            .get("/api/session") {
                cookie(Cookie("session_token", token))
            }.andExpect {
                status { isOk() }
                jsonPath("$.email") { value("test@example.com") }
                jsonPath("$.id") { value(user.id.toString()) }
            }
    }

    @Test
    fun `session returns unauthorized when cookie is missing`() {
        mockMvc
            .get("/api/session")
            .andExpect {
                status { isUnauthorized() }
            }
    }

    @Test
    fun `session returns unauthorized when token is invalid`() {
        mockMvc
            .get("/api/session") {
                cookie(Cookie("session_token", "invalid.token.signature"))
            }.andExpect {
                status { isUnauthorized() }
            }
    }
}
