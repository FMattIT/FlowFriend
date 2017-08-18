package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.GoalDao;
import pl.flow.dao.TileDao;
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

    public Tile save(Tile tile){
        return tileDao.save(tile);
    }

    public List<Tile> getTilesList(){
        return tileDao.getTilesList(); }

    public List<Tile> getTile(Goal goal){
        return tileDao.getTile(goal);
    }

    public Tile getTileToMerge(Tile tile){
        return tileDao.getTileToMerge(tile);
    }

    public void delete(Goal goal){
        tileDao.delete(goal);
    }

    public Object getActualCount(Goal goal){
        return tileDao.getActualCount(goal);
    }

}
