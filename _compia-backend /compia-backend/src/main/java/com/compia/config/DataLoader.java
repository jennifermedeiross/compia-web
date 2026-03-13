package com.compia.config;

import com.compia.entity.Product;
import com.compia.entity.Review;
import com.compia.entity.User;
import com.compia.enums.Category;
import com.compia.repository.ProductRepository;
import com.compia.repository.ReviewRepository;
import com.compia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Bean
    CommandLineRunner loadData() {
        return args -> {

            if (productRepository.count() > 0) return;

            Product p1 = productRepository.save(Product.builder()
                    .title("Deep Learning: Fundamentos e Aplicações")
                    .author("Ana Clara Souza")
                    .description("Guia completo sobre redes neurais profundas.")
                    .price(89.9)
                    .productType("PHYSICAL")
                    .stock(45)
                    .imageUrl("/images/deep-learning.jpg")
                    .category(Category.DEEP_LEARNING)
                    .isbn("978-65-0001-001-1")
                    .pages(420)
                    .publishedYear(2024)
                    .rating(4.8)
                    .reviewCount(127)
                    .build());

            Product p2 = productRepository.save(Product.builder()
                    .title("Inteligência Artificial: Uma Abordagem Moderna")
                    .author("Ricardo Mendes")
                    .description("Obra de referência sobre IA.")
                    .price(120.0)
                    .productType("PHYSICAL")
                    .stock(30)
                    .imageUrl("/images/ia-moderna.jpg")
                    .category(Category.INTELIGENCIA_ARTIFICIAL)
                    .isbn("978-65-0001-002-8")
                    .pages(580)
                    .publishedYear(2024)
                    .rating(4.9)
                    .reviewCount(203)
                    .build());

            Product p3 = productRepository.save(Product.builder()
                    .title("Machine Learning com Python")
                    .author("Fernanda Lima")
                    .description("Aprenda ML na prática com Python.")
                    .price(45.9)
                    .productType("EBOOK")
                    .stock(999)
                    .imageUrl("/images/ml-python.jpg")
                    .category(Category.MACHINE_LEARNING)
                    .isbn("978-65-0001-003-5")
                    .pages(350)
                    .publishedYear(2025)
                    .rating(4.7)
                    .reviewCount(89)
                    .build());

            Product p4 = productRepository.save(Product.builder()
                    .title("Processamento de Linguagem Natural")
                    .author("Carlos Eduardo Silva")
                    .description("Domine NLP com técnicas modernas.")
                    .price(75.0)
                    .productType("PHYSICAL")
                    .stock(22)
                    .imageUrl("/images/nlp.jpg")
                    .category(Category.NLP)
                    .isbn("978-65-0001-004-2")
                    .pages(390)
                    .publishedYear(2024)
                    .rating(4.6)
                    .reviewCount(64)
                    .build());

            Product p5 = productRepository.save(Product.builder()
                    .title("Visão Computacional e Redes Convolucionais")
                    .author("Juliana Alves")
                    .description("Explore o mundo da visão computacional.")
                    .price(39.9)
                    .productType("EBOOK")
                    .stock(999)
                    .imageUrl("/images/visao-computacional.jpg")
                    .category(Category.DEEP_LEARNING)
                    .isbn("978-65-0001-005-9")
                    .pages(310)
                    .publishedYear(2025)
                    .rating(4.5)
                    .reviewCount(42)
                    .build());

            Product p6 = productRepository.save(Product.builder()
                    .title("Ética e IA: Desafios para o Futuro")
                    .author("Mariana Costa")
                    .description("Análise profunda dos desafios éticos da IA.")
                    .price(55.0)
                    .productType("PHYSICAL")
                    .stock(38)
                    .imageUrl("/images/etica-ia.jpg")
                    .category(Category.INTELIGENCIA_ARTIFICIAL)
                    .isbn("978-65-0001-006-6")
                    .pages(280)
                    .publishedYear(2024)
                    .rating(4.4)
                    .reviewCount(56)
                    .build());

            Product p7 = productRepository.save(Product.builder()
                    .title("Redes Neurais Generativas")
                    .author("Paulo Roberto Santos")
                    .description("GANs, VAEs e Diffusion Models.")
                    .price(35.9)
                    .productType("EBOOK")
                    .stock(999)
                    .imageUrl("/images/redes-generativas.jpg")
                    .category(Category.DEEP_LEARNING)
                    .isbn("978-65-0001-007-3")
                    .pages(290)
                    .publishedYear(2025)
                    .rating(4.7)
                    .reviewCount(78)
                    .build());

            Product p8 = productRepository.save(Product.builder()
                    .title("Aprendizado por Reforço")
                    .author("Lucas Martins")
                    .description("Do Q-Learning ao PPO.")
                    .price(95.0)
                    .productType("PHYSICAL")
                    .stock(15)
                    .imageUrl("/images/reinforcement-learning.jpg")
                    .category(Category.MACHINE_LEARNING)
                    .isbn("978-65-0001-008-0")
                    .pages(440)
                    .publishedYear(2024)
                    .rating(4.8)
                    .reviewCount(91)
                    .build());

            Product p9 = productRepository.save(Product.builder()
                    .title("Dados, Algoritmos e Decisões")
                    .author("Beatriz Ferreira")
                    .description("Como IA transforma decisões em empresas.")
                    .price(68.0)
                    .productType("PHYSICAL")
                    .stock(50)
                    .imageUrl("/images/dados-decisoes.jpg")
                    .category(Category.INTELIGENCIA_ARTIFICIAL)
                    .isbn("978-65-0001-009-7")
                    .pages(320)
                    .publishedYear(2025)
                    .rating(4.3)
                    .reviewCount(35)
                    .build());

            Product p10 = productRepository.save(Product.builder()
                    .title("Bundle: IA Completa (3 livros)")
                    .author("Vários Autores")
                    .description("Pacote especial com 3 ebooks essenciais.")
                    .price(84.9)
                    .productType("EBOOK")
                    .stock(999)
                    .imageUrl("/images/bundle-ia.jpg")
                    .category(Category.BUNDLES)
                    .publishedYear(2025)
                    .rating(4.9)
                    .reviewCount(145)
                    .build());

            reviewRepository.save(Review.builder()
                    .product(p1)
                    .userName("João P.")
                    .rating(5)
                    .comment("Excelente livro! Muito didático.")
                    .createdAt(LocalDate.parse("2024-11-15").atStartOfDay())
                    .build());

            reviewRepository.save(Review.builder()
                    .product(p1)
                    .userName("Maria S.")
                    .rating(5)
                    .comment("O melhor livro de deep learning que já li.")
                    .createdAt(LocalDate.parse("2024-10-20").atStartOfDay())
                    .build());

            reviewRepository.save(Review.builder()
                    .product(p8)
                    .userName("Roberto F.")
                    .rating(5)
                    .comment("Aprendizado por reforço explicado claramente.")
                    .createdAt(LocalDate.parse("2024-10-15").atStartOfDay())
                    .build());

            if (userRepository.findByEmail("admin@compia.com").isEmpty()) {

                User admin = User.builder()
                        .name("Admin")
                        .email("admin@compia.com")
                        .password("admin")
                        .role("ADMIN")
                        .phone("(83) 99999-9999")
                        .build();

                userRepository.save(admin);
            }

        };
    }
}