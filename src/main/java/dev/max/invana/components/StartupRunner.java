package dev.max.invana.components;

import dev.max.invana.entities.User;
import dev.max.invana.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class StartupRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0) {
            User admin = new User();
            admin.setFullName("Default Admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);
            log.info("✅ Default admin user created: admin@example.com / admin123");
        } else {
            log.info("Users already exist. Skipping default admin creation.");
        }
    }
}
