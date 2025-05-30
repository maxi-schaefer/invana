package dev.max.invana.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgentRegistrationDto {
    private String name;
    private String hostname;
    private String ip;
    private String environment;
    private String os;
    private int services;
    String version;
}
