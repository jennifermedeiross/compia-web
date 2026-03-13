package com.compia.controller;

import com.compia.dto.PixPaymentDTO;
import com.compia.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pix")
    public Object pix(@RequestBody Map<String, Object> body) {
        System.out.println(body);

        double total = Double.parseDouble(body.get("total").toString());
        String name = body.get("name").toString();
        String email = body.get("email").toString();
        String phone = body.get("phone").toString();

        return paymentService.createPixPayment(total, name, email, phone);
    }
}
