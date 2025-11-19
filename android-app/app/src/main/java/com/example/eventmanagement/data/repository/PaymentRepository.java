package com.example.eventmanagement.data.repository;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import com.example.eventmanagement.data.local.AppDatabase;
import com.example.eventmanagement.data.local.PurchasedTicketDao;
import com.example.eventmanagement.data.local.PurchasedTicketEntity;
import com.example.eventmanagement.data.remote.ApiService;
import com.example.eventmanagement.data.remote.RetrofitClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class PaymentRepository {
    private final ApiService apiService;
    private final PurchasedTicketDao purchasedTicketDao;
    private final Executor executor;
    private final Handler mainHandler;
    
    public PaymentRepository(Context context) {
        this.apiService = RetrofitClient.getInstance().getApiService();
        this.purchasedTicketDao = AppDatabase.getInstance(context).purchasedTicketDao();
        this.executor = Executors.newSingleThreadExecutor();
        this.mainHandler = new Handler(Looper.getMainLooper());
    }
    
    public void purchaseTicket(String ticketId, String userId, RepositoryCallback<Map<String, Object>> callback) {
        executor.execute(() -> {
            // Tạo purchased ticket local trước
            PurchasedTicketEntity entity = new PurchasedTicketEntity();
            entity.setPurchasedId("VM" + System.currentTimeMillis());
            entity.setTicketId(ticketId);
            entity.setUserId(userId);
            entity.setDatePurchase(String.valueOf(System.currentTimeMillis()));
            entity.setQrCode(UUID.randomUUID().toString());
            entity.setCheckInStatus(false);
            entity.setDirty(true);
            entity.setLastSynced(System.currentTimeMillis());
            
            purchasedTicketDao.insert(entity);
            
            // Convert to map for callback
            Map<String, Object> result = new HashMap<>();
            result.put("purchasedId", entity.getPurchasedId());
            result.put("ticketId", entity.getTicketId());
            result.put("userId", entity.getUserId());
            result.put("qrCode", entity.getQrCode());
            
            mainHandler.post(() -> callback.onSuccess(result));
            
            // Sync với server
            syncPurchaseToServer(ticketId, userId, entity.getPurchasedId());
        });
    }
    
    private void syncPurchaseToServer(String ticketId, String userId, String purchasedId) {
        executor.execute(() -> {
            try {
                Map<String, String> request = new HashMap<>();
                request.put("ticketId", ticketId);
                request.put("userId", userId);
                
                retrofit2.Response<Map<String, Object>> response = apiService.purchaseTicket(request).execute();
                if (response.isSuccessful()) {
                    purchasedTicketDao.markSynced(purchasedId);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
    
    public void getPurchasedTicketsByUser(String userId, RepositoryCallback<List<PurchasedTicketEntity>> callback) {
        executor.execute(() -> {
            List<PurchasedTicketEntity> tickets = purchasedTicketDao.getByUserId(userId);
            mainHandler.post(() -> callback.onSuccess(tickets));
            
            // Sync với server
            syncPurchasedTicketsFromServer(userId);
        });
    }
    
    private void syncPurchasedTicketsFromServer(String userId) {
        executor.execute(() -> {
            try {
                retrofit2.Response<List<Map<String, Object>>> response = 
                    apiService.getPurchasedTicketsByUser(userId).execute();
                if (response.isSuccessful() && response.body() != null) {
                    // Update local database with server data
                    for (Map<String, Object> ticket : response.body()) {
                        PurchasedTicketEntity entity = convertToEntity(ticket);
                        purchasedTicketDao.insert(entity);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
    
    private PurchasedTicketEntity convertToEntity(Map<String, Object> map) {
        PurchasedTicketEntity entity = new PurchasedTicketEntity();
        entity.setPurchasedId((String) map.get("purchasedId"));
        entity.setTicketId((String) map.get("ticketId"));
        entity.setUserId((String) map.get("userId"));
        entity.setQrCode((String) map.get("qrCode"));
        entity.setCheckInStatus((Boolean) map.get("checkInStatus"));
        entity.setDirty(false);
        entity.setLastSynced(System.currentTimeMillis());
        return entity;
    }
    
    public interface RepositoryCallback<T> {
        void onSuccess(T data);
        void onError(Throwable error);
    }
}


