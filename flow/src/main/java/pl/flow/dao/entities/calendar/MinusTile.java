package pl.flow.dao.entities.calendar;

import org.hibernate.annotations.*;
import org.hibernate.annotations.CascadeType;
import pl.flow.dao.entities.User;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Table;

/**
 * Created by Admin on 05.08.2017.
 */

@Entity
@Table(name = "minus_tiles")
public class MinusTile {

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
    private String firstDay = "false";

    @Column
    private String secondDay = "false";

    @Column
    private String thirdDay = "false";

    @Column
    private String fourthDay = "false";

    @Column
    private String fifthDay = "false";

    @Column
    private String sixthDay = "false";

    @Column
    private String seventhDay = "false";

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

    public String getFirstDay() {
        return firstDay;
    }

    public void setFirstDay(String firstDay) {
        this.firstDay = firstDay;
    }

    public String getSecondDay() {
        return secondDay;
    }

    public void setSecondDay(String secondDay) {
        this.secondDay = secondDay;
    }

    public String getThirdDay() {
        return thirdDay;
    }

    public void setThirdDay(String thirdDay) {
        this.thirdDay = thirdDay;
    }

    public String getFourthDay() {
        return fourthDay;
    }

    public void setFourthDay(String fourthDay) {
        this.fourthDay = fourthDay;
    }

    public String getFifthDay() {
        return fifthDay;
    }

    public void setFifthDay(String fifthDay) {
        this.fifthDay = fifthDay;
    }

    public String getSixthDay() {
        return sixthDay;
    }

    public void setSixthDay(String sixthDay) {
        this.sixthDay = sixthDay;
    }

    public String getSeventhDay() {
        return seventhDay;
    }

    public void setSeventhDay(String seventhDay) {
        this.seventhDay = seventhDay;
    }
}
