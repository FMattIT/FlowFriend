package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.GoalStrengthDao;
import pl.flow.dao.MinusTileDao;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.GoalStrength;

import java.util.List;

/**
 * Created by Admin on 10.09.2017.
 */

@Service("goalStrengthService")
public class GoalStrengthService {

    private GoalStrengthDao goalStrengthDao;

    @Autowired
    public void setGoalStrengthDao(GoalStrengthDao goalStrengthDao) {
        this.goalStrengthDao = goalStrengthDao;
    }

    public void save(GoalStrength goalStrength){
        goalStrengthDao.save(goalStrength);
    }

    public Object getPreviousGoalStrength(GoalStrength goalStrength){
        return goalStrengthDao.getPreviousGoalStrength(goalStrength);
    }

    public List<GoalStrength> getGoalStrengthsList(Goal goal) {
        return goalStrengthDao.getGoalStrengthsList(goal);
    }

    public void deleteRows(Goal goal){
        goalStrengthDao.deleteRows(goal);
    }
}
