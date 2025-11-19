package com.example.paymentservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchasedticket")
public class PurchasedTicket {
    @Id
    @Column(name = "Purchased_ID")
    private String purchasedId;

    @Column(name = "Ticket_ID")
    private String ticketId;

    @Column(name = "User_ID")
    private String userId;

    @Column(name = "Date_Purchase")
    private LocalDateTime datePurchase;

    @Column(name = "QR_Code", unique = true)
    private String qrCode;

    @Column(name = "CheckIn_Status")
    private Boolean checkInStatus;

    public PurchasedTicket() {}

    public PurchasedTicket(String purchasedId, String ticketId, String userId, 
                          LocalDateTime datePurchase, String qrCode, Boolean checkInStatus) {
        this.purchasedId = purchasedId;
        this.ticketId = ticketId;
        this.userId = userId;
        this.datePurchase = datePurchase;
        this.qrCode = qrCode;
        this.checkInStatus = checkInStatus;
    }

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

    public LocalDateTime getDatePurchase() {
        return datePurchase;
    }

    public void setDatePurchase(LocalDateTime datePurchase) {
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
}


