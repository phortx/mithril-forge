package de.entropylabs.mithrilforge.features.users

import de.entropylabs.mithrilforge.util.PasswordEncoder
import org.jetbrains.exposed.v1.core.SortOrder
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

data class UserSummaryRow(
    val id: String,
    val email: String,
    val isEmailVerified: Boolean,
    val isActive: Boolean,
    val role: String,
    val createdAt: String,
)

@Repository
class UserRepository {
    @Transactional
    fun findById(id: String): User? {
        val uuid = UUID.fromString(id)
        return User.findById(uuid)
    }

    @Transactional
    fun findByEmail(email: String): User? = User.find { Users.email eq email }.firstOrNull()

    @Transactional
    fun findAll(): List<User> = User.all().toList()

    @Transactional
    fun pagedSummaries(
        limit: Int,
        offset: Long,
    ): List<UserSummaryRow> =
        Users
            .selectAll()
            .orderBy(Users.createdAt, SortOrder.DESC)
            .limit(limit)
            .offset(offset)
            .map { row ->
                UserSummaryRow(
                    id = row[Users.id].value.toString(),
                    email = row[Users.email],
                    isEmailVerified = row[Users.isEmailVerified],
                    isActive = row[Users.isActive],
                    role = row[Users.role],
                    createdAt = row[Users.createdAt].toString(),
                )
            }

    @Transactional
    fun countAll(): Long = Users.selectAll().count()

    @Transactional
    fun create(
        email: String,
        password: String,
    ): User =
        User.new {
            this.email = email
            passwordHash = PasswordEncoder.encode(password)
            createdAt = OffsetDateTime.now()
            updatedAt = OffsetDateTime.now()
        }

    @Transactional
    fun confirm(user: User) {
        user.isEmailVerified = true
    }
}
