package pl.flow.service;

import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.MinusTile;

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

//    @Scheduled(fixedDelay = 3000)
    public void checkMinusDays(){
        LocalDateTime l = LocalDateTime.now();

        Long dayOfWeek = l.getLong(ChronoField.DAY_OF_WEEK);
        Long dayOfMonth = l.getLong(ChronoField.DAY_OF_MONTH);
        int month = l.getMonthValue() - 1;
        int year = l.getYear();

        List<MinusTile> list = minusTileService.getMinusTilesRealList();

        System.out.println(month + " " + dayOfMonth + " " + year);
    }
}
