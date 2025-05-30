package dev.max.invana.components;

import dev.max.invana.entities.User;
import dev.max.invana.entities.AgentSettings;
import dev.max.invana.repositories.UserRepository;
import dev.max.invana.repositories.AgentSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class StartupRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AgentSettingsRepository agentSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${invana.defaultAdminEmail}")
    private String defaultAdminEmail;

    @Value("${invana.defaultAdminPassword}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) {
        setupDefaultUser();
    }

    private void setupDefaultUser() {
        if (userRepository.count() == 0) {
            if (defaultAdminEmail.isEmpty() || defaultAdminPassword.isEmpty()) {
                log.info("No default credentials provided!");
                return;
            }

            User admin = new User();
            admin.setFullName("Default Admin");
            admin.setEmail(defaultAdminEmail);
            admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);
            log.info("✅ Default admin user created: {} / {}", defaultAdminEmail, defaultAdminPassword);
        } else {
            log.info("Users already exist. Skipping default admin creation.");
        }
    }
}
