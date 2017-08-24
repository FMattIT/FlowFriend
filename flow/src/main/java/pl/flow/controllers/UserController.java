package pl.flow.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.MinusTile;
import pl.flow.service.UsersService;

import java.math.BigInteger;
import java.security.Principal;

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

    @RequestMapping(value="/register/checkData", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public String checkLogin(@RequestBody User user, Principal principal) {
        int amountOfUsersByLogin = ((BigInteger) usersService.checkIfUserExistsByLogin(user.getUsername())).intValue();
        int amountOfUsersByEmail = ((BigInteger) usersService.checkIfUserExistsByEmail(user.getEmail())).intValue();

        return "{\"login\":"+amountOfUsersByLogin+", \"email\":"+amountOfUsersByEmail+"}";
    }

    @RequestMapping(value="/createaccount", method= RequestMethod.POST)
    public String createAccount(@ModelAttribute(value="user") User user) {
        int amountOfUsersByLogin = ((BigInteger) usersService.checkIfUserExistsByLogin(user.getUsername())).intValue();
        int amountOfUsersByEmail = ((BigInteger) usersService.checkIfUserExistsByEmail(user.getEmail())).intValue();

        if(user != null){
            if(user.getPassword().equals(user.getConfirmPassword()) && amountOfUsersByLogin == 0 && amountOfUsersByEmail == 0){
            user.setAuthority("USER");
            user.setEnabled(true);
            usersService.create(user);
            return "redirect:/";
            }
        }

        return "register";
    }
}
