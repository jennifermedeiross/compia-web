package com.compia.service;

import com.compia.dto.CreateOrderDTO;
import com.compia.entity.*;
import com.compia.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public Order create(CreateOrderDTO dto) {

        User customer = userRepository
                .findByEmail(dto.getCustomerInfo().getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Order order = Order.builder()
                .customer(customer)
                .paymentMethod(dto.getPaymentMethod())
                .subtotal(dto.getSubtotal())
                .shippingCost(dto.getShippingCost())
                .total(dto.getTotal())
                .createdAt(LocalDateTime.now())
                .paymentStatus("APPROVED")
                .orderStatus("PROCESSING")
                .build();

        Order savedOrder = orderRepository.save(order);

        String year = String.valueOf(LocalDate.now().getYear());
        String number = String.format("%03d", savedOrder.getId());

        savedOrder.setOrderNumber("ORD-" + year + "-" + number);

        savedOrder = orderRepository.save(savedOrder);

        Order finalOrder = savedOrder;

        List<OrderItem> items = dto.getItems().stream().map(i -> {

            Product product = productRepository
                    .findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            return OrderItem.builder()
                    .order(finalOrder)
                    .product(product)
                    .quantity(i.getQuantity())
                    .price(product.getPrice())
                    .build();

        }).collect(Collectors.toCollection(ArrayList::new));

        List<String> links = items.stream()
                .filter(i -> i.getProduct().getProductType().equals("EBOOK"))
                .map(i -> i.getProduct().getTitle())
                .toList();

        savedOrder.setDownloadLinks(links);

        savedOrder.setItems(items);

        savedOrder = orderRepository.save(savedOrder);

        emailService.sendOrderConfirmation(
                customer.getEmail(),
                savedOrder
        );

        return savedOrder;
    }

    public List<Order> list() {
        return orderRepository.findAll();
    }

    public Order get(Long id) {
        return orderRepository.findById(id).orElseThrow();
    }

    public List<Order> listByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }
}