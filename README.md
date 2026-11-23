# 🐾 Pixel Paws // Save File 01

A cozy, retro-game-styled habit and interval routine tracker built with **React Native**, **Expo Router**, and **SQLite**. Designed with a cute pastel cat aesthetic to help you turn daily routines and periodic tasks into fun quests!

---

## ✨ Features

* **🧶 Interval Renewals:** Track periodic tasks (like washing bed sheets or changing filters) with custom frequency days and auto-calculated due dates.
* **🐟 Daily Habits & Routines:** Manage daily quests, check off step-by-step checklists, and build up streak counters (🔥).
* **✏️ Full CRUD Operations:** Create, view details, edit titles/schedules, and delete your quests effortlessly.
* **⚙️ Retro Settings & Localization:** Switch between English and Myanmar (မြန်မာ) languages, toggle Light/Dark display modes, and test local alarm notifications.
* **💾 Local SQLite Database:** Fast, reliable offline data persistence stored securely on your device.

---

## 📱 Tech Stack

* **Framework:** React Native / Expo
* **Routing:** Expo Router (File-based routing)
* **Database:** Expo SQLite (`expo-sqlite`)
* **Notifications:** Expo Notifications (`expo-notifications`)
* **Styling:** Custom Retro Pastel Cat Theme (`#FFF5F7` soft pink background, pastel bubblegum pink & sky blue accents)

---

## 📂 Project Structure

```text
HabitRenewalTracker/
├── assets/                 # App icons, splash screens, and retro assets
├── src/
│   ├── app/                # File-based routing screens
│   │   ├── _layout.tsx     # Navigation stack configuration
│   │   ├── index.tsx       # Main Dashboard (Cat Quests)
│   │   ├── create.tsx      # Add New Quest / Habit screen
│   │   ├── edit.tsx        # Edit existing Quest / Habit screen
│   │   ├── habit-detail.tsx# Daily Habit step-by-step checklist
│   │   └── setting.tsx     # System Settings (Language, Theme, Notifications)
│   ├── components/         # Reusable UI components
│   ├── constants/          # RetroTheme colors, typography, and translations
│   ├── database/           # SQLite initialization and CRUD queries
│   ├── hooks/              # Custom React hooks
│   └── services/           # Notification scheduling helpers
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration (APK preview)
└── package.json            # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** and **npm** installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/HabitRenewalTracker.git
cd HabitRenewalTracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the App
Start the development server using Expo:
```bash
npx expo start
```
* Scan the QR code using the **Expo Go** app on your Android/iOS device, or press `a` to open in an Android Emulator.

---

## 📦 Building an Android APK

To compile and install a standalone `.apk` file directly onto your Android phone using **EAS Build**:

1. Install the EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Run the Android build command (configured in `eas.json` for APK output):
   ```bash
   eas build -p android --profile preview
   ```
4. Once complete, scan the QR code or open the download link on your phone to install the APK.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.