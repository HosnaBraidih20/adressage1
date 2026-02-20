# 🔐 Keycloak Configuration - Fix "Invalid parameter: redirect_uri"

## ✅ What I Fixed in Frontend

1. **Login redirect URI** - Changed from `window.location.href` to `window.location.origin + '/register'`
2. **Removed auto-redirect on init** - Let ProtectedRoute handle unauthenticated users properly
3. Both ensures Keycloak receives valid, registered redirect URIs

---

## 🔧 CRITICAL: Keycloak Admin Console Configuration

The error happens because your **Keycloak client configuration** doesn't have the correct redirect URIs registered.

### Step 1: Login to Keycloak Admin Console
```
http://localhost:8080/admin/master/console/
```

### Step 2: Navigate to Your Client
1. Click **Realms** → **MyStoreRealm**
2. Click **Clients** → **my-frontend-app**

### Step 3: Go to "Access" Tab (CRITICAL)

Find these sections and configure them:

#### ✅ Valid Redirect URIs
Add ALL of these:
```
http://localhost:3000/
http://localhost:3000/*
http://localhost:3000/register
http://localhost:3000/login
```

**Why all 4?**
- `http://localhost:3000/` → Root redirect (safest)
- `http://localhost:3000/*` → Wildcard (allows any subpath)
- `http://localhost:3000/register` → Specific redirect after login
- `http://localhost:3000/login` → Fallback

#### ✅ Web Origins (CORS)
Add:
```
http://localhost:3000
```

#### ✅ Admin URL
Add (optional but recommended):
```
http://localhost:3000
```

### Step 4: SAVE (Important!)
Click **Save** button at the bottom

---

## 📋 Complete Client Configuration Checklist

Go through each section and verify:

### General Settings Tab
- [ ] Client ID: `my-frontend-app`
- [ ] Client Protocol: `openid-connect`
- [ ] Access Type: `public` (NOT confidential for SPA)
- [ ] Standard Flow Enabled: ✅ ON
- [ ] Implicit Flow Enabled: ✅ ON
- [ ] Direct Access Grants Enabled: ✅ ON

### Access Tab (MOST IMPORTANT)
- [ ] Valid Redirect URIs: `http://localhost:3000/*`
- [ ] Web Origins: `http://localhost:3000`

### Credentials Tab (if applicable)
- [ ] Access Type: `public` (shows no credentials needed)

---

## 🧪 Test Configuration

### Option 1: Test Direct URL
After saving configuration, try accessing this exact URL in browser:
```
http://localhost:8080/auth/realms/MyStoreRealm/protocol/openid-connect/auth?
  client_id=my-frontend-app&
  response_type=code&
  scope=openid&
  redirect_uri=http://localhost:3000/register
```

Should redirect to Keycloak login, NOT show error.

### Option 2: Test from React App
1. Clear browser cache (Ctrl+Shift+Del)
2. Close all localhost:3000 tabs
3. Open new tab to `http://localhost:3000`
4. Click "Login with Keycloak"
5. In **browser console**, you should see:
   ```
   🔐 Initiating login with redirect URI: http://localhost:3000/register
   ```
6. After login, you should be redirected to `http://localhost:3000/register`

---

## ❌ If Still Getting Error

### Check 1: Realm Name
Verify realm is exactly **MyStoreRealm** (case-sensitive):
```javascript
// In browser console
fetch('http://localhost:8080/realms/MyStoreRealm')
  .then(r => r.json())
  .then(d => console.log(d.realm))
```
Should print: `MyStoreRealm` (not `mystore` or `mystorerealmm`)

### Check 2: Client ID
Verify client ID is exactly **my-frontend-app**:
```
Clients → Look for "my-frontend-app"
```

### Check 3: Redirect URI Format
- ❌ WRONG: `localhost:3000/` (missing http://)
- ❌ WRONG: `http://127.0.0.1:3000/` (should use localhost)
- ✅ CORRECT: `http://localhost:3000/`

### Check 4: Frontend Code
Verify KeycloakContext has correct config:
```javascript
const keycloakInstance = new Keycloak({
  url: 'http://localhost:8080',        // ✅ Correct
  realm: 'MyStoreRealm',                // ✅ Correct
  clientId: 'my-frontend-app',          // ✅ Correct
});
```

---

## 📊 Network Request Debugging

When you click "Login", check Network tab in DevTools:

### Request Should Go To:
```
https://localhost:8080/auth/realms/MyStoreRealm/protocol/openid-connect/auth?
  client_id=my-frontend-app&
  redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister&
  response_mode=fragment&
  response_type=code&
  ...
```

### If Error, Response Shows:
```json
{
  "error": "invalid_request",
  "error_description": "Invalid parameter: redirect_uri"
}
```

**Solution**: Add that exact `redirect_uri` value to Keycloak Valid Redirect URIs

---

## ✨ After Fix Works

You should see in browser console:
```
🔐 Initiating login with redirect URI: http://localhost:3000/register
✅ Keycloak initialized: true
👤 User loaded: {email: "user@example.com", ...}
```

And browser URL should be:
```
http://localhost:3000/register  ← NOT at Keycloak anymore!
```

---

## 🚀 Final Checklist

Before testing again:

- [ ] Updated Valid Redirect URIs in Keycloak (added `http://localhost:3000/*`)
- [ ] Updated Web Origins (added `http://localhost:3000`)
- [ ] Clicked Save button
- [ ] Frontend has latest code (with login fix)
- [ ] Restarted React app (`npm start`)
- [ ] Cleared browser cache
- [ ] Using correct realm name: `MyStoreRealm`
- [ ] Using correct client ID: `my-frontend-app`

Once all checked ✅, try login flow again!
