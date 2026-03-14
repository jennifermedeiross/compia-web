package com.compia.repository;

import com.compia.dto.CustomerStatsDTO;
import com.compia.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerEmail(String email);

    long countByCustomerId(Long id);

    @Query("SELECT COALESCE(SUM(o.total),0) FROM Order o WHERE o.customer.id = :id")
    BigDecimal sumTotalByCustomer(Long id);
}