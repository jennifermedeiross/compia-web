package com.compia.controller;

import com.compia.dto.ShippingRequest;
import com.compia.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ShippingController {

    private final ShippingService shippingService;

    @PostMapping("/calculate")
    public Object calculate(@RequestBody ShippingRequest request) {
        return shippingService.calculate(request);
    }
}