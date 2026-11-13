# AgroAI RESTful API Documentation

Base URL: `/api/v1`

All protected endpoints require an `Authorization` header containing the Supabase JWT token:
```text
Authorization: Bearer <supabase_access_token>
```

---

## Response Envelope Standard

### Success Response (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Crop recommendations generated successfully",
  "data": { ... },
  "error": null
}
```

### Error Response (HTTP 400 / 401 / 404 / 500)
```json
{
  "success": false,
  "message": "Validation failed. Please verify your submitted information.",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "landArea",
        "message": "Land area must be greater than 0"
      }
    ]
  }
}
```

---

## 1. System Endpoints

### Health Check
- **Route:** `GET /health`
- **Auth:** Public
- **Description:** Verifies service uptime and server status.

---

## 2. Farmer Profile & Farms

### Get Farmer Profile
- **Route:** `GET /profile`
- **Auth:** Bearer Token
- **Response:** Farmer profile details.

### Update Profile
- **Route:** `PUT /profile`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "fullName": "Ramesh Patil",
    "phone": "+919876543210",
    "state": "Karnataka",
    "district": "Mandya",
    "village": "Srirangapatna",
    "preferredLanguage": "kn",
    "farmingExperience": 12,
    "landArea": 4.5,
    "landUnit": "acre",
    "farmingType": "Integrated (INM)",
    "irrigationAvailable": true
  }
  ```

### List Farms
- **Route:** `GET /farms`
- **Auth:** Bearer Token

### Create Farm Parcel
- **Route:** `POST /farms`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "farmName": "North Canal Plot",
    "state": "Karnataka",
    "district": "Mandya",
    "soilType": "Red Soil / Red Sandy Loam",
    "soilPH": 6.8,
    "landArea": 2.5,
    "landUnit": "acre",
    "irrigationMethod": "Drip"
  }
  ```

### Delete Farm Parcel
- **Route:** `DELETE /farms/:id`
- **Auth:** Bearer Token

---

## 3. Crop Recommendations

### Generate Recommendations
- **Route:** `POST /crop/recommend`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "farmId": "optional-uuid",
    "state": "Karnataka",
    "district": "Mandya",
    "soilType": "Red Soil / Red Sandy Loam",
    "season": "Kharif",
    "landArea": 3,
    "landUnit": "acre",
    "irrigationAvailable": true,
    "soilPH": 6.7,
    "nitrogen": 210,
    "phosphorus": 18,
    "potassium": 190,
    "language": "en"
  }
  ```

### List Crop Recommendations
- **Route:** `GET /crop/recommendations?limit=20&offset=0`
- **Auth:** Bearer Token

### Get Recommendation By ID
- **Route:** `GET /crop/recommendations/:id`
- **Auth:** Bearer Token

### Delete Recommendation
- **Route:** `DELETE /crop/recommendations/:id`
- **Auth:** Bearer Token

---

## 4. Soil Health Analysis

### Analyze Soil
- **Route:** `POST /soil/analyze`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "soilType": "Black Soil / Regur (Vertisol)",
    "soilPH": 7.4,
    "nitrogen": 180,
    "phosphorus": 14,
    "potassium": 280,
    "organicCarbon": 0.48,
    "electricalConductivity": 0.65,
    "language": "en"
  }
  ```

### List Soil Reports
- **Route:** `GET /soil/reports`
- **Auth:** Bearer Token

### Delete Soil Report
- **Route:** `DELETE /soil/reports/:id`
- **Auth:** Bearer Token

---

## 5. Fertilizer Advisory

### Generate Fertilizer Advisory
- **Route:** `POST /fertilizer/recommend`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "crop": "Paddy (Rice)",
    "growthStage": "Tillering / Branching",
    "landArea": 2,
    "landUnit": "acre",
    "farmingMethod": "Integrated (INM)",
    "language": "en"
  }
  ```

### List Fertilizer Advisories
- **Route:** `GET /fertilizer/advisories`
- **Auth:** Bearer Token

---

## 6. Irrigation Advisory

### Generate Water Management Plan
- **Route:** `POST /irrigation/recommend`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "crop": "Sugarcane",
    "growthStage": "Vegetative",
    "soilType": "Clayey Soil",
    "landArea": 3,
    "irrigationMethod": "Drip",
    "waterAvailability": "Moderate",
    "temperature": 34,
    "language": "en"
  }
  ```

---

## 7. Disease & Pest Diagnosis

### Diagnostic Evaluation
- **Route:** `POST /disease/analyze`
- **Auth:** Bearer Token
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `crop` (text, required)
  - `affectedPart` (text, required: Leaves | Stem | Roots | Fruits / Pods | Flowers | Whole Plant)
  - `symptoms` (text, required)
  - `duration` (text, required)
  - `image` (file, optional JPEG/PNG/WebP max 5MB)
  - `language` (text, e.g. "en" or "kn")

---

## 8. Cultivation Calendar

### Generate Cultivation Schedule
- **Route:** `POST /calendar/generate`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "crop": "Finger Millet (Ragi)",
    "startDate": "2026-06-15",
    "farmingType": "Standard",
    "language": "en"
  }
  ```

### Update Activities / Mark Complete
- **Route:** `PUT /calendar/:id`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "activities": [
      {
        "stage": "Land Preparation",
        "dayFromStart": 0,
        "dayToStart": 7,
        "description": "Deep summer ploughing...",
        "importance": "high",
        "completed": true
      }
    ]
  }
  ```

---

## 9. AI Agriculture Assistant (Chat)

### Create Conversation
- **Route:** `POST /chat/conversations`
- **Body:** `{ "title": "Pest management inquiry", "language": "kn" }`

### Send Message
- **Route:** `POST /chat/conversations/:id/messages`
- **Body:** `{ "message": "ನನ್ನ ಟೊಮೆಟೊ ಗಿಡದಲ್ಲಿ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ, ಏನು ಮಾಡಬೇಕು?", "language": "kn" }`

---

## 10. Dashboard

- `GET /dashboard/summary`: Aggregates live database counts, profile readiness percentage, active schedules, and upcoming tasks.
- `GET /dashboard/recent-activities`: Returns aggregated latest 10 advisories across all modules.

