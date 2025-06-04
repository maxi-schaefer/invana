package dev.max.invana.model;

import lombok.Data;

@Data
public class Script {

    private String id;
    private String name;
    private String description;
    private String command;
    private String category;
    private String usage;

}
