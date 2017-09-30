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

    @Autowired
    GoalStrengthService goalStrengthService;

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
        int p = Integer.parseInt(tileService.getMaxCount(cel).toString());
        System.out.print(p);
        return tileService.getActualCount(cel);
    }

    @RequestMapping(value="/calendar/maxCounter", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object maxCounter(@RequestBody LinkedHashMap<String, Object> goalAndTile, Principal principal) {
        ObjectMapper mapper = new ObjectMapper();
        Goal celek = mapper.convertValue(goalAndTile.get("goal"), Goal.class);
        LocalDateTime localDateTime = LocalDateTime.now();
        Tile tilek = mapper.convertValue(goalAndTile.get("tile"), Tile.class);
        Goal cel = goalService.getGoal(celek.getId());
        BigInteger actual_big = (BigInteger) tileService.getActualCount(cel);
        return tileService.getActualCount(cel);
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
        goal.setName(goalService.getGoal(goal.getId()).getName());
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

    @RequestMapping(value="/calendar/saveStrength", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public GoalStrength saveStrength(@RequestBody GoalStrength goalStrength, Principal principal) {
        User user = usersService.getUserByUsername(principal.getName());
        goalStrength.setUserId(user);
        goalStrength.setStrength(Long.parseLong(goalStrengthService.getPreviousGoalStrength(goalStrength).toString())+goalStrength.getStrength());
        goalStrengthService.save(goalStrength);
        return goalStrength;
    }

    @RequestMapping(value="/calendar/returnStrengths", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<GoalStrength> returnStrengths(@RequestBody Goal goal, Principal principal) {
        return goalStrengthService.getGoalStrengthsList(goal);
    }
}
