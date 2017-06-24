package pl.flow.dao.entities.calendar;

import pl.flow.dao.entities.User;

import javax.persistence.*;

/**
 * Created by Admin on 18.06.2017.
 */

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @OneToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_goals__user_id"))
    private User userId;

    @Column(nullable = false)
    private String name;

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
}
