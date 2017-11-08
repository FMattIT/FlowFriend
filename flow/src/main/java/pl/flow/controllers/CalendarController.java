package pl.flow.controllers;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.*;
import pl.flow.service.*;

import javax.persistence.NoResultException;
import java.awt.image.TileObserver;
import java.math.BigInteger;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    @RequestMapping(value="/calendar/requests/goals", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Goal> getGoals(Principal principal) {
        return goalService.getGoals(usersService.getUserByUsername(principal.getName()));
    }

    @RequestMapping(value="/calendar/requests/goals/save", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Goal addGoal(Principal principal) {
//        return goalService.getGoals(usersService.getUserByUsername(principal.getName()));
        return null;
    }

    @RequestMapping(value="/calendar/requests/tiles", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Tile> getTiles(@RequestBody Goal goal, Principal principal) {
        return tileService.getTiles(usersService.getUserByUsername(principal.getName()), goal);
    }

    @RequestMapping(value="/calendar/requests/tiles/save", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Tile save(@RequestBody Tile tile, Principal principal) {
        tile.setUserId(usersService.getUserByUsername(principal.getName()));
        try{
            tile.setId(tileService.getTileToMerge(tile).getId());
        }
        catch(Exception e) {
            System.out.println("exception");
        }
        return tileService.save(tile);
    }

    @RequestMapping(value="/calendar/requests/tiles/scores/current", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Tile> getCurrentScore(@RequestBody Goal goal, Principal principal) {
        return tileService.getTiles(usersService.getUserByUsername(principal.getName()), goal);
    }

    @RequestMapping(value="/calendar/requests/tiles/scores/record", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Tile> getRecordScore(@RequestBody Goal goal, Principal principal) {
        return tileService.getTiles(usersService.getUserByUsername(principal.getName()), goal);
    }




    @RequestMapping(value = "/calendar")
    public String home() {
        return "calendar";
    }

    @RequestMapping(value = "/original")
    public String original() {
        return "original";
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
        return tileService.getMaxCount(cel);
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
            goal.setCreateDate(new Date());
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
            goal.setCreateDate((goalService.getGoal(goal.getId())).getCreateDate());
            goalService.save(goal);

            return goal;
        }
    }

    @RequestMapping(value="/calendar/deleteGoal", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Goal> deleteGoal(@RequestBody Goal goal, Principal principal) {
        User user = usersService.getUserByUsername(principal.getName());
        goal.setUserId(user);
//        tileService.delete(goal);
        minusTileService.delete(goal);
        goalService.delete(goal);

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
        SimpleDateFormat dt1 = new SimpleDateFormat("yyyyy-mm-dd");
        String date_s = tile.getYear() + "-" + tile.getMonth() + "-" + tile.getDay();
        Date data = null;
        try {
            data = dt1.parse(date_s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        tile.setDate(data);
        tileService.save(tile);
        return tile;
    }

}
