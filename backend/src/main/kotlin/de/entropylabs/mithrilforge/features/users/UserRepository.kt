package de.entropylabs.mithrilforge.features.users

import de.entropylabs.mithrilforge.util.PasswordEncoder
import org.jetbrains.exposed.v1.core.eq
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

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
