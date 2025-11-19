package com.example.eventmanagement.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.eventmanagement.R;
import com.example.eventmanagement.ui.organizer.OrganizerMainActivity;
import com.example.eventmanagement.utils.PrefsHelper;

public class LoginActivity extends AppCompatActivity {

    private EditText editTextEmail;
    private EditText editTextPassword;
    private Button buttonLogin;
    private TextView textRegister;
    private LoginViewModel loginViewModel;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        bindViews();
        setupViewModel();
        setupListeners();
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (PrefsHelper.isLoggedIn(this)) {
            navigateToOrganizer();
        }
    }

    private void bindViews() {
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
        buttonLogin = findViewById(R.id.buttonLogin);
        textRegister = findViewById(R.id.textRegister);
    }

    private void setupViewModel() {
        loginViewModel = new ViewModelProvider(this).get(LoginViewModel.class);
        loginViewModel.getLoginSuccess().observe(this, success -> {
            if (Boolean.TRUE.equals(success)) {
                PrefsHelper.setLoggedIn(this, true);
                Toast.makeText(this, "Đăng nhập thành công!", Toast.LENGTH_SHORT).show();
                navigateToOrganizer();
            }
        });

        loginViewModel.getErrorMessage().observe(this, message -> {
            if (message != null) {
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupListeners() {
        buttonLogin.setOnClickListener(v -> {
            String email = editTextEmail.getText().toString().trim();
            String password = editTextPassword.getText().toString().trim();
            loginViewModel.login(email, password);
        });

        textRegister.setOnClickListener(v ->
                Toast.makeText(this, "Chuyển đến trang đăng ký (sắp ra mắt)", Toast.LENGTH_SHORT).show()
        );
    }

    private void navigateToOrganizer() {
        startActivity(new Intent(this, OrganizerMainActivity.class));
        finish();
    }
}
