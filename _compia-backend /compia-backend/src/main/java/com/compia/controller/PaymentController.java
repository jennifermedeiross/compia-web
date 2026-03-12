package com.compia.controller;

import com.compia.dto.PixPaymentDTO;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {

    @PostMapping("/pix")
    public PixPaymentDTO pix(@RequestBody Object request) {

        return PixPaymentDTO.builder()
                .qrCode("data:image/png;base64,PIX_SIMULADO")
                .copyPasteCode("000201PIXCOMPiaSIMULADO123456")
                .expiresAt(LocalDateTime.now().plusMinutes(30).toString())
                .build();
    }

    @PostMapping("/card")
    public Object card(@RequestBody Object cardData) {

        return new Object() {
            public final boolean approved = true;
            public final String transactionId = "TXN-" + System.currentTimeMillis();
        };
    }
}