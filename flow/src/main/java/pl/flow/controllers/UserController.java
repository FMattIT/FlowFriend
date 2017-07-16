package pl.flow.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import pl.flow.dao.entities.User;
import pl.flow.service.UsersService;

/**
 * Created by Admin on 21.04.2017.
 */

@Controller
public class UserController {

    @Autowired
    private UsersService usersService;

    @RequestMapping("/login")
    public String login() {
        return "login";
    }

    @RequestMapping("/main")
    public String main() {
        return "main";
    }

    @RequestMapping("/")
    public String home() {
        return "hello";
    }

    @RequestMapping(value="/register")
    public String register(@ModelAttribute(value="user") User user) {
        return "register";
    }

    @RequestMapping(value="/createaccount", method= RequestMethod.POST)
    public String createAccount(@ModelAttribute(value="user") User user) {

        if(user != null){
            usersService.create(user);
            return "redirect:/";
        }

        return "register";
    }
}
