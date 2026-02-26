# Dockerfile в корне — для Render (Root Directory пустой)
# Сборка backend
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY backend/pom.xml .
RUN mvn dependency:go-offline -B || true

COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/Ruhequelle-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
