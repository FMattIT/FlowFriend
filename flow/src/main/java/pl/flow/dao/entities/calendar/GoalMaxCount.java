package pl.flow.dao.entities.calendar;

import pl.flow.dao.entities.User;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Admin on 10.08.2017.
 */

@Entity
@Table(name = "goals_max_count")
public class GoalMaxCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_tiles__user_id"))
    private User userId;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_tiles__goal_id"))
    private Goal goalId;

    @Column
    private Date date;

    @Column
    private Long max_count;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Goal getGoalId() {
        return goalId;
    }

    public void setGoalId(Goal goalId) {
        this.goalId = goalId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getMax_count() {
        return max_count;
    }

    public void setMax_count(Long max_count) {
        this.max_count = max_count;
    }
}
