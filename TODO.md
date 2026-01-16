# TODO: Centralize BaseUrl in API calls

## Goal:
Add centralized BaseUrl to all fetch calls for deployed backend readiness. Create config.js with BaseUrl and update all fetch calls across project to use the centralized configuration.

## Progress:

### Files Created:
- [x] Frontend/src/config.js - Created with API_BASE_URL export

### Frontend Pages Updated:

#### Customer Pages:
- [x] Frontend/src/pages/customers/CustomerDashBoard.jsx - Updated 4 fetch calls
- [x] Frontend/src/pages/customers/RestaurantMenuPage.jsx - Updated 6 fetch calls
- [x] Frontend/src/pages/customers/PlaceOrderPage.jsx - Updated 5 fetch calls
- [x] Frontend/src/pages/customers/CustomerOrdersPage.jsx - Updated 2 fetch calls
- [x] Frontend/src/pages/customers/OrderPaymentPage.jsx - Updated 3 fetch calls
- [x] Frontend/src/pages/customers/CustomerPaymentsPage.jsx - Updated 1 fetch call
- [x] Frontend/src/pages/customers/CustomerReviewsPage.jsx - Updated 6 fetch calls
- [x] Frontend/src/pages/customers/ReviewRestaurantPage.jsx - Updated 2 fetch calls
- [x] Frontend/src/pages/customers/ReviewAgentPage.jsx - Updated 2 fetch calls

#### Root Pages:
- [x] Frontend/src/App.jsx - Updated 4 fetch calls
- [x] Frontend/src/pages/Signup.jsx - Updated 2 fetch calls
- [x] Frontend/src/pages/Login.jsx - Updated 2 fetch calls
- [x] Frontend/src/pages/Homepage.jsx - Updated 4 fetch calls

#### Remaining Pages (Admin, Restaurant, Agent layouts and pages):
- [ ] Frontend/src/pages/admins/AdminLayout.jsx
- [ ] Frontend/src/pages/admins/AdminDashboard.jsx
- [ ] Frontend/src/pages/admins/AdminCustomers.jsx
- [ ] Frontend/src/pages/admins/AdminRestaurants.jsx
- [ ] Frontend/src/pages/admins/AdminPayments.jsx
- [ ] Frontend/src/pages/restaurants/ReastaurantLayout.jsx
- [ ] Frontend/src/pages/restaurants/RestaurantDashboard.jsx
- [ ] Frontend/src/pages/restaurants/RestaurantOrdersPage.jsx
- [ ] Frontend/src/pages/restaurants/RestaurantPaymentsPage.jsx
- [ ] Frontend/src/pages/restaurants/RestaurantAgents.jsx
- [ ] Frontend/src/pages/restaurants/RestaurantProfilePage.jsx
- [ ] Frontend/src/pages/restaurants/RestaurantReviewPage.jsx
- [ ] Frontend/src/pages/agents/AgentLayout.jsx
- [ ] Frontend/src/pages/agents/AgentDashboard.jsx
- [ ] Frontend/src/pages/agents/AgentReviewsPage.jsx

