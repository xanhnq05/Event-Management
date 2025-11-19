package com.example.eventmanagement.data.local;

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.math.BigDecimal;

@Entity(tableName = "events")
public class EventEntity {
    @PrimaryKey
    @ColumnInfo(name = "event_id")
    private String eventId;

    @ColumnInfo(name = "event_name")
    private String eventName;

    @ColumnInfo(name = "description")
    private String description;

    @ColumnInfo(name = "start_date_time")
    private String startDateTime;

    @ColumnInfo(name = "price_ticket")
    private BigDecimal priceTicket;

    @ColumnInfo(name = "quantity")
    private Integer quantity;

    @ColumnInfo(name = "venue_id")
    private String venueId;

    @ColumnInfo(name = "user_id")
    private String userId;

    @ColumnInfo(name = "category_id")
    private String categoryId;

    @ColumnInfo(name = "last_synced")
    private long lastSynced;

    @ColumnInfo(name = "is_dirty")
    private boolean isDirty;

    public EventEntity() {}

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

    public long getLastSynced() {
        return lastSynced;
    }

    public void setLastSynced(long lastSynced) {
        this.lastSynced = lastSynced;
    }

    public boolean isDirty() {
        return isDirty;
    }

    public void setDirty(boolean dirty) {
        isDirty = dirty;
    }
}


