package com.example.authservice.service;

import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;

    public Optional<User> login(String account, String password) {
        return userRepository.findByAccountAndPassword(account, password);
    }

    public Optional<User> getUserByAccount(String account) {
        return userRepository.findByAccount(account);
    }

    public User register(User user) {
        if (userRepository.findByAccount(user.getAccount()).isPresent()) {
            throw new RuntimeException("Account already exists");
        }
        return userRepository.save(user);
    }
}


