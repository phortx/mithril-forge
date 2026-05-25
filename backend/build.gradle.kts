plugins {
	kotlin("jvm") version "2.2.21"
	kotlin("plugin.spring") version "2.2.21"
	id("org.springframework.boot") version "4.0.6"
	id("io.spring.dependency-management") version "1.1.7"
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

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-session-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	implementation("io.sentry:sentry-spring-boot-4-starter")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.2")
	implementation("tools.jackson.module:jackson-module-kotlin")
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
    environment.remove("GITHUB_ACTIONS")   // prevent wrong Vite base-path (/mithril-forge/ vs /)
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
    doFirst { delete(staticResources) }   // verhindert stale chunks nach Renames
    from(frontendDist)
    into(staticResources)
}

// Nur bootJar (Production) bekommt Frontend; bootRun bleibt schlank für Dev
tasks.named("bootJar") { dependsOn(copyFrontend) }

// processResources liest static/ — muss nach copyFrontend laufen
tasks.named("processResources") { dependsOn(copyFrontend) }

tasks.named<Delete>("clean") {
    delete(staticResources, frontendDist)
}

// Frontend-Tests via Gradle (optional, parallel zu bun run test im justfile)
val bunTest by tasks.registering(Exec::class) {
    group = "verification"
    description = "Run frontend tests via Bun"
    dependsOn(bunInstall)
    workingDir = frontendDir.asFile
    commandLine("bun", "run", "test")
}
