package com.example.stocktrading.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "symbol"})
})
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String symbol;

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    // Constructors
    public Watchlist() {
    }

    public Watchlist(Long id, User user, String symbol, LocalDateTime addedAt) {
        this.id = id;
        this.user = user;
        this.symbol = symbol;
        this.addedAt = addedAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getSymbol() {
        return symbol;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}