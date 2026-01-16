# Task Plan: Fix Most Popular Menu Items Carousel Issue

## Issue Summary
The user cannot see the most popular menu items carousel below the top restaurants on the homepage.

## Root Cause Analysis

After analyzing the code, I've identified **three potential causes**:

### 1. Backend Query Issue
The `HomepageTopMenuItems` class in `Server/app.py` uses:
```python
db.func.count(order_menuitem_association.c.order_id)
```
This counts order IDs in the association table. However, there's a potential issue:
- When a menu item has NO orders, the LEFT JOIN returns a row with NULL order_id
- The `count(column)` counts non-NULL values, so it returns 0
- But all items get counted as having 0 orders, which could cause ordering issues

### 2. Empty Database / No Orders
If the database hasn't been seeded or orders don't exist:
- The query returns all menu items with count=0
- This might cause the carousel to not show (depending on frontend logic)

### 3. Frontend State Issue
The `fetchTopMenuItems` function doesn't handle errors or empty states properly:
- No loading state for menu items
- No error handling
- If API returns [], the carousel might not display properly

## Solution Plan

### Step 1: Fix the Backend Query
Modify the query in `HomepageTopMenuItems` to:
- Use `db.func.count(db.distinct(Order.id))` to count actual orders
- Better handle the relationship between MenuItem, Order, and the association table

### Step 2: Update Frontend Error Handling
Add proper loading and error states for menu items fetch in Homepage.jsx

### Step 3: Test the Fix
- Ensure the backend query returns menu items sorted by order count
- Verify the frontend displays the carousel correctly

## Files to Modify
1. `Server/app.py` - Fix `HomepageTopMenuItems` query
2. `Frontend/src/pages/Homepage.jsx` - Add loading/error states

## Expected Outcome
The most popular menu items carousel should display below the top restaurants carousel with menu items sorted by order count.

