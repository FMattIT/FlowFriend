package pl.flow.dao;

import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.Tile;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by Admin on 21.06.2017.
 */

@Transactional
@Repository
public class TileDao {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Tile> getTile(Goal goal){
        return entityManager.createQuery("SELECT t FROM Tile t WHERE t.goalId = ?", Tile.class)
                .setParameter(1, goal).getResultList();
    }

    public Tile getTileToMerge(Tile tile){
        return entityManager.createQuery("SELECT t FROM Tile t WHERE t.day = ? AND t.month = ? AND t.year = ? AND t.goalId = ? AND t.userId = ?", Tile.class)
                .setParameter(1, tile.getDay())
                .setParameter(2, tile.getMonth())
                .setParameter(3, tile.getYear())
                .setParameter(4, tile.getGoalId())
                .setParameter(5, tile.getUserId()).getSingleResult();
    }

    public Tile save(Tile tile){
        try{
            tile.setId(getTileToMerge(tile).getId());
            return entityManager.merge(tile);
        }
        catch(NoResultException e){
            entityManager.persist(tile);
        }
        return tile;
    }

    public List<Tile> getTilesList(){
        return entityManager.createQuery("SELECT t FROM Tile t", Tile.class).getResultList(); }

    public void delete(Goal goal){
      for(Tile t : getTile(goal)) {
          entityManager.remove(t);
      }
    }
}
