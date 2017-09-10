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
    GoalMaxCountService goalMaxCountService;

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
        int actual = actual_big.intValue();
        int max = goalMaxCountService.getTheBiggestMaxCount(tilek, cel).getMax_count().intValue();
        GoalMaxCount sssss = goalMaxCountService.getTheBiggestMaxCount(tilek, cel);
        LocalDate ldt = new java.sql.Date(sssss.getDate().getTime()).toLocalDate();
        User user = usersService.getUserByUsername(principal.getName());

        int biggerValues = ((BigInteger) goalMaxCountService.getBiggerValues(tilek, cel)).intValue();
        int smallerValues = ((BigInteger) goalMaxCountService.getSmallerValues(tilek, cel)).intValue();

        if(max>=actual){
            System.out.println("Max wiekszy/rowny aktual! brak aktualizacji");
        }
        else if(actual>max && (tilek.getFlag().equals("TICK") || tilek.getFlag().equals("YELLOWTICK"))){
            GoalMaxCount newMaxCount = new GoalMaxCount();
            LocalDate date = LocalDate.of(Integer.parseInt(tilek.getYear()), Integer.parseInt(tilek.getMonth()), Integer.parseInt(tilek.getDay()));
            newMaxCount.setDate(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));
            newMaxCount.setGoalId(cel);
            newMaxCount.setMax_count(Long.valueOf(actual));
            newMaxCount.setUserId(user);
            goalMaxCountService.save(newMaxCount);
            System.out.println("Aktualizacja...");
        }

        if(biggerValues>smallerValues){
            goalMaxCountService.deleteSmallerValues(tilek, cel);
            System.out.println("Should delete smaller values.");
        }
        else if(biggerValues<=smallerValues){
            goalMaxCountService.deleteBiggerValues(tilek, cel);
            System.out.println("Should delete bigger values.");
        }

        LocalDate date = LocalDate.of(Integer.parseInt(tilek.getYear()), Integer.parseInt(tilek.getMonth()), Integer.parseInt(tilek.getDay()));
        System.out.println(java.sql.Date.valueOf(date));

        System.out.println("Bigger values: " + biggerValues);
        System.out.println("Smaller values: " + smallerValues);
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
    public List<GoalStrength> returnStrengths(Principal principal) {
        return goalStrengthService.getGoalStrengthsList();
    }
}
