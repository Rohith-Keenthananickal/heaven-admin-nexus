# Geo Map Feature Setup Guide

## Overview
The Geo Map feature displays Area Training Partners (ATPs) and their assigned properties on an interactive Google Map with 5km coverage radius circles.

## Features Implemented

### 1. Interactive Map Display
- **Google Maps Integration**: Uses `@vis.gl/react-google-maps` for modern React integration
- **ATP Markers**: Blue map markers showing ATP locations
- **5km Radius Circles**: Semi-transparent blue circles (5000m radius) showing ATP coverage areas
- **Property Markers**: Green house-shaped markers for properties assigned to each ATP
- **Info Windows**: Click on ATP markers to see detailed information

### 2. Statistics Dashboard
Four stat cards showing:
- **Total ATPs**: Count of active area coordinators
- **Total Properties**: Sum of all assigned properties
- **Coverage Radius**: Fixed 5km per ATP zone
- **Avg Properties**: Average properties per ATP

### 3. Data Management
- **API Endpoint**: `/api/v1/users/geo-map`
- **Payload**: `{ limit: 500, active_only: true }`
- **Refresh Button**: Reload data on demand
- **Error Handling**: Graceful error states with retry options

### 4. UI/UX Features
- **Responsive Layout**: Adapts to different screen sizes
- **Loading States**: Animated loading indicators
- **Interactive Markers**: Click to view details
- **Smooth Transitions**: Map panning and zooming
- **Custom Icons**: Color-coded markers for ATPs (blue) and properties (green)

## Installation Steps

### 1. Install Dependencies
The required package has been installed:
```bash
npm install "@vis.gl/react-google-maps"
```

### 2. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** (optional, for future enhancements)
4. Create credentials → API Key
5. (Optional but recommended) Restrict the API key:
   - Set HTTP referrers (your domain)
   - Restrict to Maps JavaScript API

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

Or use the `.env.example` file as a template:
```bash
cp .env.example .env
# Then edit .env with your actual API key
```

### 4. Restart Development Server
After adding the API key, restart your dev server:
```bash
npm run dev
```

## File Structure

```
src/modules/atp/
├── pages/
│   └── GeoMap.tsx              # Main Geo Map component
├── models/
│   └── atp.models.ts           # TypeScript interfaces (updated)
├── services/
│   └── atp.service.tsx         # API service (updated)
└── index.ts                    # Module exports (updated)

src/
├── App.tsx                     # Route added
└── modules/shared/components/
    └── AppSidebar.tsx          # Navigation link added

.env.example                    # Environment variable template
```

## API Integration

### Request
```typescript
POST /api/v1/users/geo-map
{
  "limit": 500,
  "active_only": true
}
```

### Response
```typescript
{
  "status": "success",
  "data": [
    {
      "id": 3,
      "full_name": "Rajesh Kumar",
      "email": "coordinator0@example.com",
      "phone_number": "+919876543215",
      "profile_image": "https://example.com/profile.jpg",
      "atp_uuid": "ATP-00003",
      "latitude": 19.076,
      "longitude": 72.8777,
      "district": "Mumbai Central",
      "panchayat": "Mumbai Central Ward",
      "address_line1": "456 Business Park",
      "address_line2": "Floor 3, Suite 301",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postal_code": "400001",
      "properties": [
        {
          "id": 61,
          "property_name": "Green Valley Homestay",
          "user_id": 48,
          "latitude": 8.4,
          "longitude": 76.9784,
          "address": "Beach View Homestay, Kovalam Beach Road..."
        }
      ]
    }
  ],
  "message": "ATP geo map data retrieved successfully"
}
```

## Usage

1. **Navigate to Geo Map**
   - Click on "ATP" in the sidebar
   - Select "Geo Map" from the submenu
   - Or navigate directly to `/geo-map`

2. **View Map**
   - Map loads centered on first ATP location
   - Blue circles show 5km coverage radius
   - Blue markers indicate ATP locations
   - Green markers show assigned properties

3. **Interact with Markers**
   - Click any ATP marker to view details
   - Info window shows:
     - ATP name and photo
     - ATP UUID
     - Location (city, state)
     - Number of assigned properties
     - List of property names

4. **Refresh Data**
   - Click the "Refresh" button in the header
   - Map automatically updates with latest data

## Customization Options

### Change Radius Size
Edit `RADIUS_METERS` in `GeoMap.tsx`:
```typescript
const RADIUS_METERS = 5000 // Change to desired radius in meters
```

### Change Circle Color
Edit the `Circle` component in `GeoMap.tsx`:
```typescript
<Circle
  strokeColor="#3b82f6"  // Border color (blue)
  fillColor="#3b82f6"    // Fill color (blue)
  fillOpacity={0.15}     // Transparency
  strokeWeight={2}        // Border width
/>
```

### Change Marker Colors
Edit marker icons in `GeoMap.tsx`:
- ATP markers: `fillColor: "#3b82f6"` (blue)
- Property markers: `fillColor: "#10b981"` (green)

### Change Default Map Center
Edit `DEFAULT_CENTER` in `GeoMap.tsx`:
```typescript
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 } // India center
```

## Troubleshooting

### "Google Maps API Key Missing" Error
- Ensure `.env` file exists in project root
- Verify the variable name is exactly `VITE_GOOGLE_MAPS_API_KEY`
- Restart the dev server after adding the key

### Map Not Loading
- Check browser console for API errors
- Verify API key is valid and Maps JavaScript API is enabled
- Check if API key restrictions are properly configured

### Markers Not Showing
- Verify API response contains valid latitude/longitude values
- Check browser console for errors
- Ensure data structure matches expected interfaces

### Properties Not Displaying
- Check if properties array exists in ATP data
- Verify property objects have valid latitude/longitude
- Inspect network tab to see actual API response

## Browser Compatibility
- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Responsive and touch-friendly

## Performance Notes
- Limit: 500 ATPs (configurable)
- Map renders efficiently with Google's clustering (if needed for large datasets)
- Info windows load on-demand to reduce memory usage
- Markers are vectorized SVG for crisp display at any zoom level

## Future Enhancements
- [ ] Filter by city/state
- [ ] Search for specific ATP
- [ ] Heatmap view for property density
- [ ] Draw custom coverage areas
- [ ] Export map as image
- [ ] Clustering for large datasets
- [ ] Show ATP routes/territories
- [ ] Integration with property details page

## Support
For issues or questions, contact the development team or refer to:
- [Google Maps Platform Documentation](https://developers.google.com/maps)
- [@vis.gl/react-google-maps Documentation](https://visgl.github.io/react-google-maps/)
