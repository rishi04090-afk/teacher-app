# Teacher Handoff Dashboard - Setup Guide

## Overview
This is a React-based Co-Op Program Dashboard that allows teachers to manage student placements, deadlines, and notes with **real-time cross-device synchronization** using Firebase.

## Features
✅ Create and share dashboards with unique codes  
✅ Cross-device data sync (laptop, tablet, phone)  
✅ Real-time updates with Firebase  
✅ Offline-capable with localStorage fallback  
✅ Edit/delete students, notes, and deadlines  
✅ Professional UI  
✅ GitHub & Vercel ready  

---

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Google/Firebase account (free tier available)

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd teacher-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Firebase

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Follow the setup wizard
4. Once created, go to **Project Settings** (gear icon)

#### Enable Realtime Database
1. In the Firebase console, go to **Realtime Database**
2. Click "Create Database"
3. Start in **Test Mode** (for development)
4. Wait for database creation

#### Get Firebase Credentials
1. In **Project Settings**, scroll to "Your apps"
2. If no app exists, click "Add app" and select "Web"
3. Copy the Firebase config object

#### Create `.env.local` File
In the project root, create a `.env.local` file with your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://YOUR_PROJECT.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

**Important:** `.env.local` is already in `.gitignore` - it will NOT be committed to GitHub.

### 4. Start Development Server
```bash
npm start
```

The app runs at `http://localhost:3000`

---

## Testing Cross-Device Sync

1. **On Your Computer:**
   - Open `http://localhost:3000`
   - Click "Create New Dashboard"
   - Save your code (e.g., `ABC123`)
   - Add some students and deadlines

2. **On Your Tablet (Same Wi-Fi):**
   - Open `http://<YOUR_COMPUTER_IP>:3000`
   - Click "Join Existing Dashboard"
   - Enter the code from step 1
   - **Your data should appear immediately!**

3. **Add more data** on either device - it syncs in real-time

---

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit: Teacher Handoff Dashboard"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. In **Environment Variables**, add your Firebase credentials:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_DATABASE_URL`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
5. Click "Deploy"

### 3. Update Firebase Allowed Hosts
1. Go to Firebase Console → Realtime Database → **Rules**
2. Replace the rules with:

```json
{
  "rules": {
    "dashboards": {
      "$code": {
        ".read": true,
        ".write": true,
        "metadata": {
          ".read": true,
          ".write": true
        },
        "students": {
          ".read": true,
          ".write": true
        },
        "deadlines": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```

**Note:** These are permissive rules for development. For production, implement proper authentication.

---

## GitHub Repository Setup

### Required Files (Already Included)
- `.env.example` - Template for environment variables
- `.gitignore` - Excludes `.env.local` and `node_modules`
- `package.json` - Dependencies and scripts

### Add to GitHub
```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

### Protect Secrets
- **Never commit** `.env.local` 
- Use `.env.example` as template only
- Vercel and other providers manage secrets via their dashboards

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API Key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_DATABASE_URL` | Realtime Database URL |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID |

---

## How Data Sync Works

### Real-time Flow
```
Device A (Laptop) → Add Student → Firebase ← Device B (Tablet)
         ↓                                          ↓
      States Updated Instantly              States Updated Instantly
```

### Data Hierarchy
```
Firebase Realtime Database
└── dashboards/
    └── {CODE}/
        ├── metadata (created, lastUpdated, isCreator)
        ├── students (array)
        └── deadlines (array)
```

### Fallback System
1. Try Firebase first (primary)
2. Fall back to localStorage (offline)
3. Data syncs when connection restored

---

## Common Issues & Solutions

### ❌ "Cannot find module 'firebase'"
```bash
npm install firebase
```

### ❌ Firebase connection fails
- Check `.env.local` values are correct
- Verify Firebase Realtime Database is enabled
- Check internet connection
- App still works offline with localStorage

### ❌ Changes not syncing across devices
- Ensure both devices are entering the same code
- Check Firebase Rules allow read/write
- Reload the page to fetch latest data

### ❌ Data lost after refresh
- Check `.env.local` is configured
- Verify localStorage is enabled (not in private mode)
- Check browser console for errors

---

## Architecture

```
src/
├── components/
│   ├── AccessCodeScreen.js     (Entry point)
│   ├── CodeDisplay.js          (Code management)
│   ├── StudentList.js          (Student browser)
│   ├── StudentDetail.js        (Student editor)
│   ├── DeadlinesPanel.js       (Deadline manager)
│   └── ... (other components)
├── utils/
│   ├── codeStorage.js          (LocalStorage utils)
│   ├── firebaseConfig.js       (Firebase initialization)
│   ├── firebaseDatabase.js     (Firebase operations)
│   └── ... (other utilities)
├── styles/
│   ├── App.css
│   └── ... (component styles)
└── App.js                      (Main component)
```

---

## Performance Optimization

- Auto-saves with 500ms debounce (prevents too many Firebase writes)
- LocalStorage caching for offline support
- Lazy loading for student details
- Code splitting via React lazy import

---

## Security Notes

### Development (Current)
- Open Firebase rules for testing
- Suitable for small internal teams

### Production (Recommended)
- Implement Firebase Authentication
- Use strict security rules
- Validate all data server-side
- Add rate limiting
- Consider user permissions

---

## Support

For questions or issues:
1. Check this guide first
2. Review [Firebase Docs](https://firebase.google.com/docs)
3. Check [Vercel Docs](https://vercel.com/docs)
4. Create a GitHub Issue

---

## License

[Add your license here]
