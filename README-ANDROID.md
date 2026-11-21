# Star Skin v1 — Android/Firebase source project

This archive is a **Capacitor project template**, not a compiled APK. Existing HTML/CSS/JS and Supabase functionality are included. The `firebase/google-services.json` supplied by the project owner matches `com.starskin.app`.

## Requirements (Windows)
- Node.js LTS (recent, preferably Node 22+)
- Android Studio with Android SDK and compatible JDK
- Internet access for npm dependency installation

## Build the Android project
Open CMD/PowerShell in this project folder:

```powershell
npm install
npm run android:init
npm run android:open
```

The `android:init` command builds the website, creates the native Android project, copies Firebase config into `android/app/google-services.json`, and synchronizes Capacitor. Android Studio opens with `npm run android:open`. Wait for Gradle sync and run the app on your device (or emulator with Google Play services).

When modifying the web assets later:

```powershell
npm run android:sync
```

Then build/install the APK in Android Studio. If `android/` already exists, run `npm run android:sync` instead of `android:init`.

## Notifications: what is working and what is not
- Android app requests notification permission when the user taps **Enable notifications**.
- Firebase FCM registration is implemented. Token is logged in Android WebView console as `Star Skin FCM registration token:` (and saved only locally on that phone).
- Capacitor listens for foreground notifications and notification taps.
- Existing web announcements still load from Supabase.
- **NOT YET IMPLEMENTED:** saving all device tokens centrally; securely sending FCM notifications when Admin publishes a Supabase announcement; user opt-out and token cleanup. No server key, Firebase service-account JSON or FCM secret should ever be placed in website JS/Android source. This needs a secure server/Edge Function and appropriate authenticated or abuse-resistant token registration, topic-management, and delivery logic.
- Firebase Console can send a **test** notification to the FCM token from a running installed build, to verify Android setup.
- An announcement published in Admin currently shows in the website bell. It does NOT yet automatically push to every Android device.

## Common troubleshooting
- If Firebase/Gradle errors: check that Android package is exactly `com.starskin.app` and `android/app/google-services.json` exists.
- Android 13+ users must grant notification permission. The user must also have a device with working Google Play services for typical FCM delivery.
- Supabase is online; the app requires internet for synchronized content.
- This is not an unattended build; no APK compiled or tested in this workspace.
