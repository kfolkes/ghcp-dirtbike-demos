# Workflow 11: Cross-Team Work Item Sync

## Purpose
Synchronize work items across multiple Azure DevOps projects (DirtBike-Shop and Product-Agent), link dependencies between projects, sync status updates, and provide visibility into cross-project dependencies.

## Use Cases
- **Dependency Management**: Track dependencies between projects
- **Cross-Project Coordination**: Synchronize related work across teams
- **Status Visibility**: See status of dependent work items
- **Blocker Identification**: Identify cross-project blockers
- **Communication**: Automatic updates across teams
- **Impact Analysis**: Understand full scope of changes
- **Release Coordination**: Align releases across projects
- **Resource Planning**: Share resource needs across projects

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_wit_my_work_items` | Get all work items from DirtBike-Shop project |
| `mcp_azure-devops_search_workitem` | Search for related items in Product-Agent project |
| `mcp_azure-devops_wit_work_items_link` | Link dependencies between projects |
| `mcp_azure-devops_wit_update_work_items_batch` | Sync status updates across projects |

## Process Steps

### Step 1: Get Work Items from DirtBike-Shop
```
mcp_azure-devops_wit_my_work_items
Parameters:
  - project: "dirtbike-shop"
  - type: "assignedtome"
  - includeCompleted: false
  - top: 100
```
**Expected Output**: All active work items in DirtBike-Shop

### Step 2: Analyze for Cross-Project Dependencies
For each work item, look for:
- Keywords linking to Product-Agent items (e.g., "Blocked by PA#123")
- Related feature flags or services
- Shared dependencies
- Architecture changes affecting other projects

### Step 3: Search Product-Agent for Related Items
```
mcp_azure-devops_search_workitem
Parameters:
  - searchText: "[feature-name]|[component-name]|[api-endpoint]"
  - project: ["Product-Agent"]
  - workItemType: ["Feature", "Task", "Bug"]
  - top: 20
```
**Expected Output**: Related work items in Product-Agent project

### Step 4: Extract Linking Information
From each matched item pair:
- Source item (from DirtBike-Shop)
- Target item (from Product-Agent)
- Relationship type (depends on, blocks, affects, related to)
- Priority of link (critical, high, medium, low)

### Step 5: Link Items Between Projects
```
mcp_azure-devops_wit_work_items_link
Parameters:
  - project: "dirtbike-shop"
  - updates:
    [
      {
        id: <dirtbike-item-id>,
        linkToId: <product-agent-item-id>,
        type: "related|successor|predecessor|affects|dependent",
        comment: "Cross-project dependency: [Description]"
      }
    ]
```

### Step 6: Sync Status Updates
Monitor for status changes and propagate:
- If DirtBike item closes → Check if it unblocks related Product-Agent items
- If Product-Agent item closes → Check if it unblocks related DirtBike items
- Create comments linking status updates

### Step 7: Generate Cross-Project Report
Document all cross-project dependencies and status.

## Success Criteria
✅ All dependencies identified
✅ Items linked across projects
✅ Relationships documented
✅ Status synchronized
✅ Blockers identified
✅ Communication improved
✅ Release coordination enabled
✅ Clear dependency view

## Example Chat Command
```
@copilot
Find all work items in DirtBike-Shop, search for related items in 
Product-Agent project, link dependencies between them, sync status 
updates, and show cross-project dependency summary.
```

## Dependency Link Types
| Type | Meaning | Direction |
|------|---------|-----------|
| Related | General connection | Bidirectional |
| Successor | B must finish before A starts | A → B |
| Predecessor | A must finish before B starts | B → A |
| Affects | Changes in A impact B | A → B |
| Dependent | A depends on B completion | A → B |
| Blocks | A blocks B from proceeding | A → B |

## Cross-Project Work Item Report Template
```
## Cross-Project Work Item Sync Report - [Date]

### Executive Summary
- Total DirtBike-Shop Items: 48
- Total Product-Agent Items: 52
- Cross-Project Links: 12
- Blocked Items: 3
- Status Synced: 8

---

## Active Cross-Project Dependencies

### Critical Dependencies 🔴

#### DB#1234 ↔ PA#5678
**DirtBike Item**: [Implement new bike search feature]
**Product-Agent Item**: [Upgrade search API infrastructure]

**Status**:
- DirtBike: Active (50% complete)
- ProductAgent: Blocked (waiting for design)

**Type**: Successor (PA#5678 must complete before DB#1234)
**Priority**: Critical - blocking feature release
**Timeline**: PA needs to complete by [date]

**Actions**:
- Check PA#5678 progress
- Identify blockers in Product-Agent
- Plan coordination meeting

---

### High Dependencies 🟠

#### DB#1240 ↔ PA#5650
**DirtBike Item**: [Add payment gateway integration]
**Product-Agent Item**: [Payment API redesign]

**Status**:
- DirtBike: Ready to start (waiting for PA)
- ProductAgent: In progress (80% complete)

**Type**: Predecessor (PA#5650 should finish before DB#1240)
**Priority**: High - impacts both teams
**Timeline**: PA expected EOW, DirtBike starts next sprint

**Notes**:
- Teams aligned on API contract
- Review completed, no blockers
- Ready to proceed once PA delivers

---

### Medium Dependencies 🟡

#### DB#1245 → PA#5612
**Affects Relationship**:
- DirtBike change to bike catalog affects Product-Agent product feed

**Type**: Affects (bidirectional impact)
**Status**: Both teams aware, coordinating communication

---

## Dependencies by Status

### Not Started (Waiting)
- DB#1250 (waiting for PA#5670)
- DB#1251 (waiting for PA#5671)
- PA#5900 (waiting for DB#1260)

### In Progress (On Track)
- DB#1240 (waiting for PA#5650 - 80% complete)
- PA#5650 (no blockers, on schedule)

### At Risk
- DB#1234 (PA#5678 blocked, investigating)
- PA#5678 (design review delayed)

### Completed (Synced)
- DB#1200 ↔ PA#5500
- DB#1210 ↔ PA#5510
- DB#1220 ↔ PA#5520

---

## Blocking Items Analysis

### Currently Blocked Items (3)

#### 1. PA#5678 - Search API Infrastructure
**Blocked By**: Design review
**Impact**: Blocks DB#1234 (Bike Search Feature)
**Risk Level**: 🔴 Critical
**Action**: Escalate design review

**Timeline**:
- Review started: Nov 1
- Expected completion: Nov 15
- Current delay: 5 days

**Workaround**: None available
**Mitigation**: Expedite design review

---

#### 2. PA#5612 - Product Feed Update
**Blocked By**: Database schema changes
**Impact**: May affect DB#1245 (Bike Catalog)
**Risk Level**: 🟡 Medium

**Timeline**:
- Schema changes in progress
- DirtBike feature not blocked yet
- Monitor for dependencies

---

#### 3. DB#1250 - Advanced Filtering
**Blocked By**: PA#5670 (API endpoint completion)
**Impact**: Internal to DirtBike
**Risk Level**: 🟡 Medium

**Timeline**:
- PA#5670 due: [date]
- DB#1250 scheduled: [date]
- 1-week buffer available

---

## Status Sync Events (Last 7 Days)

| Event | Date | Details |
|-------|------|---------|
| PA#5600 → Closed | Nov 8 | Automatically unblocked DB#1199 |
| DB#1200 → Resolved | Nov 7 | Notified PA team, no dependencies |
| PA#5500 → Active | Nov 6 | Updated linked DB#1210 status |
| DB#1180 → Closed | Nov 5 | No dependent items affected |

---

## Coordination Calendar

### This Week
- [Nov 12] Design review for PA#5678
- [Nov 13] Cross-team sync meeting
- [Nov 14] DirtBike team available to start

### Next Week
- [Nov 19] PA#5650 target completion
- [Nov 20] DB#1240 sprint starts
- [Nov 21] Cross-project testing begins

### Next Month
- [Dec 1] Both projects' v2.0 release target

---

## Teams Involved

### DirtBike-Shop
- Project Lead: Alice Johnson
- Key Contributors: Bob Smith, Charlie Davis
- Dependencies Created: 6
- Dependencies Waiting On: 4

### Product-Agent
- Project Lead: Diana Martinez
- Key Contributors: Eve Wilson, Frank Lee
- Dependencies Created: 5
- Dependencies Waiting On: 3

---

## Recommendations

### Immediate Actions
1. ✅ Expedite PA#5678 design review
   - Schedule with stakeholders
   - Clear blockers (estimate: 2 days)

2. ✅ Confirm DB#1240 API contract
   - Schedule review: Nov 15
   - Expected outcome: approved

3. ✅ Escalate if PA#5650 at risk
   - Current: on track
   - Monitor daily

### Short Term (This Sprint)
1. Schedule weekly cross-team sync
2. Create shared roadmap view
3. Document API contracts clearly
4. Plan coordinated testing

### Long Term (Next Sprint)
1. Establish cross-project dependency process
2. Create shared calendar/timeline
3. Improve communication channels
4. Automate more status syncs

---

## Communication Plan

### Notification Triggers
- **Critical Blocker**: Immediate Slack + email
- **Status Change**: Daily report
- **New Dependency**: Added to weekly sync
- **Target Miss**: Escalation protocol

### Weekly Cross-Team Sync
- Time: Every Monday 2 PM
- Duration: 30 minutes
- Attendees: Both project leads
- Topics: Blockers, timeline changes, upcoming changes

### Documentation
- Shared cross-project spreadsheet
- Wiki with dependency map
- Updated during weekly sync

---

## Dependencies Matrix

| DirtBike Item | Product-Agent Item | Type | Status | Priority |
|---------------|-------------------|------|--------|----------|
| DB#1234 | PA#5678 | Successor | Blocked | Critical |
| DB#1240 | PA#5650 | Predecessor | On-Track | High |
| DB#1245 | PA#5612 | Affects | Monitoring | Medium |
| DB#1250 | PA#5670 | Dependent | Ready | Medium |
| DB#1260 | PA#5700 | Related | Planning | Low |

---

## Next Review
Scheduled for: [Date]
Last Review: [Date]
```

## Cross-Project Integration Points
- API contracts and versioning
- Database schema coordination
- Release timing and dependencies
- Testing coordination
- Deployment sequences
- Rollback procedures
- Communication protocols

## Dependency Types Deep Dive

### Successor
```
PA#5678 (API) must complete BEFORE DB#1234 (Feature)

Timeline:
PA starts: Nov 1
PA ends: Nov 15
DB starts: Nov 19 (4-day buffer)
DB ends: Dec 10
```

### Affects
```
DB#1245 (Catalog) affects PA#5612 (Feed)

Both can proceed:
- Coordinate API contract
- Sync data format
- Plan integration testing
- Communicate changes
```

### Blocked
```
PA#5678 is blocked by: Design review

Timeline:
Design started: Nov 1
Expected: Nov 15
Current: Nov 12 (3 days behind)
Risk: DB#1234 affected
```

## Automation Considerations
- Daily status sync from both projects
- Automatic linking based on keywords
- Notification on dependency status changes
- Alert on critical blockers
- Generate weekly reports
- Track MTTR for blockers

## Integration Points
- Shared project dashboard
- Cross-project reports
- Communication systems (Slack, Teams)
- Calendar sharing
- Roadmap alignment

## Notes
- Establish clear communication channel
- Regular cross-team meetings
- Clear escalation path
- Document decisions
- Share roadmaps
- Celebrate successful coordination
