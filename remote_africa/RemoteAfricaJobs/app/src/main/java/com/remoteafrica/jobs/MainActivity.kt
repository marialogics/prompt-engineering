package com.remoteafrica.jobs

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import com.remoteafrica.jobs.ui.JobListingsScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val isDarkTheme = remember { mutableStateOf(isSystemInDarkTheme()) }
            
            MaterialTheme(
                colorScheme = if (isDarkTheme.value) darkColorScheme() else lightColorScheme()
            ) {
                JobListingsScreen(
                    isDarkTheme = isDarkTheme.value,
                    onThemeToggle = { isDarkTheme.value = !isDarkTheme.value }
                )
            }
        }
    }
}
