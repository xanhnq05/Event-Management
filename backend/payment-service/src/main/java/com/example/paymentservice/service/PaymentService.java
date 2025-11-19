package com.example.paymentservice.service;

import com.example.paymentservice.model.PurchasedTicket;
import com.example.paymentservice.model.Ticket;
import com.example.paymentservice.repository.PurchasedTicketRepository;
import com.example.paymentservice.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private PurchasedTicketRepository purchasedTicketRepository;
    
    @Autowired
    private TicketRepository ticketRepository;

    public List<PurchasedTicket> getAllPurchasedTickets() {
        return purchasedTicketRepository.findAll();
    }

    public Optional<PurchasedTicket> getPurchasedTicketById(String purchasedId) {
        return purchasedTicketRepository.findById(purchasedId);
    }

    public List<PurchasedTicket> getPurchasedTicketsByUserId(String userId) {
        return purchasedTicketRepository.findByUserId(userId);
    }

    public List<Ticket> getTicketsByEventId(String eventId) {
        return ticketRepository.findByEventId(eventId);
    }

    @Transactional
    public PurchasedTicket purchaseTicket(String ticketId, String userId) {
        // Check if ticket exists
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
        
        // Generate purchased ticket
        PurchasedTicket purchasedTicket = new PurchasedTicket();
        purchasedTicket.setPurchasedId("VM" + System.currentTimeMillis());
        purchasedTicket.setTicketId(ticketId);
        purchasedTicket.setUserId(userId);
        purchasedTicket.setDatePurchase(LocalDateTime.now());
        purchasedTicket.setQrCode(UUID.randomUUID().toString());
        purchasedTicket.setCheckInStatus(false);
        
        return purchasedTicketRepository.save(purchasedTicket);
    }

    public PurchasedTicket checkIn(String qrCode) {
        PurchasedTicket ticket = purchasedTicketRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new RuntimeException("Ticket not found with QR code: " + qrCode));
        
        if (ticket.getCheckInStatus()) {
            throw new RuntimeException("Ticket already checked in");
        }
        
        ticket.setCheckInStatus(true);
        return purchasedTicketRepository.save(ticket);
    }

    public Optional<PurchasedTicket> getTicketByQrCode(String qrCode) {
        return purchasedTicketRepository.findByQrCode(qrCode);
    }
}


