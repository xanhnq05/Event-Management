package com.example.eventmanagement.data.local;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;
import java.util.Optional;

@Dao
public interface UserDao {
    @Query("SELECT * FROM users")
    List<UserEntity> getAll();

    @Query("SELECT * FROM users WHERE user_id = :userId")
    UserEntity getById(String userId);

    @Query("SELECT * FROM users WHERE account = :account")
    UserEntity getByAccount(String account);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(UserEntity user);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<UserEntity> users);

    @Query("UPDATE users SET full_name = :fullName, address = :address, phone = :phone WHERE user_id = :userId")
    void updateUser(String userId, String fullName, String address, String phone);

    @Query("DELETE FROM users WHERE user_id = :userId")
    void delete(String userId);
}


