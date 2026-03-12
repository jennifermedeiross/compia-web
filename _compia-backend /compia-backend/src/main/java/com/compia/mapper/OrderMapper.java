package com.compia.mapper;

import com.compia.dto.*;
import com.compia.entity.*;

import java.util.List;

public class OrderMapper {

    public static Order toEntity(
            CreateOrderDTO dto,
            Customer customer,
            List<OrderItem> items
    ) {

        return Order.builder()
                .customer(customer)
                .items(items)
                .paymentMethod(dto.getPaymentMethod())
                .subtotal(dto.getSubtotal())
                .shippingCost(dto.getShippingCost())
                .total(dto.getTotal())
                .build();
    }
}