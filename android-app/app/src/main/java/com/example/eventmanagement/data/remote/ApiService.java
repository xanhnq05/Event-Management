package com.example.eventmanagement.data.remote;

import com.example.eventmanagement.data.model.Event;
import com.example.eventmanagement.data.model.User;

import java.util.Map;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {
    // Event endpoints
    @GET("api/events")
    Call<java.util.List<Event>> getEvents();
    
    @GET("api/events/{id}")
    Call<Event> getEventById(@Path("id") String id);
    
    @GET("api/events/user/{userId}")
    Call<java.util.List<Event>> getEventsByUser(@Path("userId") String userId);
    
    @POST("api/events")
    Call<Event> createEvent(@Body Event event);
    
    @PUT("api/events/{id}")
    Call<Event> updateEvent(@Path("id") String id, @Body Event event);
    
    @DELETE("api/events/{id}")
    Call<Void> deleteEvent(@Path("id") String id);
    
    // Auth endpoints
    @POST("api/auth/login")
    Call<User> login(@Body Map<String, String> credentials);
    
    @POST("api/auth/register")
    Call<User> register(@Body User user);
    
    // Payment endpoints
    @POST("api/payments/purchase")
    Call<Map<String, Object>> purchaseTicket(@Body Map<String, String> request);
    
    @GET("api/payments/tickets/user/{userId}")
    Call<java.util.List<Map<String, Object>>> getPurchasedTicketsByUser(@Path("userId") String userId);
    
    @POST("api/payments/checkin")
    Call<Map<String, Object>> checkIn(@Body Map<String, String> request);
}

