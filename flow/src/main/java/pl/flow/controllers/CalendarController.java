package pl.flow.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.Tile;
import pl.flow.service.GoalService;
import pl.flow.service.TileService;
import pl.flow.service.UsersService;

import java.awt.image.TileObserver;
import java.security.Principal;
import java.util.List;

/**
 * Created by Admin on 18.06.2017.
 */

@Controller
public class CalendarController {

    @Autowired
    UsersService usersService;

    @Autowired
    GoalService goalService;

    @Autowired
    TileService tileService;

    @RequestMapping(value = "/calendar")
    public String home() {
        return "calendar";
    }

    @RequestMapping(value="/calendar/addGoal", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Goal addGoal(@RequestBody Goal goal, Principal principal) {
        User user = usersService.getUserByUsername(principal.getName());
        goal.setUserId(user);
        goalService.save(goal);

        return goal;
    }

    @RequestMapping(value="/calendar/editGoal", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Goal editGoal(@RequestBody Goal goal, Principal principal) {
        goalService.save(goal);

        return goal;
    }

    @RequestMapping(value="/calendar/deleteGoal", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Goal> deleteGoal(@RequestBody Goal goal, Principal principal) {
        tileService.delete(goal);
        goalService.delete(goal);

        return goalService.getGoalsList();
    }

    @RequestMapping(value="/calendar/retrieveData/goals", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Goal> retrieveGoals(Principal principal) {
        return goalService.getGoalsList();
    }

    @RequestMapping(value="/calendar/retrieveData/tiles", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object[] retrieveTiles(Principal principal) {
        return new Object[]{tileService.getTilesList(), goalService.getGoalsList()};
    }

    @RequestMapping(value="/calendar/saveTile", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Tile saveTile(@RequestBody Tile tile, Principal principal) {
        User user = usersService.getUserByUsername(principal.getName());
        tile.setUserId(user);
        tileService.save(tile);
        return tile;
    }
}
