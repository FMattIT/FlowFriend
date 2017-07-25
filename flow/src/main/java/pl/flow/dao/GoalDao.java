package pl.flow.dao;

import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.calendar.Goal;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by Admin on 21.06.2017.
 */

@Transactional
@Repository
public class GoalDao {

    @PersistenceContext
    private EntityManager entityManager;

    public Goal save(Goal goal){
        return entityManager.merge(goal);
    }

    public Goal getGoal(Long id){
        return entityManager.find(Goal.class, id);
    }

    public List<Goal> getGoalsList(){
        return entityManager.createQuery("SELECT g FROM Goal g ORDER BY g.id ASC", Goal.class).getResultList(); }

    public void delete(Goal goal){
        entityManager.remove(entityManager.merge(goal));
    }
}
