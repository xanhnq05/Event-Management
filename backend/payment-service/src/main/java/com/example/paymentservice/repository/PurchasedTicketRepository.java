package com.example.paymentservice.repository;

import com.example.paymentservice.model.PurchasedTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchasedTicketRepository extends JpaRepository<PurchasedTicket, String> {
    List<PurchasedTicket> findByUserId(String userId);
    Optional<PurchasedTicket> findByQrCode(String qrCode);
    List<PurchasedTicket> findByTicketId(String ticketId);
}


