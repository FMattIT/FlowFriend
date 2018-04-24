package pl.flow.dao;

import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.User;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.Tile;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Admin on 21.06.2017.
 */

@Transactional
@Repository
public class TileDao {

    @PersistenceContext
    private EntityManager entityManager;

    public Tile save(Tile tile) {
        return entityManager.merge(tile);
    }

    public void delete(Goal goal) {
        for(Tile t : getTile(goal)) {
            entityManager.remove(t);
        }
    }

    public List<Tile> getTiles(User user, Goal goal){
        return entityManager.createQuery("SELECT t FROM Tile t WHERE t.userId = :userId AND t.goalId = :goalId ORDER BY t.id ASC", Tile.class)
                .setParameter("userId", user)
                .setParameter("goalId", goal)
                .getResultList(); }

    public List<Tile> getTile(Goal goal){
        return entityManager.createQuery("SELECT t FROM Tile t WHERE t.goalId = :goalId", Tile.class)
                .setParameter("goalId", goal).getResultList();
    }

    public Tile getTileToMerge(Tile tile){
        try{
        return entityManager.createQuery("SELECT t FROM Tile t WHERE t.day = :day AND t.month = :month AND t.year = :year AND t.goalId = :goalId AND t.userId = :userId", Tile.class)
                .setParameter("day", tile.getDay())
                .setParameter("month", tile.getMonth())
                .setParameter("year", tile.getYear())
                .setParameter("goalId", tile.getGoalId())
                .setParameter("userId", tile.getUserId()).getSingleResult();
        }
        catch(Exception x){
            return null;
        }
    }

    public Object getCurrentScore(Goal goal){
        return entityManager.createNativeQuery("SELECT COUNT(*) FROM public.tiles\n" +
                "WHERE EXISTS (SELECT 1 FROM public.tiles WHERE goal_id_id = :goal_id AND flag = 'CROSS') AND\n" +
                "(\n" +
                "  CAST(year AS TEXT) || CAST(month AS TEXT) || CAST(day AS TEXT)  > (SELECT CAST(year AS TEXT) || CAST(month AS TEXT) || CAST(day AS TEXT) FROM public.tiles WHERE goal_id_id = :goal_id AND flag = 'CROSS' ORDER BY id DESC LIMIT 1)\n" +
                ")\n" +
                "AND goal_id_id = :goal_id AND (flag = 'TICK')\n" +
                "OR NOT EXISTS (SELECT 1 FROM public.tiles WHERE goal_id_id = :goal_id AND flag = 'CROSS')\n" +
                "AND goal_id_id = :goal_id\n" +
                "AND (flag = 'TICK')\n" +
                "\n")
                .setParameter("goal_id", goal)
                .getSingleResult();
    }

    public Object getRecordScore(Goal goal){
        try{
            return entityManager.createNativeQuery("SELECT max( score )\n" +
                    "FROM (\n" +
                    "   SELECT goal_id_id, grp_nbr, count(CASE WHEN flag = 'TICK' THEN 1 END) As score\n" +
                    "   FROM (\n" +
                    "      SELECT *,\n" +
                    "             SUM (  CASE WHEN flag in ('CROSS')\n" +
                    "                         THEN 1 ELSE 0\n" +
                    "                    END \n" +
                    "             ) OVER (Partition by goal_id_id Order By date ) As grp_nbr\n" +
                    "      FROM public.tiles WHERE goal_id_id=:goal_id \n" +
                    "   ) x\n" +
                    "   GROUP BY goal_id_id, grp_nbr\n" +
                    ") y")
                    .setParameter("goal_id", goal)
                    .getSingleResult();
        }
        catch(Exception e){
            return 0;
        }
    }

}
