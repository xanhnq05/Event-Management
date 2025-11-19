package com.example.eventmanagement.ui.auth;

import android.text.TextUtils;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class LoginViewModel extends ViewModel {

    private final MutableLiveData<Boolean> loginSuccess = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public LiveData<Boolean> getLoginSuccess() {
        return loginSuccess;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public void login(String email, String password) {
        if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
            errorMessage.setValue("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if ("admin@gmail.com".equals(email) && "123456".equals(password)) {
            loginSuccess.setValue(true);
        } else {
            errorMessage.setValue("Sai email hoặc mật khẩu!");
        }
    }
}

