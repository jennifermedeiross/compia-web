package com.compia.controller;

import com.compia.dto.PixPaymentDTO;
import com.compia.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {
    @Autowired
    PaymentService paymentService;

    @PostMapping("/pix")
    public Object createPix(@RequestBody Map<String, Object> body) {

        Double amount = Double.valueOf(body.get("amount").toString());

        return paymentService.createPix(amount, "Pedido Compia");
    }

    @PostMapping("/card")
    public Object card(@RequestBody Object cardData) {

        return new Object() {
            public final boolean approved = true;
            public final String transactionId = "TXN-" + System.currentTimeMillis();
        };
    }
}