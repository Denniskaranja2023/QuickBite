# QuickBite - Pending Tasks Implementation Plan

## Completed Tasks ✅

### 1. Backend API Fixes (Server/app.py)

#### ✅ 1.1 Add `/api/signup` endpoint
- Created Signup resource class for user registration
- Handles customer and restaurant user types
- **Status**: Completed

#### ✅ 1.2 Add `/api/agent/<id>` endpoint
- Created endpoint to get delivery agent details by ID
- Used by ReviewAgentPage to display agent info
- **Status**: Completed

#### ✅ 1.3 Add `/api/customer/reviews` endpoint
- Created CustomerAllReviews resource to combine restaurant and delivery agent reviews
- Returns reviews with type, target_name, and target_id
- **Status**: Completed

### 2. Frontend Fixes

#### ✅ 2.1 Fix AgentDashboard.jsx API calls
- Uncommented and implemented the fetchDashboardData function
- Connected to `/api/agent/orders` and `/api/agent/reviews` endpoints
- Added average rating calculation
- Added "completed today" calculation
- **Status**: Completed

#### ✅ 2.2 Fix currency consistency (KSh vs $)
- AdminDashboard.jsx: Changed "$" to "KSh" ✅
- AdminPayments.jsx: Changed "$" to "KSh" ✅
- CustomerDashBoard.jsx: Changed "$" to "KSh" ✅
- CustomerOrdersPage.jsx: Changed "$" to "KSh" ✅
- CustomerPaymentsPage.jsx: Changed "$" to "KSh" ✅
- RestaurantMenuPage.jsx: Changed "$" to "KSh" ✅
- PlaceOrderPage.jsx: Changed "$" to "KSh" ✅
- OrderPaymentPage.jsx: Changed "$" to "KSh" ✅
- **Status**: Completed

#### ✅ 2.3 Fix CustomerReviewsPage endpoint
- Removed "Note: You'll need to create this endpoint" comment
- Updated UI to display new response format with type badges
- **Status**: Completed

---

## Summary

All pending tasks have been completed:

1. **Backend:**
   - Added Signup endpoint for customer and restaurant registration
   - Added Agent by ID endpoint for review pages
   - Added combined reviews endpoint that includes both restaurant and agent reviews

2. **Frontend:**
   - Fixed AgentDashboard to fetch real data from API
   - Fixed all currency displays to use KSh (Kenyan Shilling)
   - Updated CustomerReviewsPage to work with new API

3. **Testing:**
   - The server can be started with `cd Server && python app.py`
   - The frontend can be started with `cd Frontend && npm run dev`
   - Full end-to-end testing recommended

---

## Notes

- The project uses Kenyan Shilling (KSh) as the currency throughout
- All restaurant pages already used KSh correctly
- Admin and customer dashboard pages have been updated to use KSh
- Authentication system is fully functional with session management
- File upload system is working with the `/api/upload` endpoint

