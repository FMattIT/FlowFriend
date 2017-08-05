package pl.flow.dao.entities.calendar;

import pl.flow.dao.entities.User;

import javax.persistence.*;

/**
 * Created by Admin on 05.08.2017.
 */

//@Entity
//@Table(name = "minus_tiles")
public class MinusTiles {

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
    private boolean firstDay = false;

    @Column
    private boolean secondDay  = false;

    @Column
    private boolean thirdDay  = false;

    @Column
    private boolean fourthDay = false;

    @Column
    private boolean fifthDay = false;

    @Column
    private boolean sixthDay = false;

    @Column
    private boolean seventhDay = false;

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

    public boolean isFirstDay() {
        return firstDay;
    }

    public void setFirstDay(boolean firstDay) {
        this.firstDay = firstDay;
    }

    public boolean isSecondDay() {
        return secondDay;
    }

    public void setSecondDay(boolean secondDay) {
        this.secondDay = secondDay;
    }

    public boolean isThirdDay() {
        return thirdDay;
    }

    public void setThirdDay(boolean thirdDay) {
        this.thirdDay = thirdDay;
    }

    public boolean isFourthDay() {
        return fourthDay;
    }

    public void setFourthDay(boolean fourthDay) {
        this.fourthDay = fourthDay;
    }

    public boolean isFifthDay() {
        return fifthDay;
    }

    public void setFifthDay(boolean fifthDay) {
        this.fifthDay = fifthDay;
    }

    public boolean isSixthDay() {
        return sixthDay;
    }

    public void setSixthDay(boolean sixthDay) {
        this.sixthDay = sixthDay;
    }

    public boolean isSeventhDay() {
        return seventhDay;
    }

    public void setSeventhDay(boolean seventhDay) {
        this.seventhDay = seventhDay;
    }
}
