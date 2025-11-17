# UI Testing Instructions for Dirt Bike Shop

## Overview
This document provides comprehensive testing instructions for the Dirt Bike Shop e-commerce application using Playwright MCP (Model Context Protocol).

## Application Features to Test

### 1. Page Load & Initial State
- **URL**: `http://localhost:5173`
- **Expected Elements**:
  - Header with "DIRT BIKE SHOP" title
  - Cart showing "0 items" initially
  - Search bar placeholder: "Search bikes by name or description..."
  - Category filters: All Bikes (selected), Motocross, Enduro, Youth
  - "Featured Bikes" heading
  - "9 bikes available" count
  - All 9 bike cards displayed
  - Empty cart sidebar with "Your cart is empty" message
  - Footer with About, Support, and Follow sections

### 2. Search Functionality
**Test Case 1: Search for specific bike brand**
```javascript
// Navigate to page
await page.goto('http://localhost:5173');

// Type in search box
await page.getByRole('searchbox', { name: 'Search bikes' }).fill('yamaha');

// Verify filtered results
// Expected: 1 bike (Yamaha YZ450F)
// Screenshot recommended
```

**Test Case 2: Search with partial match**
```javascript
// Search for '450'
await page.getByRole('searchbox', { name: 'Search bikes' }).fill('450');

// Expected: 2 bikes (Yamaha YZ450F, Suzuki RM-Z450)
```

**Test Case 3: Search with no results**
```javascript
// Search for non-existent term
await page.getByRole('searchbox', { name: 'Search bikes' }).fill('xyz123');

// Expected: 0 bikes available
```

**Test Case 4: Clear search**
```javascript
// Clear search box
await page.getByRole('searchbox', { name: 'Search bikes' }).fill('');

// Expected: All 9 bikes displayed
```

### 3. Category Filter Functionality
**Test Case 1: Filter by Motocross**
```javascript
await page.getByRole('button', { name: 'Motocross' }).click();

// Expected: Show motocross bikes only
// Verify "Motocross" button has pressed state
// Screenshot recommended
```

**Test Case 2: Filter by Enduro**
```javascript
await page.getByRole('button', { name: 'Enduro' }).click();

// Expected: 2 bikes (Beta RR 430, Honda CRF150F)
```

**Test Case 3: Filter by Youth**
```javascript
await page.getByRole('button', { name: 'Youth' }).click();

// Expected: 2 bikes (KTM 85 SX, Honda CRF150F)
```

**Test Case 4: Return to All Bikes**
```javascript
await page.getByRole('button', { name: 'All Bikes' }).click();

// Expected: All 9 bikes displayed
```

### 4. Add to Cart Functionality
**Test Case 1: Add single item**
```javascript
// Add Yamaha YZ450F to cart
await page.getByRole('button', { name: 'Add Yamaha YZ450F to cart' }).click();

// Verify:
// - Header shows "1 item"
// - Cart sidebar shows bike details
// - Price: $8,499
// - Qty: 1
// - Total: $8,499
// - Avg Rating: 4.9
// - Checkout button appears
```

**Test Case 2: Add multiple items**
```javascript
// Add first bike
await page.getByRole('button', { name: 'Add Yamaha YZ450F to cart' }).click();

// Add second bike
await page.getByRole('button', { name: 'Add Kawasaki KX250 to cart' }).click();

// Verify:
// - Header shows "2 items"
// - Cart shows both bikes
// - Total: $14,798 ($8,499 + $6,299)
// - Avg Rating updated correctly
```

**Test Case 3: Add same item multiple times**
```javascript
// Click same button twice
await page.getByRole('button', { name: 'Add Honda CRF250R to cart' }).click();
await page.getByRole('button', { name: 'Add Honda CRF250R to cart' }).click();

// Verify:
// - Cart shows Qty: 2
// - Item count increases correctly
```

### 5. Remove from Cart Functionality
**Test Case 1: Remove single item**
```javascript
// Add item first
await page.getByRole('button', { name: 'Add Yamaha YZ450F to cart' }).click();

// Remove item
await page.getByRole('button', { name: 'Remove Yamaha YZ450F from cart' }).click();

// Verify:
// - Cart is empty
// - "Your cart is empty" message appears
// - Header shows "0 items"
// - Checkout button disappears
```

**Test Case 2: Remove one of multiple items**
```javascript
// Add two different items
await page.getByRole('button', { name: 'Add Yamaha YZ450F to cart' }).click();
await page.getByRole('button', { name: 'Add Honda CRF250R to cart' }).click();

// Remove first item
await page.getByRole('button', { name: 'Remove Yamaha YZ450F from cart' }).click();

// Verify:
// - Header shows "1 item"
// - Only Honda CRF250R remains
// - Total updated to $5,799
```

### 6. Checkout Functionality
**Test Case 1: Checkout with items**
```javascript
// Add items to cart
await page.getByRole('button', { name: 'Add Yamaha YZ450F to cart' }).click();
await page.getByRole('button', { name: 'Add Beta RR 430 to cart' }).click();

// Click checkout
await page.getByRole('button', { name: 'Proceed to checkout' }).click();

// Verify:
// - Alert dialog appears
// - Message: "Proceeding to checkout with 2 items totaling $15,798"
```

### 7. Combined Filters (Search + Category)
**Test Case 1: Search within category**
```javascript
// Select Motocross category
await page.getByRole('button', { name: 'Motocross' }).click();

// Search for 'honda'
await page.getByRole('searchbox', { name: 'Search bikes' }).fill('honda');

// Expected: Filter results from motocross bikes only
```

### 8. Visual Regression Testing
**Screenshots to capture:**
1. Initial page load (full page)
2. Search results page
3. Each category filter active
4. Cart with 1 item
5. Cart with multiple items
6. Mobile viewport (resize to 375x667)
7. Tablet viewport (resize to 768x1024)
8. Desktop viewport (resize to 1920x1080)

### 9. Accessibility Testing
**Elements to verify:**
- All buttons have proper ARIA labels
- Search input has label (visible or sr-only)
- Cart status is marked with role="status" and aria-live="polite"
- Product cards have proper article structure
- Star ratings have aria-labels
- All interactive elements are keyboard accessible

### 10. Responsive Design Testing
```javascript
// Mobile
await page.setViewportSize({ width: 375, height: 667 });
await page.screenshot({ path: 'mobile-view.png' });

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });
await page.screenshot({ path: 'tablet-view.png' });

// Desktop
await page.setViewportSize({ width: 1920, height: 1080 });
await page.screenshot({ path: 'desktop-view.png' });
```

### 11. Performance Testing
**Console messages to monitor:**
- Vite connection messages
- No error messages should appear
- React DevTools suggestions (informational only)

**Network requests:**
- Verify all assets load successfully
- Check for 404 errors
- Monitor bundle sizes

### 12. Edge Cases to Test
1. **Long bike names**: Verify text truncation works
2. **Empty search results**: Verify graceful handling
3. **Rapid clicking**: Add to cart button multiple times quickly
4. **Back button**: After filtering, use browser back
5. **Refresh with items in cart**: Items should persist if using localStorage (currently they don't)

## Example Complete Test Suite

```javascript
// Complete test flow
async function testDirtBikeShop() {
  // 1. Navigate and verify initial state
  await page.goto('http://localhost:5173');
  await page.screenshot({ path: 'initial-load.png', fullPage: true });
  
  // 2. Test search
  await page.getByRole('searchbox', { name: 'Search bikes' }).fill('yamaha');
  await page.screenshot({ path: 'search-yamaha.png' });
  
  // 3. Add to cart
  await page.getByRole('button', { name: 'Add Yamaha YZ450F to cart' }).click();
  await page.screenshot({ path: 'cart-with-item.png' });
  
  // 4. Clear search and test category filter
  await page.getByRole('searchbox', { name: 'Search bikes' }).fill('');
  await page.getByRole('button', { name: 'Enduro' }).click();
  await page.screenshot({ path: 'enduro-filter.png' });
  
  // 5. Add another item
  await page.getByRole('button', { name: 'Add Beta RR 430 to cart' }).click();
  await page.screenshot({ path: 'cart-with-two-items.png' });
  
  // 6. Test checkout
  await page.getByRole('button', { name: 'Proceed to checkout' }).click();
  // Handle alert dialog
  
  // 7. Test remove from cart
  await page.getByRole('button', { name: 'Remove Yamaha YZ450F from cart' }).click();
  await page.screenshot({ path: 'after-remove.png' });
  
  // 8. Responsive testing
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'mobile-responsive.png', fullPage: true });
  
  console.log('All tests completed successfully!');
}
```

## Test Data Reference

### Bikes in Catalog
1. **Yamaha YZ450F** - $8,499 - 4.9★ - Motocross
2. **Kawasaki KX250** - $6,299 - 4.8★ - Motocross
3. **Honda CRF250R** - $5,799 - 4.7★ - Motocross
4. **Suzuki RM-Z450** - $7,999 - 4.9★ - Motocross
5. **KTM 85 SX** - $3,499 - 4.6★ - Youth
6. **Beta RR 430** - $7,299 - 4.8★ - Enduro
7. **Husqvarna FC 350** - $6,899 - 4.8★ - Motocross
8. **GasGas MC 125** - $4,999 - 4.7★ - Motocross
9. **Honda CRF150F** - $4,299 - 4.6★ - Enduro, Youth

### Expected Totals for Common Combinations
- Yamaha + Kawasaki = $14,798
- Yamaha + Beta = $15,798
- All Youth bikes = $7,798
- All Enduro bikes = $11,598

## Running Tests with Playwright MCP

### Using Copilot Chat:
1. "Navigate to http://localhost:5173 and take a screenshot"
2. "Search for 'honda' and verify the results"
3. "Add Yamaha YZ450F to cart and verify the cart total"
4. "Test all category filters and take screenshots"
5. "Run the complete test suite for the Dirt Bike Shop"

### Best Practices:
- Always take screenshots after major interactions
- Verify state changes after each action
- Test both happy paths and edge cases
- Check accessibility with browser snapshot tool
- Monitor console for errors
- Test on multiple viewport sizes

## Success Criteria
✅ All features work as expected
✅ No console errors
✅ Proper ARIA labels and accessibility
✅ Responsive design works on all viewports
✅ Cart calculations are accurate
✅ Search and filters work correctly
✅ Visual consistency across the application
