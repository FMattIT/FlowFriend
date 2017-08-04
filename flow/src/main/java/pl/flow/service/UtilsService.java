package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.entities.calendar.Goal;

import java.math.BigInteger;

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

    public void updateMaxCount(Goal goal){
        Long actual_count = ((BigInteger) tileService.getActualCount(goal)).longValue();
        Long max_count =  ((BigInteger) goalService.getMaxCount(goal)).longValue();

        if(actual_count>max_count){
            goal.setMax_count(actual_count);
            goalService.updateMaxCount(goal);
        }
    }
}
