package dev.max.invana.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    // Ensures that React handles routing
    @RequestMapping(value = { "/", "/{path:[^\\.]*}"})
    public String index() {
        return "forward:/index.html";
    }

}