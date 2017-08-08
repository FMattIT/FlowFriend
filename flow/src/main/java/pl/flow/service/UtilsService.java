package pl.flow.service;

import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.MinusTile;
import pl.flow.dao.entities.calendar.Tile;

import java.math.BigInteger;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    public void updateMaxCount(Goal goal){
        Long actual_count = ((BigInteger) tileService.getActualCount(goal)).longValue();
        Long max_count =  ((BigInteger) goalService.getMaxCount(goal)).longValue();

        if(actual_count>max_count){
            goal.setMax_count(actual_count);
            goalService.updateMaxCount(goal);
        }
    }

//    @Scheduled(cron = "0 57 12 * * *")
//    @Scheduled(fixedDelay = 3000)
    public void checkMinusDays(){
        LocalDateTime l = LocalDateTime.now();

        int dayOfWeek = l.getDayOfWeek().getValue()-1;
        int dayOfMonth = l.getDayOfMonth();
        int month = l.getMonthValue() - 1;
        int year = l.getYear();

//        System.out.print(dayOfWeek);

        List<MinusTile> list = minusTileService.getMinusTilesList();
        for(MinusTile mt:list){
            switch (dayOfWeek) {
                case 0:
                if(mt.getFirstDay() == "true"){
                    minusTileLogic(dayOfMonth, mt, month, year);
                }
                break;

                case 1:
                    System.out.print(mt.getSecondDay());
                    if(mt.getSecondDay().equals("true")){
                        minusTileLogic(dayOfMonth, mt, month, year);
                    }
                    break;

                case 2:
                    if(mt.getThirdDay() == "true"){
                        minusTileLogic(dayOfMonth, mt, month, year);
                    }
                    break;

                case 3:
                    if(mt.getFourthDay() == "true"){
                        minusTileLogic(dayOfMonth, mt, month, year);
                    }
                    break;

                case 4:
                    if(mt.getFifthDay() == "true"){
                        minusTileLogic(dayOfMonth, mt, month, year);
                    }
                    break;

                case 5:
                    if(mt.getSixthDay() == "true"){
                        minusTileLogic(dayOfMonth, mt, month, year);
                    }
                    break;

                case 6:
                    if(mt.getSeventhDay() == "true"){
                        minusTileLogic(dayOfMonth, mt, month, year);
                    }
                    break;
            }
        }

    }

    public void minusTileLogic(int dayOfMonth, MinusTile mt, int month, int year){
        Tile tile = new Tile();
        tile.setDay(String.valueOf(dayOfMonth));
        tile.setFlag("MINUS");
        tile.setGoalId(mt.getGoalId());
        tile.setUserId(mt.getUserId());
        tile.setMonth(String.valueOf(month));
        tile.setYear(String.valueOf(year));
        tileService.save(tile);
    }
}
