package com.compia.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ShippingRequest {

    private String cep;
    private List<ShippingItem> items;

}