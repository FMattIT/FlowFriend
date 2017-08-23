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
    public User checkLogin(@RequestBody User user, Principal principal) {
        int amountOfUsersByLogin = ((BigInteger) usersService.checkIfUserExistsByLogin(user.getUsername())).intValue();
        int amountOfUsersByEmail = ((BigInteger) usersService.checkIfUserExistsByEmail(user.getEmail())).intValue();

        return user;
    }

    @RequestMapping(value="/createaccount", method= RequestMethod.POST)
    public String createAccount(@ModelAttribute(value="user") User user) {

        if(user != null){
            int sss = ((BigInteger) usersService.checkIfUserExistsByLogin(user.getUsername())).intValue();
            int sss1 = ((BigInteger) usersService.checkIfUserExistsByEmail(user.getEmail())).intValue();
            if(sss == 1)
            {
                System.out.println("User exists by username!");
            }
            if(sss1 == 1){
                System.out.println("User exists by email!");
            }
            if(user.getPassword().equals(user.getConfirmPassword())){
            user.setAuthority("USER");
            user.setEnabled(true);
            usersService.create(user);
            return "redirect:/";
            }
            else{
                System.out.println("Passwords dont match!");
            }
        }

        return "register";
    }
}
