package com.example.eventmanagement.ui.organizer;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import com.example.eventmanagement.R;
import com.example.eventmanagement.ui.attendee.AttendeeMainActivity;
import com.example.eventmanagement.ui.auth.LoginActivity;
import com.example.eventmanagement.utils.PrefsHelper;

public class SettingsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);
        setupActions();
    }

    private void setupActions() {
        CardView visitorCard = findViewById(R.id.row_go_to_visitor);
        if (visitorCard != null) {
            visitorCard.setOnClickListener(this::openVisitorDashboard);
        }

        CardView signOutCard = findViewById(R.id.row_sign_out);
        if (signOutCard != null) {
            signOutCard.setOnClickListener(this::signOut);
        }
    }

    private void openVisitorDashboard(View view) {
        Intent intent = new Intent(this, AttendeeMainActivity.class);
        startActivity(intent);
    }

    private void signOut(View view) {
        PrefsHelper.setLoggedIn(this, false);
        Intent intent = new Intent(this, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}

