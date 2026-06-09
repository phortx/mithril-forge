plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.spring") version "2.2.21"
    id("org.springframework.boot") version "4.0.6"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.jlleitschuh.gradle.ktlint") version "12.1.2"
}

group = "de.entropy-labs"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(24)
    }
}

repositories {
    mavenCentral()
}

extra["sentryVersion"] = "8.27.0"
extra["testcontainersVersion"] = "1.21.3"
extra["exposedVersion"] = "1.3.0"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("com.auth0:java-jwt:4.4.0")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.jetbrains.exposed:exposed-spring-boot4-starter:${property("exposedVersion")}")
    implementation("org.jetbrains.exposed:exposed-core:${property("exposedVersion")}")
    implementation("org.jetbrains.exposed:exposed-dao:${property("exposedVersion")}")
    implementation("org.jetbrains.exposed:exposed-jdbc:${property("exposedVersion")}")
    implementation("org.jetbrains.exposed:exposed-java-time:${property("exposedVersion")}")
    implementation("org.springframework.boot:spring-boot-starter-session-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-flyway")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("io.sentry:sentry-spring-boot-4-starter")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.2")
    implementation("tools.jackson.module:jackson-module-kotlin")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    developmentOnly("org.springframework.boot:spring-boot-docker-compose")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-jdbc-test")
    testImplementation("org.springframework.boot:spring-boot-starter-session-jdbc-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    implementation(kotlin("stdlib-jdk8"))
}

dependencyManagement {
    imports {
        mavenBom("io.sentry:sentry-bom:${property("sentryVersion")}")
        mavenBom("org.testcontainers:testcontainers-bom:${property("testcontainersVersion")}")
    }
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
    }
}

ktlint {
    version.set("1.8.0")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// --- Frontend Build Integration ---

val frontendDir = layout.projectDirectory.dir("../frontend")
val frontendDist = frontendDir.dir("dist")
val staticResources = layout.projectDirectory.dir("src/main/resources/static")

val bunInstall by tasks.registering(Exec::class) {
    group = "frontend"
    description = "Install frontend dependencies (frozen lockfile)"
    workingDir = frontendDir.asFile
    commandLine("bun", "install", "--frozen-lockfile")
    inputs.file(frontendDir.file("package.json"))
    inputs.file(frontendDir.file("bun.lock"))
    outputs.dir(frontendDir.dir("node_modules"))
}

val bunBuild by tasks.registering(Exec::class) {
    group = "frontend"
    description = "Build frontend with Vite/Bun"
    dependsOn(bunInstall)
    workingDir = frontendDir.asFile
    commandLine("bun", "run", "build")

    inputs.dir(frontendDir.dir("src"))
    inputs.dir(frontendDir.dir("public"))
    inputs.file(frontendDir.file("index.html"))
    inputs.file(frontendDir.file("vite.config.ts"))
    inputs.file(frontendDir.file("tsconfig.json"))
    inputs.file(frontendDir.file("package.json"))
    outputs.dir(frontendDist)
}

val copyFrontend by tasks.registering(Copy::class) {
    group = "frontend"
    description = "Copy Vite dist into Spring Boot static resources"
    dependsOn(bunBuild)
    doFirst { delete(staticResources) } // verhindert stale chunks nach Renames
    from(frontendDist)
    into(staticResources)
}

// --- Documentation Build Integration ---

val docsDir = layout.projectDirectory.dir("../documentation")
val docsDist = docsDir.dir("dist")

val npmInstallDocs by tasks.registering(Exec::class) {
    group = "documentation"
    description = "Install documentation dependencies"
    workingDir = docsDir.asFile
    commandLine("bun", "install")
    inputs.file(docsDir.file("package.json"))
    inputs.file(docsDir.file("package-lock.json"))
    outputs.dir(docsDir.dir("node_modules"))
}

val npmBuildDocs by tasks.registering(Exec::class) {
    group = "documentation"
    description = "Build documentation with Astro"
    dependsOn(npmInstallDocs)
    workingDir = docsDir.asFile
    commandLine("bun", "run", "build")
    inputs.dir(docsDir.dir("src"))
    inputs.dir(docsDir.dir("public"))
    inputs.file(docsDir.file("astro.config.mjs"))
    inputs.file(docsDir.file("package.json"))
    outputs.dir(docsDist)
}

val copyDocs by tasks.registering(Copy::class) {
    group = "documentation"
    description = "Copy Astro dist into Spring Boot static resources under /documentation"
    dependsOn(npmBuildDocs)
    mustRunAfter(copyFrontend)
    from(docsDist)
    into(staticResources.dir("documentation"))
}

// Nur bootJar (Production) bekommt Frontend; bootRun bleibt schlank für Dev
tasks.named("bootJar") {
    dependsOn(copyFrontend)
    dependsOn(copyDocs)
}

// processResources liest static/ — muss nach copyFrontend laufen
tasks.named("processResources") {
    dependsOn(copyFrontend)
    dependsOn(copyDocs)
}

tasks.named<Delete>("clean") {
    delete(staticResources, frontendDist, docsDist)
}

// Frontend-Tests via Gradle (optional, parallel zu bun run test im justfile)
val bunTest by tasks.registering(Exec::class) {
    group = "verification"
    description = "Run frontend tests via Bun"
    dependsOn(bunInstall)
    workingDir = frontendDir.asFile
    commandLine("bun", "run", "test")
}
