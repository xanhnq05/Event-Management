package com.example.eventmanagement.data.local;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;

@Dao
public interface PurchasedTicketDao {
    @Query("SELECT * FROM purchased_tickets")
    List<PurchasedTicketEntity> getAll();

    @Query("SELECT * FROM purchased_tickets WHERE purchased_id = :purchasedId")
    PurchasedTicketEntity getById(String purchasedId);

    @Query("SELECT * FROM purchased_tickets WHERE user_id = :userId")
    List<PurchasedTicketEntity> getByUserId(String userId);

    @Query("SELECT * FROM purchased_tickets WHERE qr_code = :qrCode")
    PurchasedTicketEntity getByQrCode(String qrCode);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(PurchasedTicketEntity purchasedTicket);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<PurchasedTicketEntity> purchasedTickets);

    @Query("SELECT * FROM purchased_tickets WHERE is_dirty = 1")
    List<PurchasedTicketEntity> getDirtyTickets();

    @Query("UPDATE purchased_tickets SET is_dirty = 0 WHERE purchased_id = :purchasedId")
    void markSynced(String purchasedId);

    @Query("UPDATE purchased_tickets SET checkin_status = 1 WHERE qr_code = :qrCode")
    void checkIn(String qrCode);
}


