# Workflow 5: Release Notes Generation

## Purpose
Automatically generate comprehensive release notes by aggregating commits, work items, and changes from recent builds. Publish to wiki for team reference and user communication.

## Use Cases
- **Release Documentation**: Create professional release notes automatically
- **Change Communication**: Inform stakeholders of new features and fixes
- **User Documentation**: Provide changelog for end users
- **Internal Communication**: Share release details with internal teams
- **Audit Trail**: Maintain permanent record of what changed in each release
- **Version History**: Build comprehensive product history
- **Feature Tracking**: Correlate features with release dates

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_pipelines_get_builds` | Get successful builds for production branch |
| `mcp_azure-devops_pipelines_get_build_changes` | Extract commits included in each build |
| `mcp_azure-devops_repo_search_commits` | Get detailed commit information |
| `mcp_azure-devops_wit_get_work_items_batch_by_ids` | Retrieve linked work items for commits |
| `mcp_azure-devops_wiki_create_or_update_page` | Publish release notes to wiki |

## Process Steps

### Step 1: Get Recent Production Builds
```
mcp_azure-devops_pipelines_get_builds
Parameters:
  - project: "dirtbike-shop"
  - branchName: "refs/heads/main"
  - statusFilter: 4  # Succeeded
  - resultFilter: 0  # Succeeded
  - queryOrder: "FinishTimeDescending"
  - top: 5
```
**Expected Output**: Recent successful production builds

### Step 2: Extract Commits from Builds
For each build:
```
mcp_azure-devops_pipelines_get_build_changes
Parameters:
  - project: "dirtbike-shop"
  - buildId: <build-id>
  - includeSourceChange: true
  - top: 100
```
**Expected Output**: List of commits included in the build

### Step 3: Get Detailed Commit Information
```
mcp_azure-devops_repo_search_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - fromDate: <previous-build-date>
  - toDate: <current-build-date>
  - top: 100
```
**Expected Output**: Detailed commits with messages, authors, dates

### Step 4: Extract Work Items from Commits
Parse commit messages for work item references (e.g., "AB#123") and collect IDs:
```
mcp_azure-devops_wit_get_work_items_batch_by_ids
Parameters:
  - project: "dirtbike-shop"
  - ids: [<work-item-id-1>, <work-item-id-2>, ...]
  - fields: ["System.Title", "System.WorkItemType", "System.State"]
```
**Expected Output**: Work item details including type, title, and status

### Step 5: Categorize Changes
Organize work items and commits by category:
- **Features**: New functionality (User Story, Feature)
- **Bug Fixes**: Issue resolutions (Bug)
- **Improvements**: Performance/UX enhancements (Improvement)
- **Breaking Changes**: Backward-incompatible changes
- **Deprecations**: Features being deprecated
- **Infrastructure**: Build/deployment changes (not user-facing)

### Step 6: Format Release Notes
Create structured release notes:
```
# Release v[version] - [Release Date]

## Summary
[Brief overview of release]

## Features
- [Feature 1] (#workitem)
- [Feature 2] (#workitem)

## Bug Fixes
- [Bug 1] - Description (#workitem)
- [Bug 2] - Description (#workitem)

## Improvements
- [Improvement 1]
- [Improvement 2]

## Breaking Changes
- [Breaking change 1] - Migration guide: [link]

## Deprecations
- [Deprecated feature] - Alternative: [link]

## Contributors
- Author 1
- Author 2

## Version Info
- Build Number: [#]
- Release Date: [date]
- Previous Release: [version]
- Commits: [count]
```

### Step 7: Generate Contributors List
From commits, extract unique authors:
```
Contributors: [Count] developers
- Name 1 ([commit count])
- Name 2 ([commit count])
- ...
```

### Step 8: Publish to Wiki
```
mcp_azure-devops_wiki_create_or_update_page
Parameters:
  - wikiIdentifier: "<wiki-id>"
  - project: "dirtbike-shop"
  - path: "/Releases/v[version]"
  - content: "[formatted release notes]"
```

### Step 9: Create/Update Release Index
Update main releases page with link to new release.

## Success Criteria
✅ Successful builds identified
✅ All commits extracted
✅ Work items linked
✅ Changes categorized
✅ Professional formatting applied
✅ Contributors credited
✅ Published to wiki
✅ Easily discoverable by teams

## Example Chat Command
```
@copilot
Get recent successful builds in DirtBike-Shop main branch, extract 
commits and linked work items, generate release notes organized by 
category (features, bugs, improvements), and publish to the wiki.
```

## Release Notes Format Template
```markdown
# Release v2.1.0 - December 1, 2024

## Overview
This release introduces new filtering capabilities, improves performance, 
and fixes several reported issues. Recommended upgrade for all users.

## What's New

### 🎉 Features
- **Advanced Price Filtering**: Filter bikes by custom price ranges (#1245)
- **Saved Favorites**: Users can now save favorite bikes for later (#1203)
- **Mobile Payment**: Support for mobile wallet payments (#1210)
- **Dark Mode**: New dark theme for better usability at night (#1189)

### 🐛 Bug Fixes
- Fixed cart not persisting after refresh (#1234)
- Corrected bike image loading on slow connections (#1241)
- Resolved category filter state loss on page reload (#1238)
- Fixed accessibility issue with star ratings (#1225)

### ⚡ Performance
- Reduced bundle size by 15% through code splitting (#1220)
- Improved search response time by 40% (#1215)
- Optimized image loading for faster page render (#1208)

### 📚 Documentation
- Updated API documentation for new endpoints
- Added migration guide for payment integrations
- Improved setup instructions

## ⚠️ Breaking Changes
- `Cart.getItems()` now returns async Promise (#1230)
  - **Action**: Update any code using this method
  - **Migration**: Use `await cart.getItems()` or `.then()`

## 🔄 Deprecations
- `useOldSearch()` hook deprecated, use `useSearch()` instead
  - **Timeline**: Will be removed in v3.0.0
  - **Migration**: See upgrade guide in documentation

## 👥 Contributors
34 commits by 8 developers:
- Alice Johnson (12 commits)
- Bob Smith (8 commits)
- Charlie Davis (6 commits)
- Diana Martinez (4 commits)
- And 4 others

## 📦 Installation
```bash
npm install @dirtbike-shop@2.1.0
# or
yarn upgrade @dirtbike-shop@2.1.0
```

## 📋 All Changes
For complete list of changes, see [full changelog](#)

## 🔗 Related
- Previous Release: [v2.0.0](/Releases/v2.0.0)
- Next Release: [v2.2.0 (Beta)](/Releases/v2.2.0-beta)
```

## Release Classification
| Type | Emoji | Example |
|------|-------|---------|
| Feature | 🎉 | New functionality |
| Bug Fix | 🐛 | Resolved issue |
| Performance | ⚡ | Optimization |
| Documentation | 📚 | Docs update |
| Breaking Change | ⚠️ | API change |
| Deprecation | 🔄 | Feature sunset |
| Security | 🔒 | Vulnerability fix |
| Infrastructure | 🔧 | Build/deploy change |

## Versioning Guidelines
- **Major** (v2.0.0): Breaking changes
- **Minor** (v1.5.0): New features, backward compatible
- **Patch** (v1.4.5): Bug fixes only

## Wiki Organization
```
/Releases
  /v2.1.0 (latest)
  /v2.0.0
  /v1.5.0
  /v1.4.0
  /Roadmap
  /Release Process
  /Changelog Archive
```

## Automation Considerations
- Generate after each successful production build
- Run on schedule or on-demand
- Include commit history for future reference
- Link to associated PRs and work items
- Add release metrics (commits, authors, lines changed)
- Track release size and scope
- Monitor time between releases

## Integration Points
- Announce releases on Slack/Teams
- Update product roadmap
- Notify customers of critical fixes
- Feed into release calendar
- Generate changelogs for different audiences
- Create tags in version control

## Notes
- Use consistent versioning scheme
- Include breaking changes prominently
- Highlight security fixes
- Provide clear migration paths
- Credit all contributors
- Keep professional tone
- Review for accuracy before publishing
