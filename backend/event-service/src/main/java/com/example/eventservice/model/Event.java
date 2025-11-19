package com.example.eventservice.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "event")
public class Event {
    @Id
    @Column(name = "Event_ID")
    private String eventId;

    @Column(name = "Event_Name", nullable = false)
    private String eventName;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Start_DateTime")
    private LocalDateTime startDateTime;

    @Column(name = "Price_Ticket", precision = 10, scale = 2)
    private BigDecimal priceTicket;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Venue_ID")
    private String venueId;

    @Column(name = "User_ID")
    private String userId;

    @Column(name = "Category_ID")
    private String categoryId;

    // Constructors
    public Event() {}

    public Event(String eventId, String eventName, String description, LocalDateTime startDateTime,
                 BigDecimal priceTicket, Integer quantity, String venueId, String userId, String categoryId) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.description = description;
        this.startDateTime = startDateTime;
        this.priceTicket = priceTicket;
        this.quantity = quantity;
        this.venueId = venueId;
        this.userId = userId;
        this.categoryId = categoryId;
    }

    // Getters and Setters
    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public BigDecimal getPriceTicket() {
        return priceTicket;
    }

    public void setPriceTicket(BigDecimal priceTicket) {
        this.priceTicket = priceTicket;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getVenueId() {
        return venueId;
    }

    public void setVenueId(String venueId) {
        this.venueId = venueId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
}


