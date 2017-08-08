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

    public Goal getGoal(Long id){
        return goalDao.getGoal(id);
    }

    public void save(Goal goal) {
        goalDao.save(goal);
    }

    public List<Goal> getGoalsList(){
        return goalDao.getGoalsList(); }

    public List<Goal> getUserGoalsList(User user){
        return goalDao.getUserGoalsList(user); }

    public void delete(Goal goal){
        goalDao.delete(goal);
    }

    public Object getMaxCount(Goal goal){
        return goalDao.getMaxCount(goal);
    }

    public void updateMaxCount(Goal goal){
        goalDao.updateMaxCount(goal);
    }
}
