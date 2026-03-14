package com.compia.controller;

import com.compia.dto.CustomerDTO;
import com.compia.dto.CustomerStatsDTO;
import com.compia.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public List<CustomerStatsDTO> list() {
        return customerService.list();
    }

    @GetMapping("/{id}")
    public CustomerDTO find(@PathVariable Long id) {
        return customerService.findById(id);
    }
}
