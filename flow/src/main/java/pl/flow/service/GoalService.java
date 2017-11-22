package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.GoalDao;
import pl.flow.dao.UsersDao;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.Goal;

import java.util.List;

/**
 * Created by Admin on 21.06.2017.
 */

@Service("goalService")
public class GoalService {

    private GoalDao goalDao;

    @Autowired
    public void setGoalDao(GoalDao goalDao) {
        this.goalDao = goalDao;
    }


    public void save(Goal goal) {
        goalDao.save(goal);
    }

    public void delete(Goal goal){
        goalDao.delete(goal);
    }

    public List<Goal> getGoals(User user){
        return goalDao.getGoals(user);
    }

    public List<Goal> getGoalsList() {
        return goalDao.getGoalsList();
    }

}
