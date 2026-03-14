package com.compia.service;

import com.compia.dto.CustomerDTO;
import com.compia.dto.CustomerStatsDTO;
import com.compia.entity.User;
import com.compia.repository.OrderRepository;
import com.compia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public List<CustomerStatsDTO> list() {

        return userRepository.findByRole("CUSTOMER")
                .stream()
                .map(u -> new CustomerStatsDTO(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getPhone(),
                        orderRepository.countByCustomerId(u.getId()),
                        orderRepository.sumTotalByCustomer(u.getId())
                ))
                .toList();
    }

    public CustomerDTO findById(Long id) {

        User u = userRepository.findById(id)
                .orElseThrow();

        return new CustomerDTO(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getPhone()
        );
    }
}