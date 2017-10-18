package pl.flow.dao.entities.calendar;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;
import pl.flow.dao.entities.User;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Table;
import java.util.Date;
import java.util.Set;

/**
 * Created by Admin on 18.06.2017.
 */

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_goals__user_id"))
    private User userId;

    @Column(nullable = false)
    private String name;

    @Column
    private Long position;

    @Column
    private Date createDate;

    @Column
    private String firstAdvantage;

    @Column
    private String secondAdvantage;

    @Column
    private String thirdAdvantage;


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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPosition() {
        return position;
    }

    public void setPosition(Long position) {
        this.position = position;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getFirstAdvantage() {
        return firstAdvantage;
    }

    public void setFirstAdvantage(String firstAdvantage) {
        this.firstAdvantage = firstAdvantage;
    }

    public String getSecondAdvantage() {
        return secondAdvantage;
    }

    public void setSecondAdvantage(String secondAdvantage) {
        this.secondAdvantage = secondAdvantage;
    }

    public String getThirdAdvantage() {
        return thirdAdvantage;
    }

    public void setThirdAdvantage(String thirdAdvantage) {
        this.thirdAdvantage = thirdAdvantage;
    }

}
