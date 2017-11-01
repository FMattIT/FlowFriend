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

    public Tile save(Tile tile){
        LocalDateTime l = LocalDateTime.now();

        int dayOfMonth = l.getDayOfMonth();
        int month = l.getMonthValue() - 1;
        int year = l.getYear();

        int tileDayOfMonth = Integer.parseInt(tile.getDay());
        int tileMonth = Integer.parseInt(tile.getMonth());
        int tileYear = Integer.parseInt(tile.getYear());

//        if((tileDayOfMonth == dayOfMonth || tileDayOfMonth == dayOfMonth-1 || tileDayOfMonth == dayOfMonth-2) && tileMonth==month && tileYear == year) {

            try {
                tile.setId(getTileToMerge(tile).getId());
                return entityManager.merge(tile);
            } catch (Exception e) {
                entityManager.persist(tile);
            }
            return tile;

//        }
//        else{
//            return null;
//        }
    }

    public List<Tile> getTilesList(){
        return entityManager.createQuery("SELECT t FROM Tile t", Tile.class).getResultList(); }

    public void delete(Goal goal){
      for(Tile t : getTile(goal)) {
          entityManager.remove(t);
      }
    }

    public Object getActualCount(Goal goal){
        return entityManager.createNativeQuery("SELECT COUNT(*) FROM public.tiles\n" +
                "WHERE EXISTS (SELECT 1 FROM public.tiles WHERE goal_id_id = :goal_id AND flag = 'CROSS') AND\n" +
                "(\n" +
                "  CAST(year AS TEXT) || CAST(month AS TEXT) || CAST(day AS TEXT)  > (SELECT CAST(year AS TEXT) || CAST(month AS TEXT) || CAST(day AS TEXT) FROM public.tiles WHERE goal_id_id = :goal_id AND flag = 'CROSS' ORDER BY id DESC LIMIT 1)\n" +
                ")\n" +
                "AND goal_id_id = :goal_id AND (flag = 'TICK' OR flag = 'YELLOWTICK')\n" +
                "OR NOT EXISTS (SELECT 1 FROM public.tiles WHERE goal_id_id = :goal_id AND flag = 'CROSS')\n" +
                "AND goal_id_id = :goal_id\n" +
                "AND (flag = 'TICK' OR flag = 'YELLOWTICK')\n" +
                "\n")
                .setParameter("goal_id", goal)
                .getSingleResult();
    }

    public Object getMaxCount(Goal goal){
        try{
            return entityManager.createNativeQuery("select cnt from(select distinct on (goal_id_id, user_id_id) scg.*\n" +
                    "from (select goal_id_id, user_id_id, flag, count(*) as cnt,\n" +
                    "             min(date), max(date)\n" +
                    "      from (select public.tiles.*,\n" +
                    "                   row_number() over (partition by goal_id_id, user_id_id, flag order by date) as seqnum_scg,\n" +
                    "                   row_number() over (partition by goal_id_id, user_id_id order by date) as seqnum_sc\n" +
                    "            from public.tiles\n" +
                    "           ) t\n" +
                    "      where flag = 'TICK'\n" +
                    "      AND goal_id_id=:goal_id\n" +
                    "      group by goal_id_id, user_id_id, flag, (seqnum_sc - seqnum_scg)\n" +
                    "     ) scg\n" +
                    "order by goal_id_id, user_id_id, cnt desc) as cnt")
                    .setParameter("goal_id", goal)
                    .getSingleResult();
        }
        catch(Exception e){
            return 0;
        }
    }

    public List<Tile> getTiles(User user, Goal goal){
        return entityManager.createQuery("SELECT t FROM Tile t WHERE t.userId = :userId AND t.goalId = :goalId ORDER BY t.id ASC", Tile.class)
                .setParameter("userId", user)
                .setParameter("goalId", goal)
                .getResultList(); }

}
