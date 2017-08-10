package pl.flow.service;

import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.MinusTile;
import pl.flow.dao.entities.calendar.Tile;

import java.math.BigInteger;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoField;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalField;
import java.util.List;

/**
 * Created by Admin on 04.08.2017.
 */

@Service("utilsService")
public class UtilsService {

    @Autowired
    UsersService usersService;

    @Autowired
    GoalService goalService;

    @Autowired
    TileService tileService;

    @Autowired
    MinusTileService minusTileService;

    @Autowired
    GoalMaxCountService goalMaxCountService;

    @Scheduled(fixedDelay = 3000)
    public void updateMaxCount(){
        System.out.print((goalMaxCountService.getTheBiggestMaxCount()).getMax_count());
    }

//    @Scheduled(cron = "01 00 00 * * *")
//    @Scheduled(fixedDelay = 3000)
    public void checkMinusDays(){
        LocalDateTime l = LocalDateTime.now();

        int dayOfWeek = l.getDayOfWeek().getValue()-1;
        int dayOfMonth = l.getDayOfMonth();
        int month = l.getMonthValue() - 1;
        int year = l.getYear();

        List<MinusTile> list = minusTileService.getMinusTilesList();
        for(MinusTile mt:list){
            switch (dayOfWeek) {
                case 0:
                if(mt.getFirstDay().equals("true")){
                    minusTileLogic(dayOfMonth, mt.getGoalId(), mt.getUserId(), month, year, "MINUS");
                }
                break;

                case 1:
                    if(mt.getSecondDay().equals("true")){
                        minusTileLogic(dayOfMonth, mt.getGoalId(), mt.getUserId(), month, year, "MINUS");
                    }
                    break;

                case 2:
                    if(mt.getThirdDay().equals("true")){
                        minusTileLogic(dayOfMonth, mt.getGoalId(), mt.getUserId(), month, year, "MINUS");
                    }
                    break;

                case 3:
                    if(mt.getFourthDay().equals("true")){
                        minusTileLogic(dayOfMonth, mt.getGoalId(), mt.getUserId(), month, year, "MINUS");
                    }
                    break;

                case 4:
                    if(mt.getFifthDay().equals("true")){
                        minusTileLogic(dayOfMonth, mt.getGoalId(), mt.getUserId(), month, year, "MINUS");
                    }
                    break;

                case 5:
                    if(mt.getSixthDay().equals("true")){
                        minusTileLogic(dayOfMonth, mt.getGoalId(), mt.getUserId(), month, year, "MINUS");
                    }
                    break;

                case 6:
                    if(mt.getSeventhDay().equals("true")){
                        minusTileLogic(dayOfMonth, mt.getGoalId(), mt.getUserId(), month, year, "MINUS");
                    }
                    break;
            }
        }

    }

    public void minusTileLogic(int dayOfMonth, Goal goalId, User userId, int month, int year, String flag){
        Tile tile = new Tile();
        tile.setDay(String.valueOf(dayOfMonth));
        tile.setFlag(flag);
        tile.setGoalId(goalId);
        tile.setUserId(userId);
        tile.setMonth(String.valueOf(month));
        tile.setYear(String.valueOf(year));
        tileService.save(tile);
    }

//  @Scheduled(cron = "30 22 13 * * *")
//  @Scheduled(fixedDelay = 3000)
    public void uncheckedDays(){
        LocalDateTime l = LocalDateTime.now();

        int dayOfWeek = l.getDayOfWeek().getValue()-1;
        int dayOfMonth = l.getDayOfMonth();
        int month = l.getMonthValue() - 1;
        int year = l.getYear();

        int uncheckedDayOfMonth = dayOfMonth - 3;
        List<Goal> goals = goalService.getGoalsList();
        for(Goal g: goals){
            LocalDateTime ldt = LocalDateTime.ofInstant(g.getCreateDate().toInstant(), ZoneId.systemDefault());
                if(ldt.getDayOfMonth()-3 != uncheckedDayOfMonth && ldt.getMonthValue()-1 != month && ldt.getYear() != year){
                Tile t = new Tile();
                t.setMonth(String.valueOf(month));
                t.setYear(String.valueOf(year));
                t.setGoalId(g);
                t.setUserId(g.getUserId());
                t.setDay(String.valueOf(uncheckedDayOfMonth));
                Tile returnedTile = tileService.getTileToMerge(t);
                    if(returnedTile == null || returnedTile.equals(null) || returnedTile instanceof Tile)
                    {
                        minusTileLogic(uncheckedDayOfMonth, t.getGoalId(), t.getUserId(), month, year, "CROSS");
                    }
            }
        }
    }
}
