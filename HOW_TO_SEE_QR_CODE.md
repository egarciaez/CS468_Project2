# How to See the Expo QR Code and Connect Your Phone

## Method 1: Start Expo in a New Terminal Window (Recommended)

1. **Open a new PowerShell or Command Prompt window**
2. **Navigate to the project:**
   ```powershell
   cd C:\Users\eliza\OneDrive\studyCoach\mobile-app
   ```

3. **Start Expo:**
   ```powershell
   npm start
   ```
   or
   ```powershell
   npx expo start
   ```

4. **You should see:**
   - A QR code in the terminal
   - Connection URLs like:
     - `exp://192.168.1.128:19000`
     - Or a Metro bundler URL

## Method 2: Use the Existing Script

Run this in PowerShell from the project root:

```powershell
.\start-for-phone.ps1
```

This will:
- Start all Docker services
- Update your IP address automatically
- Give you connection instructions

Then manually start Expo:
```powershell
cd mobile-app
npm start
```

## Method 3: Get Connection Info Manually

If you can't see the QR code, you can manually construct the connection URL:

1. **Find your computer's IP address:**
   ```powershell
   ipconfig | findstr "IPv4"
   ```
   Look for an IP like `192.168.1.128` (not `127.0.0.1`)

2. **The Expo URL format is:**
   ```
   exp://YOUR_IP:19000
   ```
   Example: `exp://192.168.1.128:19000`

3. **Enter this in Expo Go app:**
   - Open Expo Go on your phone
   - Tap "Enter URL manually"
   - Enter: `exp://192.168.1.128:19000` (use your actual IP)

## Method 4: Check if Expo is Already Running

If Expo might already be running in the background:

1. **Check what's running on port 19000:**
   ```powershell
   netstat -ano | findstr :19000
   ```

2. **If something is running, you can:**
   - Open a browser to: `http://localhost:19000`
   - This should show Expo DevTools with a QR code

3. **Or restart Expo:**
   ```powershell
   # Stop any running Expo processes
   taskkill /F /IM node.exe
   
   # Then start fresh
   cd mobile-app
   npm start
   ```

## Quick Start Commands

**In a new terminal window, run these commands:**

```powershell
# Navigate to mobile app
cd C:\Users\eliza\OneDrive\studyCoach\mobile-app

# Start Expo (this will show QR code)
npx expo start --clear
```

The `--clear` flag clears the cache and ensures a fresh start.

## Troubleshooting

**If you still don't see a QR code:**

1. **Make sure Expo is installed:**
   ```powershell
   npx expo --version
   ```

2. **Try starting with tunnel mode:**
   ```powershell
   cd mobile-app
   npx expo start --tunnel
   ```
   This uses Expo's servers and should always show a QR code.

3. **Check firewall settings:**
   - Windows Firewall might be blocking port 19000
   - Allow Node.js through firewall if prompted

4. **Try web interface:**
   ```powershell
   cd mobile-app
   npx expo start --web
   ```
   Then open `http://localhost:19006` in your browser to see the QR code.

## Alternative: Use Expo DevTools in Browser

1. Start Expo:
   ```powershell
   cd mobile-app
   npm start
   ```

2. Open browser to: `http://localhost:19000`
   - This shows Expo DevTools
   - QR code should be visible here

3. Scan the QR code from the browser page

