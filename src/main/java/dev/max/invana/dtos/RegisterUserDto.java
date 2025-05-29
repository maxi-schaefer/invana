package dev.max.invana.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Max
 * @since 10/3/2024
 */

@Getter
@Setter
public class RegisterUserDto {
    private String email;
    private String password;
    private String fullName;
    private String role;
}