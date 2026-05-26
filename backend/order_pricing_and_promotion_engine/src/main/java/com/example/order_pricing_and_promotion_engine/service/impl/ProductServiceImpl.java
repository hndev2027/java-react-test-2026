package com.example.order_pricing_and_promotion_engine.service.impl;

import com.example.order_pricing_and_promotion_engine.dto.ProductResponseDTO;
import com.example.order_pricing_and_promotion_engine.entity.Product;
import com.example.order_pricing_and_promotion_engine.repository.ProductRepository;
import com.example.order_pricing_and_promotion_engine.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductResponseDTO> getAll() {
        return productRepository.findAll().stream()
                .sorted(Comparator.comparing(Product::getSku))
                .map(product -> new ProductResponseDTO(
                        product.getId(),
                        product.getSku(),
                        product.getName(),
                        product.getPrice()
                ))
                .toList();
    }
}
