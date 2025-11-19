package com.example.paymentservice.controller;

import com.example.paymentservice.model.PurchasedTicket;
import com.example.paymentservice.model.Ticket;
import com.example.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;

    @GetMapping("/tickets")
    public ResponseEntity<List<PurchasedTicket>> getAllPurchasedTickets() {
        return ResponseEntity.ok(paymentService.getAllPurchasedTickets());
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<PurchasedTicket> getPurchasedTicketById(@PathVariable String id) {
        return paymentService.getPurchasedTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tickets/user/{userId}")
    public ResponseEntity<List<PurchasedTicket>> getPurchasedTicketsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(paymentService.getPurchasedTicketsByUserId(userId));
    }

    @GetMapping("/tickets/event/{eventId}")
    public ResponseEntity<List<Ticket>> getTicketsByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(paymentService.getTicketsByEventId(eventId));
    }

    @PostMapping("/purchase")
    public ResponseEntity<PurchasedTicket> purchaseTicket(@RequestBody Map<String, String> request) {
        try {
            String ticketId = request.get("ticketId");
            String userId = request.get("userId");
            PurchasedTicket purchasedTicket = paymentService.purchaseTicket(ticketId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(purchasedTicket);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/checkin")
    public ResponseEntity<PurchasedTicket> checkIn(@RequestBody Map<String, String> request) {
        try {
            String qrCode = request.get("qrCode");
            PurchasedTicket ticket = paymentService.checkIn(qrCode);
            return ResponseEntity.ok(ticket);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/tickets/qr/{qrCode}")
    public ResponseEntity<PurchasedTicket> getTicketByQrCode(@PathVariable String qrCode) {
        return paymentService.getTicketByQrCode(qrCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}


