# 🔧 Diagnostics & Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module 'firebase'"

**Error in Console:**
```
Error: Can't resolve 'firebase/app'
```

**Cause:** Firebase package not installed

**Fix:**
```bash
npm install firebase
```

Then restart:
```bash
npm start
```

---

### Issue 2: "Firebase Connection Failed"

**Error:**
```
Error: Failed to initialize Firebase
```

**Cause:** `.env.local` not configured or values incorrect

**Check:**
1. Do you have `.env.local` file? (not `.env.example`)
   - Location: Same folder as `package.json`
   - Name must be exactly `.env.local` (with the dot!)

2. All 7 Firebase values present?
   ```bash
   cat .env.local  # Replace 'cat' with 'type' on Windows
   ```

3. No extra spaces or quotes?
   - ✅ Correct: `REACT_APP_FIREBASE_API_KEY=ABC123xyz`
   - ❌ Wrong: `REACT_APP_FIREBASE_API_KEY= ABC123xyz` (space)
   - ❌ Wrong: `REACT_APP_FIREBASE_API_KEY="ABC123xyz"` (quotes)

**Fix:**
1. Verify all values copied correctly
2. No leading/trailing spaces
3. Restart app: `npm start`

---

### Issue 3: "Data Not Syncing to Tablet"

**Symptom:** Laptop shows data, tablet shows empty

**Step 1: Check Code Matches**
- Are you entering the EXACT same code on both?
- Case-sensitive (ABC123 ≠ abc123)

**Step 2: Check Connection**
- Both devices on same WiFi? (Essential!)
- Can you ping the laptop from tablet?
  ```
  ping [laptop-ip]  # On tablet terminal
  ```

**Step 3: Check Firebase**
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project
3. Click **Realtime Database**
4. You should see data under `dashboards` → `{CODE}` → `students`
5. If empty: Firebase isn't receiving data → Check `.env.local`

**Step 4: Check Browser Cache**
- Hard refresh both devices:
  - Windows: `Ctrl+Shift+Delete`
  - Mac: `Cmd+Shift+Delete`
  - Or: Open DevTools (F12) → Network → Disable Cache → Refresh

**Step 5: Check Browser Console for Errors**
- Laptop: Press F12 → Console tab → Look for red errors
- Tablet: Same process
- Screenshot and check for "Cannot reach Firebase" type messages

---

### Issue 4: "Works on Laptop, Fails on Tablet"

**Common Cause:** Wrong URL or network issue

**Fix - IP Address:**
1. On laptop, open Command Prompt
2. Type: `ipconfig`
3. Find line that says "IPv4 Address" (e.g., `192.168.1.100`)
4. On tablet, open: `http://[THAT NUMBER]:3000`
   - Example: `http://192.168.1.100:3000`

**If still failing:**
- Laptop and tablet on same WiFi?
- Firewall blocking connection?
- Try turning WiFi off/on both devices

---

### Issue 5: "Data Loses on Refresh"

**Symptom:** Close tablet app, reopen, data gone

**Cause:** Firebase not syncing before close

**Check:**
1. Wait 2 seconds after adding data (auto-save debounce)
2. Check Firebase console for data:
   - [console.firebase.google.com](https://console.firebase.google.com)
   - Realtime Database
   - Look for `dashboards/{your-code}/students`

**Fix:**
- If data in Firebase: Click "Leave" then "Join" with code
- If data NOT in Firebase: Firebase not configured correctly (see Issue 2)

---

### Issue 6: "Database URL Not Found"

**Error:**
```
Invalid URL format for databaseURL
```

**Cause:** Wrong database URL in `.env.local`

**Check - Correct Format:**
```
❌ Wrong: teacher-app-demo (no https://)
❌ Wrong: teacher-app-demo.firebaseio.com (no protocol)
✅ Correct: https://teacher-app-demo.firebaseio.com
```

**Get Correct URL:**
1. Firebase Console → Realtime Database
2. Look at top of page
3. Copy exact URL (includes `https://` and ends in `firebaseio.com`)

---

### Issue 7: "Test Mode Expired"

**Error** (After 30 days):
```
Permission denied creating database
```

**Cause:** Firebase Test Mode expires

**Fix:**
1. Go to Firebase Console → Realtime Database
2. Click **Rules**
3. Replace with open rules:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
4. Click **Publish**

**Or better:** Set up authentication (see DEPLOYMENT_GUIDE.md)

---

### Issue 8: "Port 3000 Already in Use"

**Error:**
```
Something is already running on port 3000
```

**Cause:** Another app using port 3000

**Fix Option 1 - Kill existing process:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Fix Option 2 - Use different port:**
```bash
PORT=3001 npm start
```

---

## ✅ Diagnostic Checklist

If data isn't syncing, check these **in order**:

- [ ] 1. Firebase project created?
  - Go to [console.firebase.google.com](https://console.firebase.google.com)
  - See your project listed?

- [ ] 2. Realtime Database enabled?
  - Firebase Dashboard → Realtime Database
  - Database exists (not just Authentication)?

- [ ] 3. `.env.local` created?
  - Exact filename `.env.local` (not `.env`)
  - In project root (same folder as package.json)?
  - Contains all 7 Firebase variables?

- [ ] 4. No typos in variables?
  - Copy-pasted from Firebase (not retyped)?
  - No extra spaces before/after values?

- [ ] 5. App restarted after `.env.local` created?
  - Kill `npm start`
  - Run `npm start` again?

- [ ] 6. Both devices on same WiFi?
  - Laptop & Tablet connected to same network?
  - Not on different home WiFi vs mobile hotspot?

- [ ] 7. Correct code on both devices?
  - Exact same code?
  - Case-sensitive?

- [ ] 8. Data visible in Firebase Console?
  - [console.firebase.google.com](https://console.firebase.google.com)
  - Your project → Realtime Database
  - Expand `dashboards` → Your code → Can you see data?

- [ ] 9. Browser cache cleared?
  - Hard refresh: `Ctrl+Shift+Delete`
  - Disable cache in DevTools (F12)?

---

## 🐛 Debug Mode

### Enable Firebase Logging:
Add to `src/utils/firebaseConfig.js` after initialization:

```javascript
// Enable debug logging (temporary - remove for production)
import { enableLogging } from 'firebase/database';
enableLogging(true);
```

Then check browser console (F12) for Firebase messages.

### Check Network Requests:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Add some data in the app
4. Look for requests to `firebaseio.com`
5. Should see `POST` requests with status `200`

---

## 📞 Getting Help

### Document References:
- Firebase setup help → `FIREBASE_SETUP.md`
- Deployment problems → `VERCEL_DEPLOYMENT.md`
- General questions → `DEPLOYMENT_GUIDE.md`

### Quick Test Command:
```bash
# Check if Firebase is accessible
curl https://your-project.firebaseio.com/dashboards.json

# Should return: {"ABC123": {...}, ...}
# Or empty: null
```

### Screenshot Debugging:
If still stuck, create a screenshot of:
1. Browser console error (F12 → Console)
2. Firebase console data view
3. Your `.env.local` file (blur secrets)
4. Terminal output from `npm start`

---

## ✨ If All Else Fails

**Complete Reset:**
1. Stop the app: `Ctrl+C`
2. Delete `node_modules`: `rm -r node_modules`
3. Reinstall: `npm install`
4. Restart: `npm start`
5. Hard refresh browser: `Ctrl+Shift+Delete`

**If still broken:**
- Start over with `FIREBASE_SETUP.md`
- Create new Firebase project
- Double-check every value copied correctly

---

**Most issues are caused by typos in `.env.local` or Firebase settings. Slow down and double-check!** ✅
