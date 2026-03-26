# GitHub & Vercel Deployment Checklist

## ✅ Before Pushing to GitHub

### Files to Check
- [ ] `.env.local` is in `.gitignore` (never commit secrets)
- [ ] `.env.example` exists with template variables
- [ ] `package.json` includes all dependencies
- [ ] `README.md` updated with correct instructions
- [ ] `.gitignore` includes:
  - `node_modules/`
  - `.env.local`
  - `.env`
  - `build/`

### Code Quality
- [ ] No console.log() debug statements (or use for errors only)
- [ ] All imports used (no unused variables)
- [ ] No hardcoded API keys or secrets

---

## 📤 Push to GitHub

```bash
# Navigate to project
cd teacher-app

# Verify .env.local NOT in version control
git check-ignore .env.local

# Stage and commit
git add .
git commit -m "feat: Add Firebase cross-device sync and professional theming"
git push origin main
```

---

## 🚀 Deploy to Vercel

### Option 1: Connect GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Vercel auto-detects it's a React app → click **"Deploy"**
5. Configure Environment Variables (see below)
6. Deployment complete! 🎉

### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

---

## 🔐 Add Environment Variables to Vercel

### In Vercel Dashboard:
1. Go to your Project → **Settings** → **Environment Variables**
2. Add all 7 variables from `.env.example`:

| Name | Value |
|------|-------|
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSy...` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `project.firebaseapp.com` |
| `REACT_APP_FIREBASE_DATABASE_URL` | `https://project.firebaseio.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `project-id` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `project.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `123456789...` |
| `REACT_APP_FIREBASE_APP_ID` | `1:123...` |

3. Re-deploy after adding variables (`git push` or click Redeploy)

---

## 🔓 Update Firebase Rules for Production

### In Firebase Console:

1. Go to **Realtime Database** → **Rules**
2. Replace with:

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

3. Click **"Publish"**

**⚠️ Note:** These are permissive rules. For production with user auth, implement strict rules (see below).

### Secure Rules (Optional - Requires Authentication):

```json
{
  "rules": {
    "dashboards": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null",
        "metadata": {
          ".read": "auth != null",
          ".write": "root.child('dashboards').child($code).child('creator').val() === auth.uid"
        },
        "students": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "deadlines": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

---

## ✨ Your Deployment is Live!

- **URL**: `https://your-app.vercel.app`
- **Auto-deploys**: On every `git push` to `main`
- **Database**: Firebase syncs across all devices
- **HTTPS**: Automatic & always enabled

---

## 🔄 Subsequent Updates

Every time you push to GitHub:
```bash
git add .
git commit -m "describe your changes"
git push origin main
```

**Vercel automatically redeploys!** No manual steps needed.

---

## 📊 Monitor Deployment

### View Deployment Status:
- Vercel Dashboard → Project → Recent Deployments
- GitHub → Actions tab (if configured)

### Check Logs:
- Vercel Dashboard → Deployments → Select deployment → Logs
- Firebase Console → Realtime Database → Realtime Database Rules

---

## 🆘 Common Issues

| Error | Fix |
|-------|-----|
| "Environment variables not set" | Add them in Vercel Settings before redeploy |
| "Firebase connection failed" | Check environment variables copied exactly (no extra spaces) |
| "Test Mode expired" | Recreate database or add authentication |
| "Data not syncing" | Check database rules in Firebase console |

---

## 🎓 Next Steps

1. **Share with Users**: Give them the Vercel URL
2. **Monitor Usage**: Check Firebase Database size & rules
3. **Add Authentication**: Implement user login (see DEPLOYMENT_GUIDE.md)
4. **Custom Domain**: (Optional) Add your own domain in Vercel

---

**🎉 Congratulations! Your app is live and ready for teachers!**
