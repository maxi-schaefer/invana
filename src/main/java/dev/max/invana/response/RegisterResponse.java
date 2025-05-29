package dev.max.invana.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * @author Max
 * @since 10/4/2024
 */

@Getter
@Setter
public class RegisterResponse {

    private UserDetails user;
    private String token;
    private long expiresIn;

}