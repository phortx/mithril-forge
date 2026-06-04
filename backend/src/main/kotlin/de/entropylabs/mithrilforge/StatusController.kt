package de.entropylabs.mithrilforge

import de.entropylabs.mithrilforge.db.User
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class StatusController {
    @GetMapping("/status")
    @Transactional(readOnly = true)
    fun status(): ResponseEntity<Map<String, String>> =
        try {
            // Checks if DB connection works via Exposed
            User.count()
            
            ResponseEntity.ok(
                mapOf(
                    "status" to "ok",
                    "app" to "mithril-forge",
                    "database" to "connected"
                )
            )
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
                mapOf(
                    "status" to "error",
                    "app" to "mithril-forge",
                    "database" to "disconnected",
                    "error" to (e.message ?: "Unknown error")
                )
            )
        }
}


