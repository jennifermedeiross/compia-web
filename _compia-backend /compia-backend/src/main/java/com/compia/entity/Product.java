package com.compia.entity;

import com.compia.enums.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String author;

    @Column(length = 2000)
    private String description;

    private Double price;

    private String productType;

    private Integer stock;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String isbn;

    private int pages;

    private int publishedYear;

    private double rating;

    private int reviewCount;
}