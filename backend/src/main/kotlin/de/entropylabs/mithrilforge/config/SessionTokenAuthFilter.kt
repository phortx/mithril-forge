package de.entropylabs.mithrilforge.config

import com.auth0.jwt.exceptions.JWTVerificationException
import de.entropylabs.mithrilforge.features.users.UserRepository
import de.entropylabs.mithrilforge.services.TokenService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class SessionTokenAuthFilter(
    private val tokenService: TokenService,
    private val userRepository: UserRepository,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val cookies = request.cookies
        val token = cookies?.firstOrNull { it.name == "session_token" }?.value

        if (token != null && SecurityContextHolder.getContext().authentication == null) {
            try {
                val decoded = tokenService.verifyToken(token)
                val user = userRepository.findById(decoded.subject)
                if (user != null) {
                    val authentication =
                        UsernamePasswordAuthenticationToken(
                            user.id.value.toString(),
                            null,
                            listOf(SimpleGrantedAuthority(user.role)),
                        )
                    SecurityContextHolder.getContext().authentication = authentication
                }
            } catch (ex: JWTVerificationException) {
                logger.debug("Rejected session token", ex)
            } catch (ex: IllegalArgumentException) {
                if (ex.message?.contains("Invalid UUID") == true) {
                    logger.debug("Unknown token subject", ex)
                } else {
                    throw ex
                }
            }
        }

        filterChain.doFilter(request, response)
    }
}
