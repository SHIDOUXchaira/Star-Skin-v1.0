STAR SKIN V1 V10 - SUPABASE ONLINE

Already connected in the code:
 Project URL: https://eyrjwpmbsyvjtfmnzaae.supabase.co
 Storage bucket: skin-pack
 FIRST Flame Warrior card download URL: SUPER PACK ATUALIZADO (3).rar

To enable shared online ADMIN edits (ONE-TIME SETUP):
1. In Supabase > Authentication > Users, create an email/password user for admin. Do not use the old demo password.
2. Copy that user's UID from Authentication > Users.
3. In Supabase > SQL Editor, execute supabase-setup.sql. Then execute:
   insert into public.admin_users(user_id) values ('YOUR_REAL_AUTH_USER_UUID');
4. In Supabase > Project Settings > API Keys, copy the PUBLISHABLE key (or legacy anon public key), NEVER service_role or secret key.
5. Publishable key is already configured in assets/app.js. Do not paste a secret key.
6. Serve the folder on localhost and visit http://localhost:8000.
7. Admin Menu: enter email and password of the Auth user, then edit. The data will sync across visitors.
8. Upload archive for each card from Admin, or paste its public download link.

LIMITS/SECURITY:
- The starter first archive URL is usable immediately without setup; remaining cards need their own download URLs.
- Admin login in ONLINE mode uses Supabase Authentication and RLS. Do not rely on demo password.
- The public bucket allows anyone with a URL to read/download.
- Bucket currently has 30 MB upload limit.
- Uploaded files are not automatically deleted from Storage when links are removed.
- Free hosting is not guaranteed forever; maintain offline backups.
- Local fallback is not shared across devices.
