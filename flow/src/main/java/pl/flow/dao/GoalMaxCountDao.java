package pl.flow.dao;

import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.GoalMaxCount;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.swing.text.html.parser.Entity;
import javax.transaction.Transactional;
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

    public GoalMaxCount getTheBiggestMaxCount(){
        return entityManager.createQuery("SELECT g FROM GoalMaxCount g WHERE g.max_count = (SELECT MAX(g.max_count) FROM GoalMaxCount g)", GoalMaxCount.class)
                .getSingleResult(); }
}
