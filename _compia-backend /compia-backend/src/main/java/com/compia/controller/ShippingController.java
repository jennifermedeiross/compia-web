package com.compia.controller;

import com.compia.dto.ShippingMethodDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin("*")
public class ShippingController {

    @PostMapping("/calculate")
    public List<ShippingMethodDTO> calculate(@RequestBody Object request) {

        return List.of(
                ShippingMethodDTO.builder()
                        .id("pac")
                        .name("Correios PAC")
                        .price(15.90)
                        .estimatedDays(8)
                        .description("Entrega econômica")
                        .build(),

                ShippingMethodDTO.builder()
                        .id("sedex")
                        .name("Correios SEDEX")
                        .price(29.90)
                        .estimatedDays(3)
                        .description("Entrega expressa")
                        .build(),

                ShippingMethodDTO.builder()
                        .id("pickup")
                        .name("Retirada no local")
                        .price(0.0)
                        .estimatedDays(1)
                        .description("Retirada em nossa sede")
                        .build()
        );
    }
}