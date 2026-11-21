STAR SKIN V1 — V12 ANNOUNCEMENTS
==================================
WHAT WORKS NOW:
- Announcement editor inside Admin Menu on Home, Apply and Selected pages
- Supabase announcements table, with admin-only publish/delete policies
- Bell notification center, visible to website visitors on all pages
- New messages refresh on page open / roughly every 45 seconds while the site is open

SETUP (required):
1. Open Supabase Dashboard > SQL Editor > New query
2. Paste announcements-setup.sql and click Run
3. Host the updated website (or test on http://localhost:8000)
4. Open Admin Menu and sign in using your Supabase Authentication email/password
5. Type title + message, click Publish announcement
6. Open the site in another browser to verify it appears under the bell

ANDROID PUSH (NOT YET ACTIVE):
This uploaded source is HTML/CSS/JavaScript only, not the Android APK project.
Bell announcements work inside the website. To display native OS notifications when
Android app is in background/closed, provide the Android Studio or Capacitor project.
Then create a Firebase project, register Android app package ID, download
firebase google-services.json into the Android app, enable FCM token registration,
set up an authenticated server-side sender (e.g. Supabase Edge Function) and
secure storage/RLS for device tokens. Android 13+ needs notification permission.
Never put Firebase service-account secrets in HTML or frontend JavaScript.
Sending a web announcement does not by itself send an FCM push.
