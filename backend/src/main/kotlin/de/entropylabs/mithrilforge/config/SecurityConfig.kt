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
        originCheckFilter: OriginCheckFilter,
    ): SecurityFilterChain {
        http
            .cors { } // Enable CORS globally
            // CSRF is intentionally disabled: the session cookie uses SameSite=Strict,
            // which blocks cross-site cookie submission on all authenticated state-changing
            // endpoints. Unauthenticated writes (login/signup) are covered by OriginCheckFilter.
            // See documentation/src/content/docs/technical-docs/explanation/tracking-and-cookies.md.
            .csrf { it.disable() }
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
            .addFilterBefore(originCheckFilter, SessionTokenAuthFilter::class.java)

        return http.build()
    }
}
