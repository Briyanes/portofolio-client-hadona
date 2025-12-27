# Cara Membuat Admin User

## Langkah 1: Create User di Supabase Auth

1. Buka **Supabase Dashboard**
2. Pilih project Anda
3. Go to **Authentication** → **Users**
4. Klik **"Add user"** → **"Create new user"**
5. Isi:
   - **Email**: admin@hadona.id (atau email lain)
   - **Password**: (minimal 8 karakter)
   - **Auto Confirm User**: ✅ Check
6. Klik **"Create user"**

## Langkah 2: Copy User ID

1. Setelah user dibuat, klik pada user tersebut
2. Copy **User UID** (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

## Langkah 3: Insert ke admin_users Table

Jalankan SQL ini di Supabase SQL Editor:

```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  'PASTE_USER_UID_DISINI',
  'admin@hadona.id',
  'Admin Hadona',
  'admin',
  true
);
```

## Langkah 4: Test Login

1. Buka: `http://localhost:3000/admin/login`
2. Login dengan email dan password yang dibuat
3. Anda akan di-redirect ke dashboard

---

## Contoh:

Jika User UID Anda adalah `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`

```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  'admin@hadona.id',
  'Admin Hadona',
  'admin',
  true
);
```
