package pl.flow.dao;

import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.GoalMaxCount;
import pl.flow.dao.entities.calendar.Tile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.swing.text.html.parser.Entity;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

/**
 * Created by Admin on 10.08.2017.
 */

@Transactional
@Repository
public class GoalMaxCountDao {

    @PersistenceContext
    private EntityManager entityManager;

    public GoalMaxCount save(GoalMaxCount goalMaxCount){
        return entityManager.merge(goalMaxCount);
    }

    public GoalMaxCount getTheBiggestMaxCount(Goal goal) {
        try {
            return entityManager.createQuery("SELECT g FROM GoalMaxCount g WHERE g.max_count = (SELECT MAX(g.max_count) FROM GoalMaxCount g) AND g.goalId=? AND g.userId=?", GoalMaxCount.class)
                    .setParameter(1, goal)
                    .setParameter(2, goal.getUserId())
                    .getSingleResult();
        }
        catch(Exception ex){
            GoalMaxCount maxCount = new GoalMaxCount();
            maxCount.setUserId(goal.getUserId());
            maxCount.setGoalId(goal);
            maxCount.setMax_count(1L);
            maxCount.setDate(new Date());
            save(maxCount);
            return entityManager.createQuery("SELECT g FROM GoalMaxCount g WHERE g.max_count = (SELECT MAX(g.max_count) FROM GoalMaxCount g) AND g.goalId=? AND g.userId=?", GoalMaxCount.class)
                    .setParameter(1, goal)
                    .setParameter(2, goal.getUserId())
                    .getSingleResult();
        }
    }

    public Object getBiggerValues(Tile tile, Goal goal){
        LocalDate date = LocalDate.of(Integer.parseInt(tile.getYear()), Integer.parseInt(tile.getMonth()), Integer.parseInt(tile.getDay()));
        return entityManager.createNativeQuery("SELECT COUNT(*) FROM public.goals_max_count AS g WHERE g.date > ? AND g.goal_id_id=? AND g.user_id_id=?")
                .setParameter(1, Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()))
                .setParameter(2, goal)
                .setParameter(3, goal.getUserId())
                .getSingleResult();
    }
}
