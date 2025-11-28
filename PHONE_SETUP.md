# Setting Up Study Coach on Your Phone

## Prerequisites

1. **Docker Desktop** must be running on your computer
2. **Node.js and npm** installed
3. **Expo Go app** installed on your phone (iOS or Android)
4. **Your phone and computer** must be on the **same WiFi network**

## Step-by-Step Setup

### Step 1: Start Docker Desktop

1. Open Docker Desktop application on your computer
2. Wait for it to fully start (whale icon in system tray should be steady)
3. Verify it's running: Docker Desktop should show "Docker Desktop is running"

### Step 2: Start Backend Services

Open a terminal/PowerShell in the project directory and run:

```powershell
# Start Docker services
docker-compose up -d

# Pull the llama3 model (first time only, takes a few minutes)
docker exec study-coach-ollama ollama pull llama3

# Verify services are running
docker ps
```

You should see both `study-coach-backend` and `study-coach-ollama` containers running.

### Step 3: Verify Backend is Accessible

Test that the backend is running:

```powershell
# Test from your computer
curl http://localhost:8000/

# Or in PowerShell:
Invoke-WebRequest http://localhost:8000/
```

You should see: `{"message":"Study Coach API is running","status":"healthy"}`

### Step 4: Find Your Computer's IP Address

**Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually WiFi). It will look like `192.168.x.x`

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

### Step 5: Update Mobile App Configuration

The mobile app needs to know your computer's IP address. I've already updated it to `192.168.1.128`, but if your IP is different, update these files:

1. `mobile-app/services/api.js` - Change the `API_BASE_URL`
2. `mobile-app/App.js` - Change the `API_BASE_URL` (if it exists there)

**Important:** Replace `192.168.1.128` with YOUR actual IP address from Step 4.

### Step 6: Install Mobile App Dependencies

```powershell
cd mobile-app
npm install
```

This will install all required packages (Expo, React Native, etc.)

### Step 7: Start the Mobile App Development Server

```powershell
# Make sure you're in the mobile-app directory
cd mobile-app
npm start
```

This will:
- Start the Expo development server
- Show a QR code in the terminal
- Open a browser with Expo DevTools

### Step 8: Connect Your Phone

**Option A: Using Expo Go App (Recommended)**

1. **Install Expo Go** on your phone:
   - iOS: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR Code:**
   - **iOS**: Open Camera app and scan the QR code from terminal/browser
   - **Android**: Open Expo Go app and tap "Scan QR Code"

3. The app will load on your phone!

**Option B: Using Expo DevTools**

1. The `npm start` command should open a browser
2. Click "Run on iOS simulator" or "Run on Android device/emulator"
3. Or scan the QR code from the browser page

## Troubleshooting

### Backend Not Accessible from Phone

1. **Check Firewall:**
   - Windows: Allow port 8000 through Windows Firewall
   - Go to: Windows Defender Firewall → Advanced Settings → Inbound Rules
   - Create new rule for port 8000 (TCP)

2. **Verify IP Address:**
   - Make sure you're using the correct IP address
   - The IP should be from your WiFi adapter, not Ethernet or VPN

3. **Test from Phone's Browser:**
   - On your phone, open a browser
   - Go to: `http://YOUR_IP:8000/` (e.g., `http://192.168.1.128:8000/`)
   - You should see: `{"message":"Study Coach API is running","status":"healthy"}`

### Docker Issues

```powershell
# Check if containers are running
docker ps

# View logs if something is wrong
docker-compose logs backend
docker-compose logs ollama

# Restart services
docker-compose restart
```

### Mobile App Connection Issues

1. **Check Network:**
   - Phone and computer must be on the same WiFi
   - Disable VPN if active
   - Try turning WiFi off and on

2. **Check API URL:**
   - Verify the IP address in `mobile-app/services/api.js` is correct
   - Make sure it's `http://` not `https://`
   - Make sure port `:8000` is included

3. **Restart Expo:**
   ```powershell
   # Stop Expo (Ctrl+C)
   # Clear cache and restart
   cd mobile-app
   npm start -- --clear
   ```

### Camera/Microphone Permissions

When you first use the app:
- **Camera**: The app will ask for camera permission - tap "Allow"
- **Microphone**: The app will ask for microphone permission - tap "Allow"

If permissions are denied:
- iOS: Settings → Privacy → Camera/Microphone → Expo Go → Enable
- Android: Settings → Apps → Expo Go → Permissions → Enable Camera/Microphone

## Using the App

Once connected:

1. **Scan Notes:**
   - Tap "📷 Scan Notes"
   - Allow camera permission
   - Take a photo of your notes
   - Wait for text extraction and content generation

2. **Record Lecture:**
   - Tap "🎤 Record Lecture"
   - Allow microphone permission
   - Tap "Stop Recording" when done
   - Wait for transcription and content generation

3. **View Results:**
   - Flashcards, summaries, and questions will appear
   - Tap "🔊 Read Aloud" to hear questions

## Quick Reference

**Your Computer's IP:** `192.168.1.128` (update if different)
**Backend URL:** `http://192.168.1.128:8000`
**Expo Dev Server:** Usually runs on port 19000 or 19001

## Need Help?

- Check Docker logs: `docker-compose logs`
- Check Expo logs in the terminal
- Verify all services are running: `docker ps`
- Test backend directly: `curl http://localhost:8000/`

