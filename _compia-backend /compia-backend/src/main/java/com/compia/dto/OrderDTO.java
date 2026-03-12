package com.compia.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {

    private String id;
    private List<Object> items;

    private Object customerInfo;
    private Object shippingAddress;
    private Object shippingMethod;

    private String paymentMethod;

    private String paymentStatus;
    private String orderStatus;

    private Double subtotal;
    private Double shippingCost;
    private Double total;

    private String createdAt;
    private String orderNumber;
}