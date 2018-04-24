package pl.flow.dao.entities;

import org.springframework.data.annotation.*;
import pl.flow.dao.entities.calendar.Goal;
import pl.flow.dao.entities.calendar.Tile;

import javax.persistence.*;
import javax.persistence.AccessType;
import javax.persistence.Id;
import java.util.Date;
import java.util.List;

/**
 * Created by Admin on 09.04.2017.
 */

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String confirmPassword;

    @Column
    private String email;

    @Column
    private boolean enabled;

    @Column(nullable = false)
    private String authority;

    @Column
    private Date dateOfBirth;

    @OneToMany(mappedBy="userId")
    private List<Goal> listOfGoals;

    @OneToMany(mappedBy="userId")
    private List<Tile> listOfTiles;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
