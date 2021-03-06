package pl.flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.flow.dao.UsersDao;
import pl.flow.dao.entities.User;

import java.math.BigInteger;

/**
 * Created by Admin on 03.04.2017.
 */

@Service("usersService")
public class UsersService {

    private UsersDao usersDao;

    @Autowired
    public void setUsersDao(UsersDao usersDao) {
        this.usersDao = usersDao;
    }

    public void create(User user) {
        usersDao.create(user);
    }

    public User getUserByUsername(String username) {
        return usersDao.getUserByUsername(username);
    }

    public Object checkIfUserExistsByLogin(String login){
        return usersDao.checkIfUserExistsByLogin(login);
    }

    public Object checkIfUserExistsByEmail(String email){
        return usersDao.checkIfUserExistsByEmail(email);
    }
}
