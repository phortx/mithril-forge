package de.entropylabs.mithrilforge.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * SPA-Routing: forwards all non-API, non-static paths to index.html
 * so that React Router deep links work when served from the JAR.
 */
@Configuration
class WebMvcConfig : WebMvcConfigurer {
    override fun addViewControllers(registry: ViewControllerRegistry) {
        // Paths without a dot (i.e. not asset files) → forward to index.html
        registry.addViewController("/{path:[^.]*}").setViewName("forward:/index.html")
    }
}
