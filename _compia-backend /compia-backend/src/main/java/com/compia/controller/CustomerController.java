package com.compia.controller;

import com.compia.dto.CustomerDTO;
import com.compia.entity.Customer;
import com.compia.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public Customer create(@RequestBody CustomerDTO dto) {
        return customerService.create(dto);
    }

    @GetMapping
    public List<Customer> list() {
        return customerService.list();
    }

    @GetMapping("/{id}")
    public Customer find(@PathVariable Long id) {
        return customerService.findById(id);
    }

}