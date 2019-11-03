package com.seu.blog.controller;

import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ethan
 * @date 2018/12/14
 */
@RestController
@RequestMapping("/freemarker")
public class StaticController {

    @RequestMapping("/home")
    public String home(ModelMap modelMap) {

        modelMap.put("name", "Magical Sam");

        List<String> list = new ArrayList<>();
        list.add("sam a");
        list.add("sam b");
        list.add("sam c");
        list.add("sam d");
        modelMap.put("list", list);

        return "home";
    }
}
