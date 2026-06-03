package de.entropylabs.mithrilforge

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class StatusController {
    @GetMapping("/status")
    fun status(): Map<String, String> =
        mapOf(
            "status" to "ok",
            "app" to "mithril-forge",
        )
}
