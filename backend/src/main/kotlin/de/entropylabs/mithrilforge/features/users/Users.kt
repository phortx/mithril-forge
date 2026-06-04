package de.entropylabs.mithrilforge.features.users

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.java.UUIDTable
import org.jetbrains.exposed.v1.dao.java.UUIDEntity
import org.jetbrains.exposed.v1.dao.java.UUIDEntityClass
import org.jetbrains.exposed.v1.javatime.timestampWithTimeZone
import java.util.UUID

object Users : UUIDTable("users") {
    val email = varchar("email", 255).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val isActive = bool("is_active").default(true)
    val isEmailVerified = bool("is_email_verified").default(false)
    val role = varchar("role", 50).default("ROLE_USER")
    val createdAt = timestampWithTimeZone("created_at")
    val updatedAt = timestampWithTimeZone("updated_at")
    val lastLoginAt = timestampWithTimeZone("last_login_at").nullable()
}

class User(
    id: EntityID<UUID>,
) : UUIDEntity(id) {
    companion object : UUIDEntityClass<User>(Users)

    var email by Users.email
    var passwordHash by Users.passwordHash
    var isActive by Users.isActive
    var isEmailVerified by Users.isEmailVerified
    var role by Users.role
    var createdAt by Users.createdAt
    var updatedAt by Users.updatedAt
    var lastLoginAt by Users.lastLoginAt
}
