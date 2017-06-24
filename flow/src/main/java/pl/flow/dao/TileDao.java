package pl.flow.dao;

import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.Tile;

import javax.persistence.EntityManager;
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

    public Tile save(Tile tile){
        return entityManager.merge(tile);
    }

    public List<Tile> getTilesList(){
        return entityManager.createQuery("SELECT t FROM Tile t", Tile.class).getResultList(); }
}
