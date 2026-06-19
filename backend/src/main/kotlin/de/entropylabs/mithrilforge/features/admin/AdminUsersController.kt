package de.entropylabs.mithrilforge.features.admin

import de.entropylabs.mithrilforge.features.users.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDate

data class UserStatsResponse(
    val total: Long,
    val verified: Long,
    val unverified: Long,
    val daily: List<DailyRegistrationResponse>,
)

data class DailyRegistrationResponse(
    val date: LocalDate,
    val count: Long,
)

data class UserSummary(
    val id: String,
    val email: String,
    val isEmailVerified: Boolean,
    val isActive: Boolean,
    val role: String,
    val createdAt: String,
)

@RestController
@RequestMapping("/api/admin/users")
class AdminUsersController(
    private val adminDashboardRepository: AdminDashboardRepository,
    private val userRepository: UserRepository,
) {
    @GetMapping("/stats")
    fun stats(): UserStatsResponse {
        val stats = adminDashboardRepository.stats()
        return UserStatsResponse(
            total = stats.total,
            verified = stats.verified,
            unverified = stats.unverified,
            daily = stats.daily.map { DailyRegistrationResponse(it.date, it.count) },
        )
    }

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): Map<String, Any> {
        if (page < 0 || size < 1) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "page must be >= 0 and size must be >= 1")
        }
        val cappedSize = size.coerceAtMost(MAX_PAGE_SIZE)
        val offset = page.toLong() * cappedSize.toLong()
        val total = userRepository.countAll()
        val data =
            userRepository.pagedSummaries(limit = cappedSize, offset = offset).map { row ->
                UserSummary(
                    id = row.id,
                    email = row.email,
                    isEmailVerified = row.isEmailVerified,
                    isActive = row.isActive,
                    role = row.role,
                    createdAt = row.createdAt,
                )
            }
        return mapOf(
            "data" to data,
            "total" to total,
            "page" to page,
            "size" to cappedSize,
        )
    }

    companion object {
        private const val MAX_PAGE_SIZE = 100
    }
}
