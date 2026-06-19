package de.entropylabs.mithrilforge.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun filterChain(
        http: HttpSecurity,
        sessionTokenAuthFilter: SessionTokenAuthFilter,
    ): SecurityFilterChain {
        http
            .cors { } // Enable CORS globally
            .csrf { it.disable() } // TODO: Re-enable CSRF for /api/admin/** or switch to Bearer token before adding write endpoints
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                auth
                    // Admin endpoints must come BEFORE the generic /api/** matcher
                    .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")
                    // Public endpoints
                    .requestMatchers("/api/**", "/t/**")
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
            .addFilterBefore(sessionTokenAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}
