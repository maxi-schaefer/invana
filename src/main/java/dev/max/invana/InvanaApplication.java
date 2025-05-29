package dev.max.invana;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"dev.max.invana"})
public class InvanaApplication {

	public static void main(String[] args) {
		SpringApplication.run(InvanaApplication.class, args);
	}

}
