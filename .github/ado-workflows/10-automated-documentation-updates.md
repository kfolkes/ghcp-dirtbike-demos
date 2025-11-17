# Workflow 10: Automated Documentation Updates

## Purpose
Keep documentation synchronized with code changes by automatically detecting documentation-related commits, updating wiki pages, linking PRs, and creating a summary of all documentation changes for team visibility.

## Use Cases
- **Documentation Sync**: Keep docs updated with code changes
- **Change Tracking**: Maintain history of documentation changes
- **Discoverability**: Find which PRs touched documentation
- **Completeness**: Identify undocumented code changes
- **Version Control**: Track docs across versions
- **Audit Trail**: Maintain permanent record of doc changes
- **Team Communication**: Notify team of documentation updates

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_repo_search_commits` | Find commits with "docs:" prefix |
| `mcp_azure-devops_wiki_list_pages` | Get list of wiki pages |
| `mcp_azure-devops_wiki_get_page_content` | Retrieve wiki page content |
| `mcp_azure-devops_wiki_create_or_update_page` | Update wiki pages |
| `mcp_azure-devops_repo_list_pull_requests_by_commits` | Link PRs to documentation changes |

## Process Steps

### Step 1: Search for Documentation Commits
```
mcp_azure-devops_repo_search_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - searchText: "docs:|documentation:|docs fix:|update docs"
  - fromDate: <24-hours-ago>
  - top: 50
```
**Expected Output**: Commits with documentation-related messages

### Step 2: Parse Commit Messages
From each documentation commit, extract:
- Commit SHA
- Author name and email
- Timestamp
- Full commit message
- Changed files
- Documentation area (e.g., "API docs", "Setup guide")

### Step 3: Extract Documentation Changes
From commit diff, identify:
- Files modified (paths like `docs/**`, `README.md`, etc.)
- New documentation pages
- Updated content areas
- Removed content

### Step 4: Get Related Wiki Pages
```
mcp_azure-devops_wiki_list_pages
Parameters:
  - wikiIdentifier: "<wiki-id>"
  - project: "dirtbike-shop"
```
**Expected Output**: List of all wiki pages

### Step 5: Get Current Wiki Content
For relevant pages, retrieve current content:
```
mcp_azure-devops_wiki_get_page_content
Parameters:
  - wikiIdentifier: "<wiki-id>"
  - project: "dirtbike-shop"
  - path: "<page-path>"
```
**Expected Output**: Current wiki page content

### Step 6: Find Related PRs
```
mcp_azure-devops_repo_list_pull_requests_by_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - commits: [<commit-shas>]
  - queryType: "Commit"
```
**Expected Output**: PRs that contain documentation commits

### Step 7: Update Wiki Pages
For each documentation change, update corresponding wiki page:
```
mcp_azure-devops_wiki_create_or_update_page
Parameters:
  - wikiIdentifier: "<wiki-id>"
  - project: "dirtbike-shop"
  - path: "<wiki-page-path>"
  - content: "[Updated content based on commit]"
```

### Step 8: Generate Documentation Summary
Create summary of all changes made.

### Step 9: Notify Team
Post update on documentation changes.

## Success Criteria
✅ Documentation commits detected
✅ Related wiki pages identified
✅ Wiki content updated with changes
✅ PRs linked to documentation
✅ Change summary generated
✅ Team notified of updates
✅ Version history maintained
✅ Easy to track documentation evolution

## Example Chat Command
```
@copilot
Find all recent commits in DirtBike-Shop with "docs:" prefix, identify 
related wiki pages, update documentation, link to related PRs, and 
create a summary of documentation changes.
```

## Documentation Commit Conventions
```
Commit Message Format:
docs: [area] - [description]

Examples:
docs: api - Added new endpoint documentation
docs: setup - Updated installation instructions
docs: faq - Added troubleshooting section
docs: deployment - Updated production checklist
docs: changelog - Added v2.0.0 release notes
docs: readme - Fixed typo in features section
```

## Documentation Areas
```
/API
  - Endpoint documentation
  - Request/response examples
  - Error codes
  - Pagination

/Setup
  - Installation steps
  - Configuration options
  - System requirements
  - Troubleshooting

/Features
  - Feature descriptions
  - How-to guides
  - Best practices
  - Examples

/Architecture
  - System design
  - Component overview
  - Data flow
  - Performance notes

/Contributing
  - Development setup
  - Code style guide
  - Testing procedures
  - PR process

/Deployment
  - Production checklist
  - Deployment steps
  - Rollback procedures
  - Monitoring

/FAQ
  - Common questions
  - Troubleshooting
  - Error solutions
  - Performance tips
```

## Documentation Update Report Template
```
## Documentation Updates Summary - [Date]

### Overview
- Documentation Commits: 5
- Pages Updated: 3
- Pages Created: 1
- Contributors: 2

---

## Updated Pages

### 1. API Documentation
**Path**: /API
**Last Updated**: [Date & Time]
**Updated By**: Alice Johnson
**Related PR**: [#1234](link)

**Changes**:
- Added POST /bikes/search endpoint documentation
- Updated request/response schema
- Added 3 new code examples
- Fixed typo in pagination section

**Commit**: [abc1234](link)
```
POST /bikes/search
Request:
{
  "query": "string",
  "filters": { ... }
}

Response:
{
  "results": [...],
  "total": 123,
  "page": 1
}
```
**Status**: ✅ Published

---

### 2. Setup Guide
**Path**: /Setup
**Last Updated**: [Date & Time]
**Updated By**: Bob Smith
**Related PR**: [#1235](link)

**Changes**:
- Updated Node.js version requirement (v18 → v20)
- Added Docker setup section
- Updated environment variables list
- Added Windows-specific troubleshooting

**Commit**: [def5678](link)

**Previous**:
- Node.js v18+

**Updated**:
- Node.js v20+ (LTS recommended)
- Docker with docker-compose

**Status**: ✅ Published

---

### 3. New Page: Contributing Guide
**Path**: /Contributing
**Created**: [Date]
**Created By**: Charlie Davis
**Related PR**: [#1240](link)

**Content**:
- Development environment setup
- Code style conventions
- Testing requirements
- PR review process
- Commit message format

**Sections**:
1. Getting Started
2. Development Workflow
3. Testing Your Changes
4. Submitting a PR
5. Code Review Process
6. Merge and Deploy

**Status**: ✅ Published

---

## Contributors This Period
- Alice Johnson: 2 updates (API docs)
- Bob Smith: 2 updates (Setup guide)
- Charlie Davis: 1 new page (Contributing)

## Related PRs
- [#1234] - API endpoint documentation
- [#1235] - Setup guide updates
- [#1240] - Contributing guide creation

## Documentation Statistics
```
Total Wiki Pages: 42
Updated This Period: 3
Percent Updated: 7%
New Pages: 1
Deleted Pages: 0

Content Growth:
- Previous Total: 42 KB
- Current Total: 45 KB
- Growth: +3 KB (+7%)
```

## Quality Checklist

### For Each Update ✅
- [ ] Matches code implementation
- [ ] Examples are accurate
- [ ] Links are not broken
- [ ] Formatting is consistent
- [ ] Spelling/grammar correct
- [ ] Version info accurate
- [ ] Screenshots current
- [ ] Table of contents updated

### General Wiki Health ✅
- [ ] No orphaned pages
- [ ] Navigation is clear
- [ ] Search works
- [ ] Mobile-friendly
- [ ] Loading performance OK
- [ ] Backup is current

## Documentation Maintenance

### Daily
- Monitor for new documentation commits
- Update wiki pages promptly
- Fix broken links

### Weekly
- Review all wiki pages
- Check for outdated information
- Validate code examples
- Update statistics

### Monthly
- Full documentation audit
- Review structure and organization
- Archive old versions
- Plan major updates

## Versioning Strategy
```
/Releases/v2.0.0
  - Setup guide for v2.0
  - API docs for v2.0
  - Migration guide from v1.x

/Releases/v1.x (Archive)
  - Previous documentation
  - For reference only
  - No longer updated
```

## Example Documentation Update
```
Commit Message:
docs: api - Added search endpoint documentation and examples

Files Changed:
- docs/API.md (modified)
- docs/examples/search.json (added)

Content Added:
```markdown
## Search Endpoint

### POST /bikes/search

Search for bikes with filters and pagination.

#### Request
```json
{
  "query": "string",
  "category": "motocross|enduro|youth",
  "priceRange": {
    "min": 0,
    "max": 10000
  },
  "limit": 10,
  "offset": 0
}
```

#### Response
```json
{
  "data": [...],
  "total": 125,
  "page": 1,
  "pageSize": 10
}
```

#### Examples

**Example 1: Search for Yamaha bikes**
```bash
curl -X POST http://localhost:3000/bikes/search \
  -H "Content-Type: application/json" \
  -d '{"query": "yamaha"}'
```

**Example 2: Filter by price range**
```bash
curl -X POST http://localhost:3000/bikes/search \
  -d '{
    "priceRange": {"min": 5000, "max": 8000}
  }'
```
```
```

## Integration with Code

### Auto-Linking
- Commits with "docs:" auto-link to PRs
- PRs link to wiki updates
- Wiki pages reference related commits
- Version numbers stay in sync

### Validation
- Code examples checked for accuracy
- API endpoints validated against implementation
- Configuration options verified

## Notification Template
```
## 📚 Documentation Updated

### What's New
- API docs: Added search endpoint
- Setup guide: Updated Node requirements
- New guide: Contributing guide

### Pages Updated
- [API Documentation](/API)
- [Setup Guide](/Setup)

### Related PRs
- [PR#1234](link) by Alice Johnson
- [PR#1235](link) by Bob Smith
- [PR#1240](link) by Charlie Davis

### View Changes
[Full documentation changes](wiki-link)

### Action Items
None - documentation is automatically synchronized
```

## Wiki Organization Best Practices
```
/Home
  - Overview
  - Quick start
  - Links to main sections

/API
  - Endpoints
  - Authentication
  - Error codes
  - Examples

/Setup
  - Installation
  - Configuration
  - Requirements

/Features
  - Feature list
  - How-tos
  - Best practices

/Architecture
  - System design
  - Components
  - Data flow

/Contributing
  - Dev setup
  - Code style
  - Testing

/Deployment
  - Checklist
  - Process
  - Rollback

/FAQ
  - Common questions
  - Troubleshooting

/Releases
  - v2.0.0
  - v1.x (Archive)

/Resources
  - External links
  - Tools
  - References
```

## Performance Considerations
- Wiki pages load in <2 seconds
- Search indexes updated daily
- Old versions archived (not in main search)
- CDN caching enabled for fast access

## Integration Points
- Link to code repositories
- Reference in build logs
- Include in release notes
- Share in team channels
- Embed in IDE tools

## Notes
- Documentation is part of development
- Update docs as code changes
- Use clear commit messages
- Maintain consistent style
- Version documentation with code
- Celebrate documentation contributions
- Keep examples current and working
