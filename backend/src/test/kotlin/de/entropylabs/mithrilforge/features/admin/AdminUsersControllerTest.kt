package de.entropylabs.mithrilforge.features.admin

import de.entropylabs.mithrilforge.TestcontainersConfiguration
import de.entropylabs.mithrilforge.features.users.User
import de.entropylabs.mithrilforge.features.users.UserRepository
import de.entropylabs.mithrilforge.features.users.Users
import de.entropylabs.mithrilforge.services.TokenService
import jakarta.servlet.http.Cookie
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.update
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration::class)
@Transactional
class AdminUsersControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var tokenService: TokenService

    @Test
    fun `stats returns total and verified counts for admin`() {
        userRepository.create("user1@example.com", "password123")
        userRepository.create("user2@example.com", "password123")
        val admin = userRepository.create("admin@example.com", "password123")
        promoteToAdmin(admin)

        val token = tokenService.generateSessionToken(admin.id.value)

        mockMvc
            .get("/api/admin/users/stats") {
                cookie(Cookie("session_token", token))
            }.andExpect {
                status { isOk() }
                jsonPath("$.total") { value(3) }
                jsonPath("$.verified") { value(0) }
                jsonPath("$.unverified") { value(3) }
                jsonPath("$.daily.length()") { value(30) }
            }
    }

    @Test
    fun `stats counts verified users correctly`() {
        val verified = userRepository.create("verified@example.com", "password123")
        userRepository.confirm(verified)
        val admin = userRepository.create("admin@example.com", "password123")
        promoteToAdmin(admin)

        val token = tokenService.generateSessionToken(admin.id.value)

        mockMvc
            .get("/api/admin/users/stats") {
                cookie(Cookie("session_token", token))
            }.andExpect {
                status { isOk() }
                jsonPath("$.total") { value(2) }
                jsonPath("$.verified") { value(1) }
                jsonPath("$.unverified") { value(1) }
            }
    }

    @Test
    fun `stats returns 403 for regular user`() {
        val user = userRepository.create("user@example.com", "password123")
        val token = tokenService.generateSessionToken(user.id.value)

        mockMvc
            .get("/api/admin/users/stats") {
                cookie(Cookie("session_token", token))
            }.andExpect { status { isForbidden() } }
    }

    @Test
    fun `stats returns 403 for unauthenticated request`() {
        mockMvc
            .get("/api/admin/users/stats")
            .andExpect { status { isForbidden() } }
    }

    @Test
    fun `stats returns 403 for invalid token`() {
        mockMvc
            .get("/api/admin/users/stats") {
                cookie(Cookie("session_token", "invalid.token.signature"))
            }.andExpect { status { isForbidden() } }
    }

    @Test
    fun `stats returns 30 daily entries with zero-filled gaps`() {
        val admin = userRepository.create("admin@example.com", "password123")
        promoteToAdmin(admin)
        userRepository.create("user@example.com", "password123")

        val token = tokenService.generateSessionToken(admin.id.value)

        val response =
            mockMvc
                .get("/api/admin/users/stats") {
                    cookie(Cookie("session_token", token))
                }.andExpect { status { isOk() } }
                .andReturn()

        val body = response.response.contentAsString
        assertTrue(body.contains("\"date\":\""), "Response should contain dated entries")
        assertTrue(body.contains("\"count\":2"), "Response should reflect 2 registrations")
        assertTrue(body.contains("\"count\":0"), "Response should contain zero-filled days")
    }

    @Test
    fun `list returns paginated users for admin`() {
        repeat(3) { i ->
            userRepository.create("user$i@example.com", "password123")
        }
        val admin = userRepository.create("admin@example.com", "password123")
        promoteToAdmin(admin)

        val token = tokenService.generateSessionToken(admin.id.value)

        mockMvc
            .get("/api/admin/users?page=0&size=2") {
                cookie(Cookie("session_token", token))
            }.andExpect {
                status { isOk() }
                jsonPath("$.data.length()") { value(2) }
                jsonPath("$.total") { value(4) }
                jsonPath("$.page") { value(0) }
                jsonPath("$.size") { value(2) }
            }
    }

    @Test
    fun `list returns 403 for regular user`() {
        val user = userRepository.create("user@example.com", "password123")
        val token = tokenService.generateSessionToken(user.id.value)

        mockMvc
            .get("/api/admin/users") {
                cookie(Cookie("session_token", token))
            }.andExpect { status { isForbidden() } }
    }

    @Test
    fun `list caps size at 100`() {
        val admin = userRepository.create("admin@example.com", "password123")
        promoteToAdmin(admin)
        val token = tokenService.generateSessionToken(admin.id.value)

        mockMvc
            .get("/api/admin/users?size=10000") {
                cookie(Cookie("session_token", token))
            }.andExpect {
                status { isOk() }
                jsonPath("$.size") { value(100) }
            }
    }

    @Test
    fun `list rejects negative page with 400`() {
        val admin = userRepository.create("admin@example.com", "password123")
        promoteToAdmin(admin)
        val token = tokenService.generateSessionToken(admin.id.value)

        mockMvc
            .get("/api/admin/users?page=-1") {
                cookie(Cookie("session_token", token))
            }.andExpect { status { isBadRequest() } }
    }

    @Test
    fun `list rejects zero size with 400`() {
        val admin = userRepository.create("admin@example.com", "password123")
        promoteToAdmin(admin)
        val token = tokenService.generateSessionToken(admin.id.value)

        mockMvc
            .get("/api/admin/users?size=0") {
                cookie(Cookie("session_token", token))
            }.andExpect { status { isBadRequest() } }
    }

    private fun promoteToAdmin(user: User) {
        Users.update({ Users.id eq user.id }) {
            it[role] = "ROLE_ADMIN"
        }
    }
}
