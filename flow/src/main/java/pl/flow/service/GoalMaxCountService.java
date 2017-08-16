package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.GoalDao;
import pl.flow.dao.GoalMaxCountDao;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.GoalMaxCount;
import pl.flow.dao.entities.calendar.Tile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

/**
 * Created by Admin on 10.08.2017.
 */

@Service("goalMaxCountService")
public class GoalMaxCountService {

    private GoalMaxCountDao goalMaxCountDao;

    @Autowired
    public void setGoalMaxCountDao(GoalMaxCountDao goalMaxCountDao) {
        this.goalMaxCountDao = goalMaxCountDao;
    }

    public GoalMaxCount save(GoalMaxCount goalMaxCount){
        return goalMaxCountDao.save(goalMaxCount);
    }

    public GoalMaxCount getTheBiggestMaxCount(Goal goal){
        return goalMaxCountDao.getTheBiggestMaxCount(goal); }

    public Object getBiggerValues(Tile tile, Goal goal){
        return goalMaxCountDao.getBiggerValues(tile, goal);
    }
}
