package pl.flow.dao;

import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.calendar.MinusTile;
import pl.flow.dao.entities.calendar.Tile;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

/**
 * Created by Admin on 06.08.2017.
 */

@Transactional
@Repository
public class MinusTileDao {

    @PersistenceContext
    private EntityManager entityManager;

    public MinusTile getMinusTileToMerge(MinusTile minusTile){
        return entityManager.createQuery("SELECT t FROM MinusTile t WHERE t.goalId = ? AND t.userId = ?", MinusTile.class)
                .setParameter(1, minusTile.getGoalId())
                .setParameter(2, minusTile.getUserId()).getSingleResult();
    }

    public MinusTile save(MinusTile minusTile){
        try{
            minusTile.setId(getMinusTileToMerge(minusTile).getId());
            return entityManager.merge(minusTile);
        }
        catch(NoResultException e){
            entityManager.persist(minusTile);
        }
        return minusTile;
    }

    public Object update(MinusTile minusTile, String day, boolean state){
        return entityManager.createNativeQuery("UPDATE public.minus_tiles WHERE goalId=? AND userId=? SET "+day+"=?")
                .setParameter(1, minusTile.getGoalId())
                .setParameter(2, minusTile.getUserId())
                .setParameter(3, state).getSingleResult();
    }
}
