package com.example.stocktrading.repository;

import com.example.stocktrading.entity.Portfolio;
import com.example.stocktrading.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUser(User user);

    List<Portfolio> findByUserId(Long userId);

    Optional<Portfolio> findByUserAndSymbol(User user, String symbol);

    Optional<Portfolio> findByUserIdAndSymbol(Long userId, String symbol);
}