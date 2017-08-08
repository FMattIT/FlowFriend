package pl.flow.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.MinusTile;
import pl.flow.dao.entities.calendar.Tile;
import pl.flow.service.*;

import javax.persistence.NoResultException;
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

    @Autowired
    UtilsService utilsService;

    @Autowired
    MinusTileService minusTileService;

    @RequestMapping(value = "/calendar")
    public String home() {
        return "calendar";
    }

    @RequestMapping(value="/calendar/retrieveMinusTiles", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object retrieveMinusTiles(@RequestBody Goal goal,Principal principal) {
        Goal cel = goalService.getGoal(goal.getId());
        try{
            minusTileService.getMinusTile(cel);
        }
        catch (Exception ex){
            MinusTile minusTile = new MinusTile();
            minusTile.setFirstDay("false");
            minusTile.setSecondDay("false");
            minusTile.setThirdDay("false");
            minusTile.setFifthDay("false");
            minusTile.setSixthDay("false");
            minusTile.setSeventhDay("false");
            minusTile.setFourthDay("false");
            minusTile.setGoalId(cel);
            minusTile.setUserId(cel.getUserId());
            minusTileService.save(minusTile);
        }
        return minusTileService.getMinusTile(cel);
    }

    @RequestMapping(value="/calendar/updateMinusTile", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public MinusTile updateMinusTile(@RequestBody MinusTile minusTile, Principal principal) {
        User user = usersService.getUserByUsername(principal.getName());
        minusTile.setUserId(user);
        minusTileService.save(minusTile);
        return minusTile;
    }

    @RequestMapping(value="/calendar/actualCounter", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object actualCounter(@RequestBody Goal goal, Principal principal) {
        Goal cel = goalService.getGoal(goal.getId());
        return tileService.getActualCount(cel);
    }

    @RequestMapping(value="/calendar/maxCounter", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object maxCounter(@RequestBody Goal goal, Principal principal) {
        Goal cel = goalService.getGoal(goal.getId());
        utilsService.updateMaxCount(cel);
        return goalService.getMaxCount(cel);
    }

    @RequestMapping(value="/calendar/addGoal", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Goal addGoal(@RequestBody Goal goal, Principal principal) {
        if(goal.getName().length()>170){
            return null;
        }
        else {
            User user = usersService.getUserByUsername(principal.getName());
            goal.setUserId(user);
            goalService.save(goal);

            return goal;
        }
    }

    @RequestMapping(value="/calendar/editGoal", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Goal editGoal(@RequestBody Goal goal, Principal principal) {
        if(goal.getName().length()>170){
            return null;
        }
        else {
            User user = usersService.getUserByUsername(principal.getName());
            goal.setUserId(user);
            goalService.save(goal);

            return goal;
        }
    }

    @RequestMapping(value="/calendar/deleteGoal", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Goal> deleteGoal(@RequestBody Goal goal, Principal principal) {
        User user = usersService.getUserByUsername(principal.getName());
        goal.setUserId(user);
        tileService.delete(goal);
        minusTileService.delete(goal);
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
