package com.compia.service;

import com.compia.entity.Customer;
import com.compia.entity.User;
import com.compia.repository.CustomerRepository;
import com.compia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public User register(String name, String email, String password) {

        User user = User.builder()
                .name(name)
                .email(email)
                .password(password)
                .role("CUSTOMER")
                .build();


        return userRepository.save(user);

    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Senha inválida");
        }

        return user;
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }
}
