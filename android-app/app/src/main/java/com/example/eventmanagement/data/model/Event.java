package com.example.eventmanagement.data.model;

import java.math.BigDecimal;

public class Event {
    private String eventId;
    private String eventName;
    private String description;
    private String startDateTime;
    private BigDecimal priceTicket;
    private Integer quantity;
    private String venueId;
    private String userId;
    private String categoryId;

    public Event() {}

    public Event(String eventId, String eventName, String description, String startDateTime,
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

    public String getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(String startDateTime) {
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

