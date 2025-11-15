package com.example.eventmanagement;

import android.app.Activity;
import android.os.Bundle;
import androidx.annotation.Nullable; // Thêm import này nếu chưa có
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class OrganizerDashboardFragment extends Activity { // Lưu ý: Nó vẫn đang là Activity

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Liên kết Activity này với file layout activity_organizer_dashboard.xml
        setContentView(R.layout.fragment_organizer_dashboard);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.organizer_dashboard), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }
}