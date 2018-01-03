package pl.flow.dao.entities.calendar;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;
import pl.flow.dao.entities.User;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Table;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

/**
 * Created by Admin on 18.06.2017.
 */

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_goals__user_id"), nullable = true)
    private User userId;

    @Column(nullable = false)
    private String name;

    @Column
    private Long position;

    @Column
    private Date createDate;

    @Column
    private String advantages;

    @OneToMany(targetEntity=Tile.class, mappedBy = "goalId", orphanRemoval=true)
    private Set<Tile> tiles = new HashSet<Tile>();

    @JsonIgnore
    public Set<Tile> getTiles() {
        return tiles;
    }

    @OneToMany(targetEntity=MinusTile.class, mappedBy = "goalId", orphanRemoval=true)
    private Set<MinusTile> minusTiles = new HashSet<MinusTile>();

    @JsonIgnore
    public Set<MinusTile> getMinusTiles() {
        return minusTiles;
    }

    public Goal() {}

    public Goal(Long id, String advantages, String name, Date createDate, Long position) {
        this.id = id;
        this.advantages = advantages;
        this.name = name;
        this.createDate = createDate;
        this.position = position;
    }

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

    public String getAdvantages() {
        return advantages;
    }

    public void setAdvantages(String advantages) {
        this.advantages = advantages;
    }
}
