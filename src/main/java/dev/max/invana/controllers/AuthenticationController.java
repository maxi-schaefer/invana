package dev.max.invana.controllers;

import dev.max.invana.dtos.LoginUserDto;
import dev.max.invana.dtos.RegisterUserDto;
import dev.max.invana.entities.User;
import dev.max.invana.response.LoginResponse;
import dev.max.invana.response.RegisterResponse;
import dev.max.invana.services.AuthenticationService;
import dev.max.invana.services.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author Max
 * @since 10/3/2024
 */

@RequestMapping("/api/auth")
@RestController
@AllArgsConstructor
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUser(authenticatedUser);
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getJwtExpiration());

        return ResponseEntity.ok(loginResponse);
    }

}