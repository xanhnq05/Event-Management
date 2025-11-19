package com.example.eventmanagement.data.repository;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import com.example.eventmanagement.data.local.AppDatabase;
import com.example.eventmanagement.data.local.EventDao;
import com.example.eventmanagement.data.local.EventEntity;
import com.example.eventmanagement.data.model.Event;
import com.example.eventmanagement.data.remote.ApiService;
import com.example.eventmanagement.data.remote.RetrofitClient;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class EventRepository {
    private final ApiService apiService;
    private final EventDao eventDao;
    private final Executor executor;
    private final Handler mainHandler;
    
    public EventRepository(Context context) {
        this.apiService = RetrofitClient.getInstance().getApiService();
        this.eventDao = AppDatabase.getInstance(context).eventDao();
        this.executor = Executors.newSingleThreadExecutor();
        this.mainHandler = new Handler(Looper.getMainLooper());
    }
    
    // Offline-first: Lấy từ local database trước, sau đó sync với server
    public void getEvents(RepositoryCallback<List<Event>> callback) {
        executor.execute(() -> {
            List<EventEntity> entities = eventDao.getAll();
            List<Event> events = convertToEvents(entities);
            
            // Trả về dữ liệu local ngay lập tức
            mainHandler.post(() -> callback.onSuccess(events));
            
            // Đồng thời sync với server ở background
            syncWithServer();
        });
    }
    
    public void getEventById(String eventId, RepositoryCallback<Event> callback) {
        executor.execute(() -> {
            EventEntity entity = eventDao.getById(eventId);
            if (entity != null) {
                Event event = convertToEvent(entity);
                mainHandler.post(() -> callback.onSuccess(event));
            } else {
                mainHandler.post(() -> callback.onError(new RuntimeException("Event not found")));
            }
            
            // Sync với server
            syncEventFromServer(eventId, callback);
        });
    }
    
    private void syncEventFromServer(String eventId, RepositoryCallback<Event> callback) {
        executor.execute(() -> {
            try {
                retrofit2.Response<Event> response = apiService.getEventById(eventId).execute();
                if (response.isSuccessful() && response.body() != null) {
                    EventEntity entity = convertToEntity(response.body());
                    eventDao.insert(entity);
                    mainHandler.post(() -> callback.onSuccess(response.body()));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
    
    private void syncWithServer() {
        executor.execute(() -> {
            try {
                retrofit2.Response<List<Event>> response = apiService.getEvents().execute();
                if (response.isSuccessful() && response.body() != null) {
                    List<EventEntity> entities = convertToEntities(response.body());
                    eventDao.insertAll(entities);
                    
                    // Sync các thay đổi offline lên server
                    syncDirtyEvents();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
    
    // Tạo event mới - lưu local trước, sync sau
    public void createEvent(Event event, RepositoryCallback<Event> callback) {
        executor.execute(() -> {
            EventEntity entity = convertToEntity(event);
            entity.setDirty(true); // Đánh dấu chưa sync
            entity.setLastSynced(System.currentTimeMillis());
            eventDao.insert(entity);
            
            Event savedEvent = convertToEvent(entity);
            mainHandler.post(() -> callback.onSuccess(savedEvent));
            
            // Thử sync với server
            syncDirtyEvents();
        });
    }
    
    private void syncDirtyEvents() {
        executor.execute(() -> {
            List<EventEntity> dirtyEvents = eventDao.getDirtyEvents();
            for (EventEntity entity : dirtyEvents) {
                try {
                    Event event = convertToEvent(entity);
                    retrofit2.Response<Event> response = apiService.createEvent(event).execute();
                    if (response.isSuccessful()) {
                        eventDao.markSynced(entity.getEventId());
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    // Helper methods để convert giữa Entity và Model
    private List<Event> convertToEvents(List<EventEntity> entities) {
        List<Event> events = new ArrayList<>();
        for (EventEntity entity : entities) {
            events.add(convertToEvent(entity));
        }
        return events;
    }
    
    private Event convertToEvent(EventEntity entity) {
        Event event = new Event();
        event.setEventId(entity.getEventId());
        event.setEventName(entity.getEventName());
        event.setDescription(entity.getDescription());
        event.setStartDateTime(entity.getStartDateTime());
        event.setPriceTicket(entity.getPriceTicket());
        event.setQuantity(entity.getQuantity());
        event.setVenueId(entity.getVenueId());
        event.setUserId(entity.getUserId());
        event.setCategoryId(entity.getCategoryId());
        return event;
    }
    
    private List<EventEntity> convertToEntities(List<Event> events) {
        List<EventEntity> entities = new ArrayList<>();
        for (Event event : events) {
            entities.add(convertToEntity(event));
        }
        return entities;
    }
    
    private EventEntity convertToEntity(Event event) {
        EventEntity entity = new EventEntity();
        entity.setEventId(event.getEventId());
        entity.setEventName(event.getEventName());
        entity.setDescription(event.getDescription());
        entity.setStartDateTime(event.getStartDateTime());
        entity.setPriceTicket(event.getPriceTicket());
        entity.setQuantity(event.getQuantity());
        entity.setVenueId(event.getVenueId());
        entity.setUserId(event.getUserId());
        entity.setCategoryId(event.getCategoryId());
        entity.setLastSynced(System.currentTimeMillis());
        entity.setDirty(false);
        return entity;
    }
    
    public interface RepositoryCallback<T> {
        void onSuccess(T data);
        void onError(Throwable error);
    }
}
