package pl.flow.dao.entities.calendar;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.*;
import pl.flow.dao.entities.User;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Table;
import java.util.Date;

/**
 * Created by Admin on 18.06.2017.
 */

@Entity
@Table(name = "tiles")
public class Tile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_tiles__user_id"))
    private User userId;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_tiles__goal_id"))
    private Goal goalId;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private String day;

    @Column(nullable = false)
    private String year;

    @Column(nullable = false)
    private String flag;

    @Column(nullable = true)
    private Date date;

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

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
