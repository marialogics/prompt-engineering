# Remote Africa Jobs - Android App

A modern Android application built with Kotlin and Jetpack Compose that aggregates job listings from multiple remote job sites. The app features a clean Material Design 3 UI with support for both light and dark themes.

## Features

- **Job Listings Aggregation**: Pulls job listings from multiple remote job sites
- **Dark/Light Theme Support**: Toggle between dark and light themes with a single tap
- **Material Design 3**: Modern UI using Jetpack Compose
- **Responsive Layout**: Works seamlessly on various Android devices
- **Real-time Updates**: Fetches latest job listings from configured sources

## Requirements

- Android SDK 24 (API level 24) or higher
- Android Studio Flamingo or later
- Kotlin 1.9.0+
- Gradle 8.1.0+

## Building the Project

1. Clone or download the project
2. Open in Android Studio
3. Sync Gradle files
4. Build: `./gradlew build`

## Running the App

1. Connect an Android device or start an emulator
2. Run: `./gradlew installDebug`

## Configuration

### Adding Job Sites

Edit `app/src/main/java/com/remoteafrica/jobs/data/SitesRepository.kt` to add or modify job sites.

### Theme Customization

Modify color schemes in resource files for light and dark themes.

## License

MIT License
