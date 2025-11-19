package com.example.eventmanagement.utils;

import android.content.Context;
import android.content.SharedPreferences;

public final class PrefsHelper {

    private PrefsHelper() {
    }

    private static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(Constants.PREFS_NAME, Context.MODE_PRIVATE);
    }

    public static boolean isLoggedIn(Context context) {
        return getPrefs(context).getBoolean(Constants.KEY_IS_LOGGED_IN, false);
    }

    public static void setLoggedIn(Context context, boolean value) {
        getPrefs(context).edit().putBoolean(Constants.KEY_IS_LOGGED_IN, value).apply();
    }

    public static void clearSession(Context context) {
        getPrefs(context).edit().clear().apply();
    }
}

