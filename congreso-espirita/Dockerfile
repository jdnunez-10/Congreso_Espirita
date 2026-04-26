# ========= BUILD =========
FROM --platform=linux/amd64 maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests clean package

# ========= RUNTIME =========
FROM --platform=linux/amd64 eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

RUN useradd -m springuser
USER springuser

ENV JAVA_OPTS="-Xms256m -Xmx512m"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]