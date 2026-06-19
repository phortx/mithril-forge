package de.entropylabs.mithrilforge.features.admin

import de.entropylabs.mithrilforge.features.users.Users
import org.jetbrains.exposed.v1.core.SortOrder
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.greaterEq
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneOffset

data class DailyRegistration(
    val date: LocalDate,
    val count: Long,
)

data class UserStats(
    val total: Long,
    val verified: Long,
    val unverified: Long,
    val daily: List<DailyRegistration>,
)

@Repository
class AdminDashboardRepository {
    @Transactional
    fun stats(): UserStats {
        val total = Users.selectAll().count()
        val verified = Users.selectAll().where { Users.isEmailVerified eq true }.count()
        val unverified = total - verified

        val since = OffsetDateTime.now().minusDays(30)
        val rows =
            Users
                .selectAll()
                .where { Users.createdAt greaterEq since }
                .orderBy(Users.createdAt, SortOrder.ASC)
                .toList()

        val rowsByDay: Map<LocalDate, Long> =
            rows
                .map { row ->
                    val created: OffsetDateTime = row[Users.createdAt]
                    created.atZoneSameInstant(ZoneOffset.UTC).toLocalDate() to 1L
                }.groupBy({ it.first }, { it.second })
                .mapValues { (_, counts) -> counts.sum() }

        val today = LocalDate.now(ZoneOffset.UTC)
        val daily: List<DailyRegistration> =
            (0L..29L)
                .map { offset -> today.minusDays(29 - offset) }
                .map { date -> DailyRegistration(date, rowsByDay[date] ?: 0L) }

        return UserStats(total, verified, unverified, daily)
    }
}
