package de.entropylabs.mithrilforge.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

@Configuration
class ProxyConfig {
    @Bean
    fun proxyRestTemplate(): RestTemplate = RestTemplate()
}
