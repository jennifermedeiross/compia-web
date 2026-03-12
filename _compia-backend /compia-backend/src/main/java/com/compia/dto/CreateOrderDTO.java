package com.compia.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderDTO {

    private CustomerDTO customerInfo;

    private String paymentMethod;

    private Double subtotal;
    private Double shippingCost;
    private Double total;

    private List<OrderItemDTO> items;
}