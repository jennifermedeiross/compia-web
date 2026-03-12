package com.compia.controller;

import com.compia.dto.CreateOrderDTO;
import com.compia.entity.Order;
import com.compia.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService service;

    @PostMapping
    public Order create(@RequestBody CreateOrderDTO order) {
        return service.create(order);
    }

    @GetMapping
    public List<Order> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Order get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping("/customer/{email}")
    public List<Order> listByCustomer(@PathVariable String email) {
        return service.listByCustomerEmail(email);
    }
}