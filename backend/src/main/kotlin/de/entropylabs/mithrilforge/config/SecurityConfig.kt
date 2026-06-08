package de.entropylabs.mithrilforge.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() } // For now, disable CSRF for API endpoints
            .authorizeHttpRequests { auth ->
                auth
                    // Public endpoints
                    .requestMatchers("/api/**")
                    .permitAll()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**")
                    .permitAll()
                    // Frontend static assets and React Router fallback
                    .requestMatchers("/**")
                    .permitAll()
                    // Everything else
                    .anyRequest()
                    .authenticated()
            }.httpBasic { it.disable() }
            .formLogin { it.disable() }

        return http.build()
    }
}
