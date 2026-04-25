# Google Maps Not Loading - Troubleshooting Guide

## Common Issues and Solutions

### 1. API Key Configuration

#### Check Your `.env` File
```bash
# File: .env (in project root)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBbhvPKWajYrvBj2yOQnlvrdn7DF32vj4k
```

**Important:** Make sure:
- No quotes around the API key
- No spaces before or after the equals sign
- File is named exactly `.env` (not `.env.txt`)
- File is in the project root directory

#### Restart Dev Server
After adding/changing the API key:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Google Cloud Console Setup

#### Required API
Your Google Maps API key must have the **Maps JavaScript API** enabled:

1. Go to: https://console.cloud.google.com/google/maps-apis
2. Select your project
3. Click "Enable APIs and Services"
4. Search for "Maps JavaScript API"
5. Click "Enable"

#### Billing Account (REQUIRED)
Google Maps now requires a billing account even for free tier usage:

1. Go to: https://console.cloud.google.com/billing
2. Link a billing account to your project
3. Free tier includes:
   - $200 credit per month
   - 28,000 map loads per month for free

**Note:** You won't be charged unless you exceed the free tier limits.

### 3. API Key Restrictions

#### Check Restrictions
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key
3. Check "Application restrictions"

#### Recommended Settings for Development
- **Application restrictions**: None (or HTTP referrers)
- **API restrictions**: Restrict key → Maps JavaScript API

#### For Production
Set HTTP referrer restrictions:
```
http://localhost:*/*
http://localhost:8081/*
https://yourdomain.com/*
```

### 4. Console Errors

Open browser DevTools (F12) and check for these common errors:

#### Error: "This API project is not authorized"
**Solution:** Enable billing on your Google Cloud project

#### Error: "RefererNotAllowedMapError"
**Solution:** Add your domain to API key restrictions

#### Error: "ApiNotActivatedMapError"
**Solution:** Enable Maps JavaScript API in Google Cloud Console

#### Error: "InvalidKeyMapError"
**Solution:** Check that your API key is correct

### 5. Network Issues

#### Check if Maps API is Accessible
Open DevTools → Network tab, look for:
```
https://maps.googleapis.com/maps/api/js?...
```

If this request fails:
- Check internet connection
- Check firewall/proxy settings
- Check if Google services are blocked in your region

### 6. Browser Cache

Clear browser cache and hard reload:
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

### 7. Environment Variable Not Loading

#### Verify Environment Variable
Add this temporarily to see if the key is loaded:
```typescript
// In GeoMap.tsx
console.log("API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
```

If it prints `undefined`:
1. Make sure `.env` file exists in project root
2. Restart dev server completely
3. Check that the variable name starts with `VITE_`

### 8. Map Container Issues

The map container must have explicit dimensions:

```tsx
<div style={{ width: "100%", height: "600px" }}>
  <Map ... />
</div>
```

Or using CSS:
```css
.map-container {
  width: 100%;
  height: 100vh;
}
```

## Step-by-Step Checklist

- [ ] API key is in `.env` file
- [ ] Dev server was restarted after adding API key
- [ ] Maps JavaScript API is enabled in Google Cloud
- [ ] Billing account is linked to the project
- [ ] API key has no restrictive limitations (for testing)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API requests
- [ ] Map container has explicit height/width

## Quick Test

To verify your API key works, try this simple HTML in a browser:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Map Test</title>
  <style>
    #map { height: 400px; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    function initMap() {
      new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5
      });
    }
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
</body>
</html>
```

Replace `YOUR_API_KEY` with your actual key. If this doesn't work, the issue is with your Google Cloud setup, not the React app.

## Still Not Working?

### Check Google Maps Platform Status
Visit: https://status.cloud.google.com/

### Verify API Key in Browser
Open this URL in your browser (replace YOUR_KEY):
```
https://maps.googleapis.com/maps/api/js?key=YOUR_KEY
```

You should see JavaScript code, not an error message.

### Create a New API Key
Sometimes keys get corrupted. Try creating a fresh one:
1. Go to Google Cloud Console
2. APIs & Services → Credentials
3. Create Credentials → API Key
4. Copy the new key to your `.env` file
5. Restart dev server

## Contact Support

If you've tried everything:
1. Check [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
2. Visit [Stack Overflow - google-maps tag](https://stackoverflow.com/questions/tagged/google-maps)
3. Check [Google Maps Platform Support](https://developers.google.com/maps/support)

## Important Notes

- **Free Tier Limits**: 28,000 map loads/month (free)
- **Billing Required**: Yes, even for free tier
- **Credit Card**: Required to enable billing
- **Charges**: Only if you exceed free tier
- **Development**: No charges for normal development usage
