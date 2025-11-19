package com.example.eventmanagement.data.local;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;

@Dao
public interface EventDao {
    @Query("SELECT * FROM events")
    List<EventEntity> getAll();

    @Query("SELECT * FROM events WHERE event_id = :eventId")
    EventEntity getById(String eventId);

    @Query("SELECT * FROM events WHERE user_id = :userId")
    List<EventEntity> getByUserId(String userId);

    @Query("SELECT * FROM events WHERE category_id = :categoryId")
    List<EventEntity> getByCategoryId(String categoryId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<EventEntity> events);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(EventEntity event);

    @Query("SELECT * FROM events WHERE is_dirty = 1")
    List<EventEntity> getDirtyEvents();

    @Query("UPDATE events SET is_dirty = 0 WHERE event_id = :eventId")
    void markSynced(String eventId);

    @Query("DELETE FROM events WHERE event_id = :eventId")
    void delete(String eventId);
}


