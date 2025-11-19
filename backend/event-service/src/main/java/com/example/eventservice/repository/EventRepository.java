package com.example.eventservice.repository;

import com.example.eventservice.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByUserId(String userId);
    List<Event> findByCategoryId(String categoryId);
    List<Event> findByVenueId(String venueId);
}


