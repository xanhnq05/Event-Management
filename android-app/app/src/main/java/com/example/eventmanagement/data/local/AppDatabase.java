package com.example.eventmanagement.data.local;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

@Database(entities = {EventEntity.class, UserEntity.class, PurchasedTicketEntity.class}, 
          version = 1, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    private static AppDatabase INSTANCE;
    
    public abstract EventDao eventDao();
    public abstract UserDao userDao();
    public abstract PurchasedTicketDao purchasedTicketDao();
    
    public static synchronized AppDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            INSTANCE = Room.databaseBuilder(
                context.getApplicationContext(),
                AppDatabase.class,
                "event_database"
            ).build();
        }
        return INSTANCE;
    }
}

