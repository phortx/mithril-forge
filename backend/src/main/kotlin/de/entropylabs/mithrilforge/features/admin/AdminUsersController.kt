package de.entropylabs.mithrilforge.features.admin

import de.entropylabs.mithrilforge.features.users.UserRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
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
        val users = userRepository.findAll()
        val from = (page * size).coerceAtMost(users.size)
        val to = (from + size).coerceAtMost(users.size)
        val data =
            users.subList(from, to).map { user ->
                UserSummary(
                    id = user.id.value.toString(),
                    email = user.email,
                    isEmailVerified = user.isEmailVerified,
                    isActive = user.isActive,
                    role = user.role,
                    createdAt = user.createdAt.toString(),
                )
            }
        return mapOf(
            "data" to data,
            "total" to users.size,
            "page" to page,
            "size" to size,
        )
    }
}
