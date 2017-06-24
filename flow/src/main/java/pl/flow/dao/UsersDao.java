package pl.flow.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

/**
 * Created by Admin on 21.04.2017.
 */

@Transactional
@Repository
public class UsersDao {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    public void create(User user) {
        String username = user.getUsername();
        String password = bCryptPasswordEncoder.encode(user.getPassword());
        Boolean enabled = true;
        String authority = user.getAuthority();
        entityManager.createNativeQuery(
                "INSERT INTO users (enabled, authority, password, username) VALUES (?, ?, ?, ?)")
                .setParameter(1, enabled)
                .setParameter(2, authority)
                .setParameter(3, password)
                .setParameter(4, username)
                .executeUpdate();
    }

    public User getUserByUsername(String username) {
        Query q = entityManager.createQuery("SELECT u FROM User u WHERE u.username = :username");
        q.setParameter("username", username);
        return (User) q.getSingleResult();
    }
}
