package com.example.stocktrading.service;

import com.example.stocktrading.dto.RegisterRequest;
import com.example.stocktrading.dto.UserResponse;
import com.example.stocktrading.entity.User;
import com.example.stocktrading.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.stocktrading.exception.*;
import java.math.BigDecimal;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new user
     */
    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");

        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setBalance(new BigDecimal("10000.00")); // Starting balance

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    /**
     * Get user by username
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

    }

    /**
     * Get user by ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Get user response by username
     */
    public UserResponse getUserResponseByUsername(String username) {
        User user = getUserByUsername(username);
        return convertToResponse(user);
    }

    /**
     * Update user balance
     */
    @Transactional
    public void updateBalance(Long userId, BigDecimal amount) {
        User user = getUserById(userId);
        user.setBalance(user.getBalance().add(amount));
        userRepository.save(user);
    }

    /**
     * Add funds to user account
     */
    @Transactional
    public UserResponse addFunds(Long userId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        User user = getUserById(userId);
        user.setBalance(user.getBalance().add(amount));
        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    /**
     * Withdraw funds from user account
     */
    @Transactional
    public UserResponse withdrawFunds(Long userId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        User user = getUserById(userId);

        if (user.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance().subtract(amount));
        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    /**
     * Convert User entity to UserResponse DTO
     */
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setBalance(user.getBalance());
        return response;
    }
}