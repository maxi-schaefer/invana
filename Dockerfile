# Use a base image with Java and add your jar
FROM openjdk:17-jdk-slim

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Create app directory
WORKDIR /app

# Copy jar (replace with your actual jar name)
COPY ./invana-*.jar app.jar
COPY ./scripts.json scripts.json

# Expose the port your app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
