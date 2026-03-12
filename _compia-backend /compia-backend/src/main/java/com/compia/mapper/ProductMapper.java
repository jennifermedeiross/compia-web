package com.compia.mapper;

import com.compia.dto.ProductDTO;
import com.compia.entity.Product;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {

        return ProductDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .author(product.getAuthor())
                .description(product.getDescription())
                .price(product.getPrice())
                .productType(product.getProductType())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .category(String.valueOf(product.getCategory()))
                .rating(4.5)
                .publishedYear(2022)
                .build();
    }
}