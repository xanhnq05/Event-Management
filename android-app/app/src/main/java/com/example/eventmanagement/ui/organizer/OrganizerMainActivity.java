package com.example.eventmanagement.ui.organizer;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;

import com.example.eventmanagement.R;
import com.example.eventmanagement.ui.auth.LoginActivity;
import com.example.eventmanagement.utils.PrefsHelper;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class OrganizerMainActivity extends AppCompatActivity {

    private BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (!PrefsHelper.isLoggedIn(this)) {
            navigateToLogin();
            return;
        }

        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        bottomNavigationView = findViewById(R.id.bottom_navigation);
        setupBottomNavigation();
        if (savedInstanceState == null) {
            showFragment(new OrganizerDashboardFragment());
        }
    }

    private void setupBottomNavigation() {
        if (bottomNavigationView == null) {
            return;
        }

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home || itemId == R.id.nav_events || itemId == R.id.nav_settings) {
                showFragment(new OrganizerDashboardFragment());
                return true;
            }
            return false;
        });
    }

    private void showFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragment_container, fragment)
                .commit();
        updateBottomNavigationVisibility(!(fragment instanceof OrganizerDashboardFragment));
    }

    private void updateBottomNavigationVisibility(boolean visible) {
        if (bottomNavigationView == null) {
            return;
        }
        bottomNavigationView.setVisibility(visible ? View.VISIBLE : View.GONE);
    }

    private void navigateToLogin() {
        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }
}