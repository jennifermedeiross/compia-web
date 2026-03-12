package com.compia.controller;

import com.compia.dto.ProductDTO;
import com.compia.entity.Product;
import com.compia.enums.Category;
import com.compia.mapper.ProductMapper;
import com.compia.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService service;

    @GetMapping
    public List<Product> list(@RequestParam(required = false) String category) {

        Category cat = null;

        if (category != null && !category.equals("Todos")) {
            cat = Category.fromLabel(category);
        }

        return service.list(cat);
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return service.create(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/categories")
    public List<String> list() {
        return Arrays.stream(Category.values())
                .map(Category::getLabel)
                .toList();
    }
}