package dev.max.invana.model;

import lombok.Data;

import java.util.List;

@Data
public class ScriptCategories {

    private List<Script> containers;
    private List<Script> databases;
    private List<Script> webservers;
    private List<Script> runtimes;
    private List<Script> customs;

}
