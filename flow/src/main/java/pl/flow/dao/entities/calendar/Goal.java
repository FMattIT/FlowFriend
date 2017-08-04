package pl.flow.dao.entities.calendar;

import org.hibernate.annotations.ColumnDefault;
import pl.flow.dao.entities.User;

import javax.persistence.*;
import java.util.List;

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
    private Long max_count = 0L;

    @OneToMany(mappedBy="goalId")
    private List<Tile> listOfTiles;

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

    public Long getMax_count() {
        return max_count;
    }

    public void setMax_count(Long max_count) {
        this.max_count = max_count;
    }
}
