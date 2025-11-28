# Starting the Mobile App

## Quick Start

1. **Open PowerShell in the project root**

2. **Navigate to mobile-app folder:**
   ```powershell
   cd mobile-app
   ```

3. **Start Expo:**
   ```powershell
   npx expo start
   ```

   Or with tunnel mode (works better for phone connections):
   ```powershell
   npx expo start --tunnel
   ```

4. **You should see:**
   - A QR code in the terminal
   - A URL like `exp://...` or `http://...`
   - Options to press 'i' for iOS, 'a' for Android, 'w' for web

5. **Scan the QR code:**
   - **iOS**: Open Camera app and point at QR code
   - **Android**: Open Expo Go app → Tap "Scan QR Code"

## Alternative: Use the Script

Run from project root:
```powershell
.\start-mobile-app.ps1
```

## Troubleshooting

### No QR Code Appearing
- Make sure you're in the `mobile-app` directory
- Try: `npx expo start --tunnel`
- Check if port 8081 is available: `netstat -ano | findstr ":8081"`

### Can't Connect from Phone
- Make sure phone and computer are on same WiFi
- Try tunnel mode: `npx expo start --tunnel`
- Check Windows Firewall allows Expo

### Expo Not Found
- Make sure you ran `npm install` in the mobile-app folder
- Try: `npm install -g expo-cli`

## Port Information

- **Expo Dev Server**: Usually port 8081
- **Metro Bundler**: Port 8081
- **Expo DevTools**: Port 19000 (if available)

