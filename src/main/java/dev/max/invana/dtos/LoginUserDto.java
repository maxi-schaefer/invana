package dev.max.invana.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Max
 * @since 10/3/2024
 */

@Getter
@Setter
public class LoginUserDto {
    private String email;
    private String password;
}