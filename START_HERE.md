
# 🚀 Quick Start Guide - Using Study Coach on Your Phone

## ✅ What I've Already Done For You

1. ✅ Updated mobile app to use your computer's IP: **192.168.1.128**
2. ✅ Created setup scripts and documentation

## 📱 Step-by-Step Instructions

### Step 1: Start Docker Desktop

1. **Open Docker Desktop** on your computer
2. **Wait** for it to fully start (the whale icon in system tray should be steady)
3. You'll know it's ready when you see "Docker Desktop is running"

### Step 2: Start Backend Services

Open PowerShell in this folder and run:

```powershell
# Start Docker services
docker-compose up -d

# Pull the llama3 model (first time only - takes a few minutes)
docker exec study-coach-ollama ollama pull llama3

# Verify it's working
Invoke-WebRequest http://localhost:8000/
```

You should see: `{"message":"Study Coach API is running","status":"healthy"}`

### Step 3: Install Mobile App Dependencies

Open a **new** PowerShell window and run:

```powershell
cd mobile-app
npm install
```

This will take a few minutes the first time.

### Step 4: Start the Mobile App

Still in the `mobile-app` folder, run:

```powershell
npm start
```

This will:
- Start the Expo development server
- Show a QR code in the terminal
- Open a browser with Expo DevTools

### Step 5: Connect Your Phone

**Important:** Make sure your phone is on the **same WiFi network** as your computer!

1. **Install Expo Go** on your phone:
   - **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
   - **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR Code:**
   - **iOS**: Open the Camera app and point it at the QR code
   - **Android**: Open Expo Go app → Tap "Scan QR Code" → Scan the code

3. The app will load on your phone! 🎉

### Step 6: Test It Works

**Test Backend from Phone:**
1. On your phone, open a web browser
2. Go to: `http://192.168.1.128:8000/`
3. You should see: `{"message":"Study Coach API is running","status":"healthy"}`

If this works, your phone can connect to the backend! ✅

**Test in the App:**
1. Open the Study Coach app on your phone
2. Tap "📷 Scan Notes" or "🎤 Record Lecture"
3. Allow camera/microphone permissions when asked

## 🔧 Troubleshooting

### "Cannot connect to backend"

**Check these:**

1. **Docker is running:**
   ```powershell
   docker ps
   ```
   Should show `study-coach-backend` and `study-coach-ollama`

2. **Backend is accessible:**
   ```powershell
   Invoke-WebRequest http://localhost:8000/
   ```

3. **Phone and computer on same WiFi:**
   - Check WiFi network name on both devices
   - Disable VPN if active

4. **Firewall blocking port 8000:**
   - Windows: Settings → Firewall → Allow an app → Find Python/FastAPI → Enable
   - Or temporarily disable firewall to test

5. **IP address is correct:**
   - Your IP should be: **192.168.1.128**
   - To check: Run `ipconfig` and look for "IPv4 Address" under WiFi

### "Docker Desktop is not running"

- Open Docker Desktop application
- Wait for it to fully start
- Try the commands again

### "Expo app won't load"

1. Make sure `npm start` is still running
2. Try stopping (Ctrl+C) and restarting: `npm start -- --clear`
3. Make sure phone and computer are on same WiFi
4. Try scanning QR code again

### "Camera/Microphone not working"

- **iOS**: Settings → Privacy → Camera/Microphone → Expo Go → Enable
- **Android**: Settings → Apps → Expo Go → Permissions → Enable

## 📋 Quick Reference

**Your Computer's IP:** `192.168.1.128`  
**Backend URL:** `http://192.168.1.128:8000`  
**Mobile App:** Running via Expo on port 19000/19001

## 🎯 What to Do Next

Once everything is running:

1. **Test Camera:** Tap "📷 Scan Notes" → Take photo of some text
2. **Test Microphone:** Tap "🎤 Record Lecture" → Record a short audio
3. **View Results:** See flashcards, summaries, and questions generated!

## 📚 More Help

- **Detailed setup:** See `PHONE_SETUP.md`
- **Project docs:** See `README.md`
- **Architecture:** See `DESIGN.md`

---

**Need help?** Check the troubleshooting section above or review the error messages in the terminal.

