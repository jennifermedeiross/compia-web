package com.compia.controller;

import com.compia.entity.User;
import com.compia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> body) {

        return userService.register(
                body.get("name"),
                body.get("email"),
                body.get("password")
        );
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> body) {

        return userService.login(
                body.get("email"),
                body.get("password")
        );
    }

    @GetMapping
    public List<User> listUsers() {
        return userService.listUsers();
    }
}
