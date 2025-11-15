package com.example.eventmanagement.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagement.R;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // TODO: Get user role from LoginActivity's Intent
        // TODO: Load the initial Fragment based on the user role
        // TODO: Set up BottomNavigationView listener to switch fragments
    }
}
