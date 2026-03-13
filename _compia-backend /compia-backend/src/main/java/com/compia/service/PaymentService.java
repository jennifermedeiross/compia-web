package com.compia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${abacatepay.url}")
    private String baseUrl;

    @Value("${abacatepay.token}")
    private String token;

    private final WebClient webClient = WebClient.builder().build();

    public Object createPix(Double amount, String description) {
        // Converter para centavos (Long) para evitar problemas de precisão e rejeição da API
        long amountInCents = Math.round(amount * 100);

        Map<String, Object> body = Map.of(
                "amount", amountInCents,
                "description", description,
                "externalId", "ORDER-" + System.currentTimeMillis(),
                "methods", List.of("pix") // Muitas APIs exigem definir o método explicitamente
        );

        return webClient.post()
                .uri(baseUrl + "/v1/pix/create")
                .header("Authorization", "Bearer " + token)
                .header("Accept", "application/json") // Adicione este header também
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Object.class)
                .block();
    }
}
