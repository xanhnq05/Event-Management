package com.example.eventmanagement.ui.organizer;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.SearchView;
import androidx.fragment.app.Fragment;

import com.example.eventmanagement.R;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

public class OrganizerDashboardFragment extends Fragment {

    public OrganizerDashboardFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_organizer_dashboard, container, false);

        setupSearchView(view);
        setupCreateEventFab(view);
        setupSettingsShortcut(view);

        return view;
    }

    private void setupSearchView(View view) {
        SearchView searchView = view.findViewById(R.id.search_view);
        if (searchView == null) {
            return;
        }

        int searchPlateId = searchView.getContext()
                .getResources()
                .getIdentifier("android:id/search_plate", null, null);
        View searchPlate = searchView.findViewById(searchPlateId);
        if (searchPlate instanceof ViewGroup) {
            ViewGroup searchPlateGroup = (ViewGroup) searchPlate;
            for (int i = 0; i < searchPlateGroup.getChildCount(); i++) {
                View child = searchPlateGroup.getChildAt(i);
                if (child instanceof EditText) {
                    ((EditText) child).setBackground(null);
                    break;
                }
            }
        } else if (searchPlate instanceof EditText) {
            ((EditText) searchPlate).setBackground(null);
        }
    }

    private void setupCreateEventFab(View view) {
        ExtendedFloatingActionButton fab = view.findViewById(R.id.fab_create_event);
        if (fab == null) {
            return;
        }

        fab.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), CreateEventActivity.class);
            startActivity(intent);
        });
    }

    private void setupSettingsShortcut(View view) {
        ImageView settingsIcon = view.findViewById(R.id.icon_settings);
        if (settingsIcon == null) {
            return;
        }

        settingsIcon.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), SettingsActivity.class);
            startActivity(intent);
        });
    }
}
