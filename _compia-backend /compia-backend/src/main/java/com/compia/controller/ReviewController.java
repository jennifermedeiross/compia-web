package com.compia.controller;

import com.compia.entity.Review;
import com.compia.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService service;

    @GetMapping
    public List<Review> getByProduct(@RequestParam Long productId) {
        return service.getByProduct(productId);
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        return service.create(review);
    }
}