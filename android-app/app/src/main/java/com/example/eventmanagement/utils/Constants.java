package com.example.eventmanagement.utils;

public final class Constants {

    private Constants() {
    }

    // Thay đổi BASE_URL thành địa chỉ API Gateway
    // Cho Android Emulator: http://10.0.2.2:8080/
    // Cho thiết bị thật: http://YOUR_IP:8080/
    public static final String BASE_URL = "http://10.0.2.2:8080/";
    public static final String PREFS_NAME = "AppPrefs";
    public static final String KEY_IS_LOGGED_IN = "isLoggedIn";
}

