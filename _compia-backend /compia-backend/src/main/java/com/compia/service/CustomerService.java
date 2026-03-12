package com.compia.service;

import com.compia.dto.CustomerDTO;
import com.compia.entity.Customer;
import com.compia.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer create(CustomerDTO dto) {

        Customer customer = Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .build();

        return customerRepository.save(customer);
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow();
    }

    public List<Customer> list() {
        return customerRepository.findAll();
    }

}
