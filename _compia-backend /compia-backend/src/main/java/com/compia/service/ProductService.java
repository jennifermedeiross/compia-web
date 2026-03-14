package com.compia.service;

import com.compia.entity.Product;
import com.compia.enums.Category;
import com.compia.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;

    public List<Product> list(String category, String search, String sort) {

        List<Product> products = repository.findAll();

        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(p -> p.getCategory().equalsIgnoreCase(category))
                    .toList();
        }

        if (search != null && !search.isEmpty()) {
            String s = search.toLowerCase();

            products = products.stream()
                    .filter(p ->
                            p.getTitle().toLowerCase().contains(s) ||
                                    p.getAuthor().toLowerCase().contains(s)
                    )
                    .toList();
        }

        if ("price-asc".equals(sort)) {
            products = products.stream()
                    .sorted(Comparator.comparing(Product::getPrice))
                    .toList();
        }

        if ("price-desc".equals(sort)) {
            products = products.stream()
                    .sorted(Comparator.comparing(Product::getPrice).reversed())
                    .toList();
        }

        if ("rating".equals(sort)) {
            products = products.stream()
                    .sorted(Comparator.comparing(Product::getRating).reversed())
                    .toList();
        }

        if ("newest".equals(sort)) {
            products = products.stream()
                    .sorted(Comparator.comparing(Product::getId).reversed())
                    .toList();
        }

        return products;
    }


    public Product get(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public Product create(Product product) {
        return repository.save(product);
    }

    public Product update(Long id, Product data) {
        Product p = repository.findById(id).orElseThrow();
        p.setTitle(data.getTitle());
        p.setAuthor(data.getAuthor());
        p.setPrice(data.getPrice());
        p.setDescription(data.getDescription());
        return repository.save(p);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}