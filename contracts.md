# Average2Epic - Frontend & Backend Integration Contracts

## API Contracts

### Video Management APIs

#### 1. GET /api/videos
**Purpose**: Fetch all videos with optional filtering and pagination
**Request Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Videos per page (default: 9)
- `tag` (optional): Filter by tag

**Response**:
```json
{
  "videos": [
    {
      "id": "string",
      "title": "string",
      "youtubeId": "string",
      "embedUrl": "string",
      "day": "number",
      "date": "string (YYYY-MM-DD)",
      "reflection": "string",
      "tags": ["string"],
      "excerpt": "string",
      "createdAt": "timestamp"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalVideos": "number",
    "hasNext": "boolean",
    "hasPrev": "boolean"
  }
}
```

#### 2. GET /api/videos/:id
**Purpose**: Fetch single video by ID
**Response**: Single video object (same structure as above)

#### 3. POST /api/videos (Protected - Admin Only)
**Purpose**: Create new video entry
**Request Body**:
```json
{
  "title": "string",
  "youtubeId": "string",
  "embedUrl": "string",
  "day": "number",
  "date": "string",
  "reflection": "string",
  "tags": ["string"]
}
```
**Response**: Created video object with generated ID

#### 4. DELETE /api/videos/:id (Protected - Admin Only)
**Purpose**: Delete video by ID
**Response**: Success confirmation

### Contact Form API

#### 5. POST /api/contact
**Purpose**: Submit contact form
**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "area": "string",
  "message": "string"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Message received successfully"
}
```

### Admin Authentication APIs

#### 6. POST /api/admin/login
**Purpose**: Admin login
**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "success": true,
  "token": "JWT token",
  "user": {
    "username": "string"
  }
}
```

#### 7. POST /api/admin/verify
**Purpose**: Verify JWT token
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "valid": true,
  "user": {
    "username": "string"
  }
}
```

---

## Mocked Data in mock.js

### Current Mock Data:
1. **mockVideos**: 10 sample video entries (Day 1-100)
2. **mockAdmin**: Username/password for admin panel
3. **mockAbout**: About page content

### What Will Be Replaced:

#### Frontend Changes Required:
1. **Videos.js**:
   - Replace `mockVideos` import with API call to `/api/videos`
   - Implement real pagination using API response
   - Add loading states and error handling

2. **VideoDetail.js**:
   - Replace `mockVideos.find()` with API call to `/api/videos/:id`
   - Add loading state and 404 handling

3. **AdminDashboard.js**:
   - Replace localStorage auth check with JWT verification API call
   - Replace local state video management with API calls
   - POST to `/api/videos` when adding new video
   - DELETE to `/api/videos/:id` when removing video
   - GET from `/api/videos` to load current videos

4. **AdminLogin.js**:
   - Replace `mockAdmin` comparison with POST to `/api/admin/login`
   - Store JWT token in localStorage (not just 'true')
   - Implement proper token-based authentication

5. **Connect.js**:
   - Replace toast simulation with POST to `/api/contact`
   - Handle API response for success/error states

---

## Backend Implementation Plan

### MongoDB Collections:

#### 1. **videos** Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  youtubeId: String (required),
  embedUrl: String (required),
  day: Number (required, unique),
  date: Date (required),
  reflection: String (required),
  tags: [String],
  excerpt: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **contacts** Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  area: String,
  message: String (required),
  status: String (default: 'new'), // new, read, replied
  createdAt: Date
}
```

#### 3. **admins** Collection
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  password: String (required, hashed with bcrypt),
  createdAt: Date
}
```

### Backend Routes Structure:
```
/app/backend/
├── server.py (main FastAPI app)
├── models/
│   ├── video.py
│   ├── contact.py
│   └── admin.py
├── routes/
│   ├── videos.py
│   ├── contact.py
│   └── admin.py
└── utils/
    └── auth.py (JWT helper functions)
```

### Dependencies to Install:
- `pyjwt` (already in requirements.txt)
- `passlib[bcrypt]` (already in requirements.txt)
- `python-multipart` (for form data, already installed)

---

## Frontend & Backend Integration Steps

### Step 1: Backend Development
1. Create MongoDB models for videos, contacts, and admins
2. Implement video CRUD endpoints
3. Implement contact form endpoint
4. Implement admin authentication with JWT
5. Add middleware for JWT verification on protected routes
6. Create initial admin user in database

### Step 2: Frontend Integration
1. Create API service layer in `/app/frontend/src/services/api.js`
2. Replace all mock data calls with real API calls
3. Add loading states and error handling
4. Test each page individually
5. Ensure JWT token management works correctly

### Step 3: Testing
1. Test video catalog loading
2. Test video filtering and pagination
3. Test individual video page
4. Test contact form submission
5. Test admin login flow
6. Test adding new videos from admin panel
7. Test deleting videos from admin panel

---

## Key Notes for Seamless Integration

1. **Error Handling**: All API calls should have try-catch blocks with user-friendly error messages
2. **Loading States**: Show skeleton loaders while data is being fetched
3. **Authentication**: JWT token should be included in Authorization header for protected routes
4. **CORS**: Already configured in backend for all origins
5. **Environment Variables**: Backend URL already configured in REACT_APP_BACKEND_URL
6. **Date Formatting**: Ensure consistent date format between frontend and backend (ISO 8601)

---

## Completed (Frontend with Mock Data)
✅ Home page with hero section and three pillars
✅ Videos catalog page with filtering and pagination
✅ Individual video detail page
✅ About page with journey story
✅ Connect/contact form page
✅ Admin login page
✅ Admin dashboard with video management UI
✅ Navbar and Footer components
✅ Responsive design with beautiful gradients

## Next: Backend Implementation
- [ ] Create MongoDB models
- [ ] Implement all API endpoints
- [ ] Setup JWT authentication
- [ ] Seed initial admin user
- [ ] Replace frontend mock data with real API calls
- [ ] Test complete flow
