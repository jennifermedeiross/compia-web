package com.compia.service;

import com.compia.dto.PixPaymentDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class PaymentService {

    @Value("${abacatepay.token}")
    private String token;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.abacatepay.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();

    public PixPaymentDTO createPixPayment(double total, String name, String email, String phone) {

        Map<String, Object> customer = Map.of(
                "name", name,
                "email", email,
                "cellphone", phone,
                "taxId", "111.444.777-35"
        );

        Map<String, Object> body = Map.of(
                "amount", (int) Math.round(total * 100),
                "expiresIn", 3600,
                "description", "Compra COMPIA Editora",
                "customer", customer,
                "metadata", Map.of("externalId", "pedido-123")
        );

        Map response = webClient.post()
                .uri("/v1/pixQrCode/create")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        Map data = (Map) response.get("data");

        return PixPaymentDTO.builder()
                .qrCode((String) data.get("brCodeBase64"))
                .copyPasteCode((String) data.get("brCode"))
                .expiresAt((String) data.get("expiresAt"))
                .build();
    }

}