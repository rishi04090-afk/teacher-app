# 📚 Co-Op Program Dashboard

A real-time collaborative dashboard for teachers to manage student placements, deadlines, and notes with seamless cross-device synchronization.

## ✨ Features

- ✅ **Real-time Sync** - Changes instantly sync across all devices (laptop, tablet, phone)
- ✅ **Code-based Sharing** - Generate unique 6-character codes to share dashboards
- ✅ **Student Management** - Add, edit, and delete student information and notes
- ✅ **Deadline Tracking** - Set, track, and manage important dates
- ✅ **Professional UI** - Clean, modern, enterprise-ready interface
- ✅ **Offline Support** - Works without internet (syncs when connection restored)
- ✅ **Cross-Platform** - Works on any browser (Chrome, Safari, Firefox, Edge)

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- Firebase account (free tier: [firebase.google.com](https://firebase.google.com))

### Setup

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd teacher-app
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Realtime Database (Test Mode)
   - Copy your Firebase config

3. **Create `.env.local`** (use `.env.example` as template)
   ```
   REACT_APP_FIREBASE_API_KEY=your_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start Development**
   ```bash
   npm start
   ```
   Opens `http://localhost:3000`

## 📱 Cross-Device Testing

1. **Computer**: Create a dashboard → Get code (e.g., `ABC123`)
2. **Tablet**: Join dashboard → Enter code → Instant sync!
3. Add data anywhere → See it update everywhere in real-time

## 🔐 Security Notes

**Development**: Currently uses open Firebase rules for easy testing

**Production**: Implement Firebase Authentication and strict security rules (see `DEPLOYMENT_GUIDE.md`)

## 📦 Deployment

### Deploy to Vercel (5 minutes)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add Firebase environment variables
4. Deploy ✨

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📖 Documentation

- **Setup & Firebase**: See `DEPLOYMENT_GUIDE.md`
- **Architecture**: Check `src/utils/firebaseDatabase.js`
- **Components**: See `src/components/`

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4
- **Backend**: Firebase Realtime Database
- **Hosting**: Vercel
- **Version Control**: GitHub
- **Styling**: CSS Grid + Flexbox

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not syncing | Check `.env.local` Firebase config + internet connection |
| Can't see data on tablet | Ensure entering correct code, both on same Firebase project |
| App runs offline | Expected! Works with localStorage fallback |
| Build fails | Run `npm install`, check Node version v16+ |

## 📝 License

[Your License Here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

**Questions?** Check `DEPLOYMENT_GUIDE.md` or create a GitHub Issue.
