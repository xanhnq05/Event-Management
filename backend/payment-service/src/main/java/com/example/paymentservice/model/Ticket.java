package com.example.paymentservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ticket")
public class Ticket {
    @Id
    @Column(name = "Ticket_ID")
    private String ticketId;

    @Column(name = "Ticket_Name")
    private String ticketName;

    @Column(name = "Event_ID")
    private String eventId;

    public Ticket() {}

    public Ticket(String ticketId, String ticketName, String eventId) {
        this.ticketId = ticketId;
        this.ticketName = ticketName;
        this.eventId = eventId;
    }

    // Getters and Setters
    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketName() {
        return ticketName;
    }

    public void setTicketName(String ticketName) {
        this.ticketName = ticketName;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }
}


