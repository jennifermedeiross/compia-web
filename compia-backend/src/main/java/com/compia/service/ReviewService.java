package com.compia.service;

import com.compia.entity.Review;
import com.compia.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository repository;

    public List<Review> getByProduct(Long productId) {
        return repository.findByProductId(productId);
    }

    public Review create(Review review) {
        return repository.save(review);
    }
}