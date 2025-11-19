package com.example.eventmanagement.data.local;

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "purchased_tickets")
public class PurchasedTicketEntity {
    @PrimaryKey
    @ColumnInfo(name = "purchased_id")
    private String purchasedId;

    @ColumnInfo(name = "ticket_id")
    private String ticketId;

    @ColumnInfo(name = "user_id")
    private String userId;

    @ColumnInfo(name = "date_purchase")
    private String datePurchase;

    @ColumnInfo(name = "qr_code")
    private String qrCode;

    @ColumnInfo(name = "checkin_status")
    private Boolean checkInStatus;

    @ColumnInfo(name = "last_synced")
    private long lastSynced;

    @ColumnInfo(name = "is_dirty")
    private boolean isDirty;

    public PurchasedTicketEntity() {}

    // Getters and Setters
    public String getPurchasedId() {
        return purchasedId;
    }

    public void setPurchasedId(String purchasedId) {
        this.purchasedId = purchasedId;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDatePurchase() {
        return datePurchase;
    }

    public void setDatePurchase(String datePurchase) {
        this.datePurchase = datePurchase;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public Boolean getCheckInStatus() {
        return checkInStatus;
    }

    public void setCheckInStatus(Boolean checkInStatus) {
        this.checkInStatus = checkInStatus;
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


