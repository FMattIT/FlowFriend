package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.GoalDao;
import pl.flow.dao.TileDao;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.Tile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Created by Admin on 23.06.2017.
 */

@Service("tileService")
public class TileService {

    private TileDao tileDao;

    @Autowired
    public void setTileDao(TileDao tileDao) {
        this.tileDao = tileDao;
    }


    public Tile save(Tile tile) {
        return tileDao.save(tile);
    }

    public void delete(Goal goal){
        tileDao.delete(goal);
    }

    public List<Tile> getTiles(User user, Goal goal){
        return tileDao.getTiles(user, goal);
    }

    public List<Tile> getTile(Goal goal) {
        return tileDao.getTile(goal);
    }

    public Tile getTileToMerge(Tile tile){
        return tileDao.getTileToMerge(tile);
    }

    public Object getCurrentScore(Goal goal){
        return tileDao.getCurrentScore(goal);
    }

    public Object getRecordScore(Goal goal){
        return tileDao.getRecordScore(goal);
    }

}
