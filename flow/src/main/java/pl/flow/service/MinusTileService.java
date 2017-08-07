package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.GoalDao;
import pl.flow.dao.MinusTileDao;
import pl.flow.dao.entities.calendar.MinusTile;

import javax.persistence.NoResultException;
import java.util.List;

/**
 * Created by Admin on 06.08.2017.
 */

@Service("minusTileService")
public class MinusTileService {

    private MinusTileDao minusTileDao;

    @Autowired
    public void setMinusTileDao(MinusTileDao minusTileDao) {
        this.minusTileDao = minusTileDao;
    }

    public List<MinusTile> getMinusTilesList(){
        return minusTileDao.getMinusTilesList(); }

    public List<MinusTile> getMinusTilesRealList(){
        return minusTileDao.getMinusTilesRealList(); }

    public MinusTile getMinusTileToMerge(MinusTile minusTile){
        return minusTileDao.getMinusTileToMerge(minusTile);
    }

    public MinusTile save(MinusTile minusTile){
        return minusTileDao.save(minusTile);
    }

    public Object update(MinusTile minusTile, String day, boolean state){
        return minusTileDao.update(minusTile, day, state);
    }
}
