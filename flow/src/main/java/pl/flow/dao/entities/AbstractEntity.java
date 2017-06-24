package pl.flow.dao.entities;

import javax.persistence.*;

/**
 * Created by Admin on 18.04.2017.
 */

@MappedSuperclass
public abstract class AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
