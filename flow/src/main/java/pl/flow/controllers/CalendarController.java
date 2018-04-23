package pl.flow.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.*;
import pl.flow.service.*;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Locale;

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
    MinusTileService minusTileService;

    @RequestMapping(value = "/calendar")
    public String home() {
        return "calendar";
    }

    @RequestMapping(value="/calendar/requests/goals", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public List<Goal> getGoals(Principal principal) {
        return goalService.getGoals(usersService.getUserByUsername(principal.getName()));
    }

    @RequestMapping(value="/calendar/requests/goals/save", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Goal save(@RequestBody Goal goal, Principal principal) {
        if(goal.getName().length() > 170 || goal.getName().length() < 4){
            return null;
        }
        else {
            List<Goal> list = goalService.getGoals(usersService.getUserByUsername(principal.getName()));
            if (list.isEmpty() || list==null){
                goal.setCreateDate(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
                goal.setUserId(usersService.getUserByUsername(principal.getName()));
            }
            else {
                for(Goal g : list){
                    if(g.getId() == goal.getId()) {
                        goal.setCreateDate(g.getCreateDate());
                    }
                    else {
                        goal.setCreateDate(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
                    }
                    goal.setUserId(usersService.getUserByUsername(principal.getName()));
                }
            }
        }
        goalService.save(goal);
        return goal;
    }

    @RequestMapping(value="/calendar/requests/goals/delete", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Goal delete(@RequestBody Goal goal, Principal principal) {
        goalService.delete(goal);
        return goal;
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

        int monthNumber = Integer.parseInt(tile.getMonth()) + 1;
        String stringDate = tile.getYear() + "-" + monthNumber + "-" + tile.getDay();
        if(tile.getMonth().length() == 1 && tile.getDay().length() == 1)
        {
            stringDate = tile.getYear() + "-0" + monthNumber + "-0" + tile.getDay();
        }
        else{
            if(tile.getMonth().length() == 1){
                stringDate = tile.getYear() + "-0" + monthNumber + "-" + tile.getDay();
            }
            if(tile.getDay().length() == 1) {
                stringDate = tile.getYear() + "-" + monthNumber + "-0" + tile.getDay();
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd", new Locale("pl"));
        LocalDate date = LocalDate.parse(stringDate, formatter);
        tile.setDate(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate dayBeforeYesterday = today.minusDays(2);

        System.out.println(today);
        System.out.println(yesterday);
        System.out.println(dayBeforeYesterday);

//        if(date.equals(today) || date.equals(yesterday) || date.equals(dayBeforeYesterday)){
//            System.out.println("zly dzien, nie dodajemy :)");
//        }

        if(tileService.getTileToMerge(tile) == null) {
            return tileService.save(tile);
        }
        else {
            tile.setId(tileService.getTileToMerge(tile).getId());
            return tileService.save(tile);
        }
    }

    @RequestMapping(value="/calendar/requests/minus/tiles", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object getMinusTiles(@RequestBody Goal goal,Principal principal) {
        try{
            minusTileService.getMinusTile(goal);
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
            minusTile.setGoalId(goal);
            minusTile.setUserId(goal.getUserId());
            minusTileService.save(minusTile);
        }
        return minusTileService.getMinusTile(goal);
    }

    @RequestMapping(value="/calendar/requests/minus/tiles/save", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public MinusTile save(@RequestBody MinusTile minusTile, Principal principal) {
        User user = usersService.getUserByUsername(principal.getName());
        minusTile.setUserId(user);
        minusTileService.save(minusTile);
        return minusTile;
    }

    @RequestMapping(value="/calendar/requests/tiles/scores/current", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object getCurrentScore(@RequestBody Goal goal, Principal principal) {
        return tileService.getCurrentScore(goal);
    }

    @RequestMapping(value="/calendar/requests/tiles/scores/record", method= RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public Object getRecordScore(@RequestBody Goal goal, Principal principal) {
        if (tileService.getRecordScore(goal) == null) {
            return 0;
        }
        else {
            return tileService.getRecordScore(goal);
        }
    }
}
