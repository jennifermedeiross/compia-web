package com.compia.service;

import com.compia.dto.ShippingRequest;
import com.compia.entity.Product;
import com.compia.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ShippingService {

    @Value("${melhorenvio.token}")
    private String token;

    private final ProductRepository productRepository;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://sandbox.melhorenvio.com.br")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.USER_AGENT, "Compia (email@exemplo.com)")
            .build();

    public Object calculate(ShippingRequest request) {

        List<Map<String, Object>> products = request.getItems().stream()
                .map(item -> {

                    Product product = productRepository.findById(item.getProductId())
                            .orElseThrow();

                    Map<String, Object> map = new HashMap<>();
                    map.put("id", product.getId());
                    map.put("width", 11);
                    map.put("height", 11);
                    map.put("length", 16);
                    map.put("weight", 0.5);
                    map.put("insurance_value", product.getPrice());
                    map.put("quantity", item.getQuantity());

                    return map;

                })
                .toList();

        Map<String, Object> body = Map.of(
                "from", Map.of("postal_code", "58429900"),
                "to", Map.of("postal_code", request.getCep()),
                "products", products
        );

        return webClient.post()
                .uri("/api/v2/me/shipment/calculate")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Object.class)
                .block();
    }
}
