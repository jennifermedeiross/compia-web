package com.compia.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {

    private Long id;
    private String title;
    private String author;
    private String description;
    private Double price;
    private String productType;
    private Integer stock;
    private String imageUrl;
    private String category;

    private Double rating;
    private Integer publishedYear;
}