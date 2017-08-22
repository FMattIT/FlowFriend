package pl.flow.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import pl.flow.dao.entities.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.math.BigInteger;

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
        String email = user.getEmail();
        String password = bCryptPasswordEncoder.encode(user.getPassword());
        String confirmPassword = bCryptPasswordEncoder.encode(user.getConfirmPassword());
        Boolean enabled = true;
        String authority = user.getAuthority();
        entityManager.createNativeQuery(
                "INSERT INTO users (enabled, authority, password, confirm_password, username, email) VALUES (?, ?, ?, ?, ?, ?)")
                .setParameter(1, enabled)
                .setParameter(2, authority)
                .setParameter(3, password)
                .setParameter(4, confirmPassword)
                .setParameter(5, username)
                .setParameter(6, email)
                .executeUpdate();
    }

    public User getUserByUsername(String username) {
        Query q = entityManager.createQuery("SELECT u FROM User u WHERE u.username = :username");
        q.setParameter("username", username);
        return (User) q.getSingleResult();
    }

    public Object checkIfUserExistsByLogin(String login){
        return entityManager.createNativeQuery("SELECT COUNT(*) FROM public.users WHERE username=?")
                .setParameter(1, login)
                .getSingleResult();
    }

    public Object checkIfUserExistsByEmail(String email){
        return entityManager.createNativeQuery("SELECT COUNT(*) FROM public.users WHERE email=?")
                .setParameter(1, email)
                .getSingleResult();
    }
}
