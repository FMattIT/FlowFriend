package pl.flow.dao;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.GoalStrength;
import pl.flow.dao.entities.calendar.MinusTile;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Created by Admin on 10.09.2017.
 */

@Transactional
@Repository
public class GoalStrengthDao {

    @PersistenceContext
    private EntityManager entityManager;

    public GoalStrength getGoalStrengthToMerge(GoalStrength goalStrength){
        return entityManager.createQuery("SELECT g FROM GoalStrength g WHERE g.goalId = ? AND g.userId = ? AND g.date = ?", GoalStrength.class)
                .setParameter(1, goalStrength.getGoalId())
                .setParameter(2, goalStrength.getUserId())
                .setParameter(3, goalStrength.getDate()).getSingleResult();
    }

    public Object getPreviousGoalStrength(GoalStrength goalStrength){
        try{
            return entityManager.createNativeQuery("SELECT strength FROM public.goals_strengths WHERE goal_id_id=? AND user_id_id=? AND date<=? ORDER BY date DESC LIMIT 1")
                .setParameter(1, goalStrength.getGoalId())
                .setParameter(2, goalStrength.getUserId())
                .setParameter(3, goalStrength.getDate()).getSingleResult();
        }
        catch(Exception exception){
            return 0;
        }
    }

    public GoalStrength save(GoalStrength goalStrength){
        try{
            goalStrength.setId(getGoalStrengthToMerge(goalStrength).getId());
            return entityManager.merge(goalStrength);
        }
        catch(NoResultException e){
            entityManager.persist(goalStrength);
        }
        return goalStrength;
    }

    public List<GoalStrength> getGoalStrengthsList(Goal goal){
        return entityManager.createQuery("SELECT g FROM GoalStrength g WHERE g.goalId=? ORDER BY g.id, g.date ASC", GoalStrength.class)
                .setParameter(1, goal).getResultList(); }
}
