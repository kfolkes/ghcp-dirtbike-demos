# Azure DevOps Navigation Guide for DirtBike-Shop

## Project Overview

**Project Name:** DirtBike-Shop  
**Project ID:** `0b655cb5-a48f-46c3-acc7-943de45b3789`  
**Organization:** `gl-rcgdemos`  
**Description:** E-commerce React application for dirt bike sales  
**Process Template:** Basic  
**URL:** https://dev.azure.com/gl-rcgdemos/DirtBike-Shop

---

## Quick Links

- **Project Dashboard:** https://dev.azure.com/gl-rcgdemos/DirtBike-Shop
- **Boards:** https://dev.azure.com/gl-rcgdemos/DirtBike-Shop/_boards
- **Repos:** https://dev.azure.com/gl-rcgdemos/DirtBike-Shop/_git/DirtBike-Shop
- **Pipelines:** https://dev.azure.com/gl-rcgdemos/DirtBike-Shop/_build
- **Test Plans:** https://dev.azure.com/gl-rcgdemos/DirtBike-Shop/_testManagement

---

## Teams

### Default Team
- **Name:** DirtBike-Shop Team
- **Team ID:** `6579c13d-60ed-4d13-af4b-2f27f49f376c`
- **Description:** The default project team

---

## Repositories

### Main Repository
- **Name:** DirtBike-Shop
- **Repository ID:** `cd69b644-7d85-45e5-9652-ce5226ef3a3c`
- **Web URL:** https://dev.azure.com/gl-rcgdemos/DirtBike-Shop/_git/DirtBike-Shop
- **Default Branch:** main
- **Status:** Active

#### Repository Structure
```
dirtbike-shop/
├── .github/
│   ├── chatmodes/
│   ├── instructions/
│   ├── ado-navigation-guide.md (this file)
│   └── copilot-instructions.md
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BikeCard.tsx
│   │   ├── BikeGrid.tsx
│   │   ├── Cart.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── SearchBar.tsx
│   │   └── index.ts
│   ├── data/
│   │   └── bikes.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   └── useSearch.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Work Item Types & Backlogs

The project uses the **Basic** process template with the following work item hierarchy:

### 1. Epic (Highest Level)
- **Category ID:** `Microsoft.EpicCategory`
- **Color:** Orange (#FFE06C00)
- **Purpose:** Large features or initiatives that span multiple issues
- **States:** To Do → Doing → Done
- **Fields:** Title, Description, Assigned To, State, Priority, Effort

### 2. Issue (Mid Level)
- **Category ID:** `Microsoft.RequirementCategory`
- **Color:** Green (#FF339947)
- **Purpose:** User stories, features, or improvements
- **States:** To Do → Doing → Done
- **Fields:** Title, Description, Assigned To, State, Priority, Effort, Area Path, Iteration Path
- **Key Fields:**
  - `Microsoft.VSTS.Common.Priority` (1=High, 4=Low, default=2)
  - `Microsoft.VSTS.Scheduling.Effort` (story points or hours)

### 3. Task (Lowest Level)
- **Category ID:** `Microsoft.TaskCategory`
- **Color:** Brown (#FFA4880A)
- **Purpose:** Actionable work items that break down Issues
- **States:** To Do → Doing → Done
- **Parent:** Usually linked to an Issue

---

## Creating Work Items with Azure DevOps MCP

### Creating an Issue
```typescript
// Use: mcp_azure-devops_wit_create_work_item
{
  "project": "DirtBike-Shop",
  "workItemType": "Issue",
  "fields": [
    { "name": "System.Title", "value": "Your title here" },
    { "name": "System.Description", "value": "Detailed description" },
    { "name": "Microsoft.VSTS.Common.Priority", "value": "1" },
    { "name": "Microsoft.VSTS.Scheduling.Effort", "value": "5" }
  ]
}
```

### Creating an Epic
```typescript
{
  "project": "DirtBike-Shop",
  "workItemType": "Epic",
  "fields": [
    { "name": "System.Title", "value": "Epic: Enhanced Checkout Flow" },
    { "name": "System.Description", "value": "Comprehensive checkout improvements" }
  ]
}
```

### Creating Tasks Under an Issue
```typescript
// Use: mcp_azure-devops_wit_add_child_work_items
{
  "parentId": 123, // Issue ID
  "project": "DirtBike-Shop",
  "workItemType": "Task",
  "items": [
    {
      "title": "Task 1",
      "description": "Task details"
    }
  ]
}
```

---

## Common MCP Commands Reference

### Work Items
- **Create:** `mcp_azure-devops_wit_create_work_item`
- **Get:** `mcp_azure-devops_wit_get_work_item`
- **Update:** `mcp_azure-devops_wit_update_work_item`
- **List My Items:** `mcp_azure-devops_wit_my_work_items`
- **Add Children:** `mcp_azure-devops_wit_add_child_work_items`
- **Link Items:** `mcp_azure-devops_wit_work_items_link`
- **Add Comment:** `mcp_azure-devops_wit_add_work_item_comment`

### Repository Operations
- **List Repos:** `mcp_azure-devops_repo_list_repos_by_project`
- **List Branches:** `mcp_azure-devops_repo_list_branches_by_repo`
- **Search Commits:** `mcp_azure-devops_repo_search_commits`
- **Create Branch:** `mcp_azure-devops_repo_create_branch`

### Pull Requests
- **List PRs:** `mcp_azure-devops_repo_list_pull_requests_by_repo_or_project`
- **Get PR:** `mcp_azure-devops_repo_get_pull_request_by_id`
- **Create PR:** `mcp_azure-devops_repo_create_pull_request`
- **Update PR:** `mcp_azure-devops_repo_update_pull_request`
- **List Threads:** `mcp_azure-devops_repo_list_pull_request_threads`
- **Create Thread:** `mcp_azure-devops_repo_create_pull_request_thread`
- **Link Work Item:** `mcp_azure-devops_wit_link_work_item_to_pull_request`

### Pipelines
- **List Builds:** `mcp_azure-devops_pipelines_get_builds`
- **Get Build Status:** `mcp_azure-devops_pipelines_get_build_status`
- **Get Build Logs:** `mcp_azure-devops_pipelines_get_build_log`
- **Run Pipeline:** `mcp_azure-devops_pipelines_run_pipeline`

### Search
- **Search Code:** `mcp_azure-devops_search_code`
- **Search Work Items:** `mcp_azure-devops_search_workitem`
- **Search Wiki:** `mcp_azure-devops_search_wiki`

---

## Tagging Strategy

Use tags to organize and filter work items:

### Recommended Tags
- **Feature Areas:**
  - `checkout` - Checkout flow improvements
  - `cart` - Shopping cart functionality
  - `payment` - Payment processing
  - `ui-ux` - User interface and experience
  - `performance` - Performance optimizations
  - `accessibility` - A11y improvements
  - `testing` - Test coverage and automation

- **Technical:**
  - `frontend` - React/TypeScript work
  - `backend` - API/server work
  - `devops` - CI/CD and infrastructure
  - `bug` - Bug fixes
  - `tech-debt` - Technical debt

- **Priority:**
  - `critical` - Must have
  - `high-priority` - Important
  - `enhancement` - Nice to have

---

## State Workflow

All work item types follow the same state flow:

```
[New] → [To Do] → [Doing] → [Done]
              ↓       ↓
            [Removed/Closed]
```

### State Transitions
- **To Do:** Work is identified but not started
- **Doing:** Work is actively in progress
- **Done:** Work is complete and verified

---

## Priority System

Priority values for Issues and Tasks:

| Priority | Value | Use Case |
|----------|-------|----------|
| 1 | High | Critical features, blocking issues |
| 2 | Medium | Standard features (default) |
| 3 | Low | Nice to have |
| 4 | Very Low | Future consideration |

---

## Effort Estimation

Use the `Microsoft.VSTS.Scheduling.Effort` field:
- **Small:** 1-2 (hours or story points)
- **Medium:** 3-5
- **Large:** 8-13
- **Extra Large:** 21+

---

## Linking Work Items to Code

### Link Types
- **Branch:** Link work item to a feature branch
- **Commit:** Link to specific commits
- **Pull Request:** Link to PRs (use `mcp_azure-devops_wit_link_work_item_to_pull_request`)
- **Build:** Link to pipeline builds

### Best Practice
Always link work items to:
1. Feature branches (when created)
2. Pull requests (before merging)
3. Commits (use `#123` in commit messages to auto-link)

---

## Board Views

### Issues Board
Access: https://dev.azure.com/gl-rcgdemos/DirtBike-Shop/_boards/board/t/DirtBike-Shop%20Team/Issues

**Columns:**
- To Do
- Doing
- Done

### Tasks Board
Access: https://dev.azure.com/gl-rcgdemos/DirtBike-Shop/_boards/board/t/DirtBike-Shop%20Team/Taskboard

---

## Example Queries

### Get All Active Issues (By State)
```typescript
// ✅ WORKING METHOD - Use state filter
mcp_azure-devops_search_workitem({
  project: ["DirtBike-Shop"],
  searchText: "state:To Do",
  top: 100
})
```

### Get All Active Issues (Assigned to You)
```typescript
mcp_azure-devops_wit_my_work_items({
  project: "DirtBike-Shop",
  type: "assignedtome",
  includeCompleted: false
})
```

### Search for Feature-Related Items
```typescript
mcp_azure-devops_search_workitem({
  project: ["DirtBike-Shop"],
  searchText: "checkout",
  top: 50
})
```

### List Recent Commits
```typescript
mcp_azure-devops_repo_search_commits({
  project: "DirtBike-Shop",
  repository: "DirtBike-Shop",
  top: 10
})
```

---

## Current Backlog (30 Issues - All in "To Do")

### 🛒 E-Commerce Core Features
- **#28** Implement multi-step checkout flow
- **#29** Integrate Stripe payment gateway
- **#31** Create order confirmation page
- **#32** Implement cart persistence with localStorage
- **#33** Add quantity controls in cart
- **#39** Add promotional code/coupon system

### 📦 Product Management
- **#34** Create product detail page
- **#35** Implement product filtering by price range
- **#36** Add favorites/wishlist feature
- **#37** Implement product sorting options
- **#38** Create inventory management page

### 👤 User & Auth
- **#30** Add user authentication system
- **#57** Create admin dashboard

### 📱 UI/UX & Design
- **#43** Improve mobile responsiveness for tablet devices
- **#49** Add loading states and skeleton screens
- **#45** Add accessibility improvements (WCAG 2.1 AA)

### 🐛 Bug Fixes (Priority!)
- **#40** Fix: Search not clearing properly when page reloads
- **#41** Fix: Cart total calculation incorrect with multiple items
- **#42** Fix: Category filters not resetting properly

### ⚙️ Code Quality & Performance
- **#44** Optimize bundle size and performance
- **#46** Create comprehensive unit test suite
- **#47** Set up E2E testing with Playwright
- **#48** Implement error boundary for crash handling
- **#51** Refactor: Extract cart logic to separate context
- **#52** Refactor: Consolidate duplicate filter logic
- **#53** Update dependencies to latest versions
- **#54** Add error tracking with Sentry

### 📖 Documentation & DevOps
- **#50** Create comprehensive API documentation
- **#55** Implement analytics tracking
- **#56** Add email notification system

---

1. **Always specify the project:** Use `"DirtBike-Shop"` as the project parameter
2. **Use Issue for features:** Create Issues for user stories and features, not Tasks
3. **Link everything:** Connect work items to branches, PRs, and commits
4. **Tag appropriately:** Use consistent tags for filtering and organization
5. **Set priority:** Always set `Microsoft.VSTS.Common.Priority` (default is 2)
6. **Estimate effort:** Use `Microsoft.VSTS.Scheduling.Effort` for planning
7. **Use HTML for rich descriptions:** The Description field supports HTML formatting
8. **Parent-child relationships:** Epics → Issues → Tasks
9. **Repository ID required for branches:** Use `cd69b644-7d85-45e5-9652-ce5226ef3a3c`
10. **Project ID for artifacts:** Use `0b655cb5-a48f-46c3-acc7-943de45b3789`

---

## Current Application Features

The DirtBike-Shop React app currently includes:
- ✅ Product catalog with 9 dirt bikes
- ✅ Search functionality
- ✅ Category filters (Motocross, Enduro, Youth)
- ✅ Shopping cart with add/remove
- ✅ Responsive design
- ✅ Star ratings display
- ❌ **Checkout flow (needs improvement)**
- ❌ Payment integration
- ❌ User authentication
- ❌ Order management
- ❌ Inventory tracking

---

## Suggested Epic Structure for Checkout Improvements

```
Epic: Enhanced E-Commerce Experience
├── Issue: Multi-Step Checkout Flow
│   ├── Task: Design checkout UI/UX
│   ├── Task: Implement shipping information form
│   ├── Task: Implement payment method selection
│   ├── Task: Add order review step
│   └── Task: Create checkout progress indicator
├── Issue: Payment Gateway Integration
│   ├── Task: Research payment providers
│   ├── Task: Integrate Stripe/PayPal
│   ├── Task: Handle payment validation
│   └── Task: Implement payment error handling
├── Issue: Order Confirmation & Receipt
│   ├── Task: Design confirmation page
│   ├── Task: Generate order receipts
│   ├── Task: Send confirmation emails
│   └── Task: Order tracking page
└── Issue: Cart Persistence & Management
    ├── Task: Implement localStorage for cart
    ├── Task: Add cart quantity controls
    ├── Task: Cart validation and error handling
    └── Task: Apply discount codes
```

---

## Integration with Git Workflow

### Branch Naming Convention
```
feature/{issue-id}-short-description
bugfix/{issue-id}-short-description
hotfix/{issue-id}-short-description
```

Example: `feature/123-multi-step-checkout`

### Commit Message Format
```
#{issue-id}: Brief description

Detailed explanation of changes
```

Example:
```
#123: Add shipping information form to checkout

- Created ShippingForm component with validation
- Integrated with checkout context
- Added unit tests
```

---

## Getting Started Checklist

- [x] Project created
- [x] Repository initialized
- [x] Code pushed to main branch
- [ ] Create Epic for checkout improvements
- [ ] Create Issues for major features
- [ ] Break down Issues into Tasks
- [ ] Set up CI/CD pipeline
- [ ] Configure branch policies
- [ ] Create pull request template
- [ ] Set up automated testing

---

*Last Updated: November 10, 2025*  
*Maintained by: GitHub Copilot for gl-rcgdemos*
