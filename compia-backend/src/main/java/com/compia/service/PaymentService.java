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
                .id((String) data.get("id"))
                .qrCode((String) data.get("brCodeBase64"))
                .copyPasteCode((String) data.get("brCode"))
                .expiresAt((String) data.get("expiresAt"))
                .build();
    }

    public Map<String, Object> checkPixStatus(String id) {

        Map response = webClient.get()
                .uri("/v1/pixQrCode/check?id=" + id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        Map data = (Map) response.get("data");

        return Map.of(
                "status", data.get("status")
        );
    }

    public void simulatePayment(String id) {
        webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/pixQrCode/simulate-payment?id=")
                        .queryParam("id", id)
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(Map.of("metadata", Map.of()))
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}