package com.compia.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingMethodDTO {

    private String id;
    private String name;
    private Double price;
    private Integer estimatedDays;
    private String description;
}