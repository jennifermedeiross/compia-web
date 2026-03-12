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

    public List<Product> list(Category category) {

        if (category == null) {
            return repository.findAll();
        }

        return repository.findByCategory(category);
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