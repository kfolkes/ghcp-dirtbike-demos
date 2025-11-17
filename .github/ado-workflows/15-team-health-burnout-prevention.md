# Workflow 15: Team Health & Burnout Prevention

## Purpose
Monitor team health and workload distribution by analyzing work items, capacity, pull requests, and code reviews per team member to identify overloaded developers and recommend load rebalancing to prevent burnout.

## Use Cases
- **Workload Visibility**: See each person's actual workload
- **Overload Detection**: Identify at-risk team members early
- **Load Balancing**: Redistribute work appropriately
- **Capacity Planning**: Better understand team limits
- **Burnout Prevention**: Proactive health management
- **Team Morale**: Show concern for wellbeing
- **Resource Planning**: Inform hiring/staffing decisions
- **Fair Distribution**: Ensure equitable work allocation

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_wit_my_work_items` | Get work items for each member |
| `mcp_azure-devops_work_get_team_capacity` | Check current capacity |
| `mcp_azure-devops_repo_search_commits` | Count commits per person |
| `mcp_azure-devops_repo_list_pull_requests_by_repo_or_project` | Get PRs (created and reviewing) |

## Process Steps

### Step 1: Get Team Members
Identify all active team members in current iteration.

### Step 2: Get Work Items for Each Member
For each team member:
```
mcp_azure-devops_wit_my_work_items
Parameters:
  - project: "dirtbike-shop"
  - type: "assignedtome"
  - includeCompleted: false
  - top: 100
```
**Expected Output**: Active work items assigned to member

### Step 3: Get Team Capacity
```
mcp_azure-devops_work_get_team_capacity
Parameters:
  - project: "dirtbike-shop"
  - team: "<team-name>"
  - iterationId: <current-iteration>
```
**Expected Output**: Capacity per member, days off, activities

### Step 4: Count Active Work Items
For each member, count:
- Total assigned items
- Items in progress (Active state)
- Items blocked (waiting)
- High priority items
- Overdue items

### Step 5: Analyze PR Load
```
mcp_azure-devops_repo_list_pull_requests_by_repo_or_project
Parameters:
  - project: "dirtbike-shop"
  - created_by_user: "<member-email>"
  - status: "Active"
```
**Expected Output**: Active PRs created by member

### Step 6: Count Review Responsibilities
From all active PRs, count reviews assigned to each member.

### Step 7: Get Recent Commits
```
mcp_azure-devops_repo_search_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - author: "<member-email>"
  - fromDate: <sprint-start>
  - toDate: <today>
```
**Expected Output**: Commits by member this sprint

### Step 8: Calculate Workload Score
```
Workload Score = (
  work_items_count * 2 +
  prs_authored * 3 +
  pr_reviews * 1 +
  commits * 0.5 +
  blocked_items * 2 +
  high_priority_items * 3
) / capacity_available
```

### Step 9: Identify Risk Indicators
```
RED FLAGS:
- Workload score > 1.0 (overloaded)
- >8 active work items
- >5 active PRs
- 10+ PR reviews assigned
- Multiple blocked items
- High priority items pending
- No days off, working weekends
- Consistently working >40 hours
```

### Step 10: Generate Health Report
Create comprehensive team health assessment.

## Success Criteria
✅ Workload visibility for all team members
✅ Overload situations identified early
✅ Risk indicators highlighted
✅ Recommendations provided
✅ Fair distribution confirmed
✅ Burnout risks mitigated
✅ Team morale supported
✅ Management has visibility

## Example Chat Command
```
@copilot
Generate a team health report for DirtBike-Shop showing: each member's 
active work items, PRs, reviews, current capacity, workload percentage, 
and recommendations to prevent burnout.
```

## Team Health Report Template
```
# Team Health & Burnout Prevention Report - DirtBike-Shop
**Period**: Sprint 12 (Nov 1-14, 2024)
**Generated**: November 14, 2024
**Report By**: Team Health Monitor

---

## Executive Summary

**Overall Team Health**: 🟡 YELLOW - Monitor closely

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Avg Workload | 72% | <80% | ✅ Good |
| Overloaded Members | 1 | 0 | ⚠️ |
| At-Risk Members | 2 | 0 | ⚠️ |
| Team Capacity Used | 85% | 80-85% | ✅ |
| Morale (Anonymous Survey) | 6.8/10 | >7.0 | ⚠️ |

**Key Concern**: Alice Johnson showing signs of overload
**Recommended Action**: Redistribute 2-3 items this sprint

---

## Detailed Team Member Analysis

### 🟢 HEALTHY: Bob Smith
**Title**: Senior Backend Engineer
**Workload Score**: 58%
**Sprint Capacity**: 40 hours
**Capacity Used**: 23.2 hours (58%)

**Workload Breakdown**:
- Work Items: 3 (all in progress)
- PRs Authored: 1
- PR Reviews: 2
- Commits: 12
- Blocked Items: 0
- High Priority: 0

**Status**: ✅ Healthy
**Trend**: Stable
**Comments**: Well-balanced workload, consistent productivity
**Recommendation**: Maintain current load, ready for additional items

---

### 🟡 MONITOR: Charlie Davis
**Title**: Frontend Developer
**Workload Score**: 78%
**Sprint Capacity**: 40 hours
**Capacity Used**: 31.2 hours (78%)

**Workload Breakdown**:
- Work Items: 5 (2 in progress)
- PRs Authored: 3
- PR Reviews: 3
- Commits: 18
- Blocked Items: 1 (waiting for backend)
- High Priority: 1

**Status**: ⚠️ Monitor
**Trend**: Increasing (+8 hours vs. last sprint)
**Concern**: Approaching capacity limit
**Workload Items**:
  1. [FE#1234] Advanced filtering (P2)
  2. [FE#1235] Dark mode support (P1) ← High priority
  3. [FE#1240] Performance optimization (P2)
  4. [FE#1245] Accessibility improvements (P3)
  5. [FE#1250] Component refactoring (P3)

**Recommendations**:
1. ✅ Move [FE#1250] (low priority) to next sprint
2. ✅ Assist with [FE#1235] (high priority)
3. ⚠️ Monitor blocked item - coordinate with backend
4. 📊 Track PR review load (3 reviews is reasonable)

**Next Steps**:
- Check in Monday (mid-sprint review)
- Proactively unblock backend item
- Schedule pairing session if needed

---

### 🔴 AT RISK: Alice Johnson
**Title**: Team Lead, Frontend Architecture
**Workload Score**: 95%
**Sprint Capacity**: 40 hours
**Capacity Used**: 38 hours (95%)
**Status**: 🔴 OVERLOADED

**Workload Breakdown**:
- Work Items: 8 (3 in progress)
- PRs Authored: 5
- PR Reviews: 7
- Commits: 28
- Blocked Items: 2 (critical)
- High Priority: 3
- Days Off This Sprint: 0 (no planned break)
- Avg Hours/Day: 9.5 hours (target: 8)

**Critical Issues**:
1. ⚠️ Exceeds capacity by 15%
2. ⚠️ Multiple blocked items (on her)
3. ⚠️ High review burden (7 active reviews)
4. ⚠️ No planned time off
5. ⚠️ Working evenings (commits at 9 PM)

**Workload Items** (Priority):
1. [FE#1200] New bike search (P1) - BLOCKING others
2. [FE#1205] API integration (P1) - BLOCKING others
3. [FE#1210] Component library (P2)
4. [FE#1215] Search optimization (P2)
5. [FE#1220] Code review framework (P3)
6. [FE#1225] Testing improvements (P3)
7. [FE#1230] Documentation (P3)
8. [FE#1235] Mentoring junior dev (Implicit)

**Burnout Risk Assessment**: 🔴 HIGH RISK
- Consistently > 90% utilization
- Multiple critical blockers
- High review load + own work
- Leadership responsibilities on top
- No breaks planned
- Working longer hours

**Immediate Actions Required**:
1. ✅ **TODAY**: Schedule 1:1 with manager
   - Assess stress level and workload perception
   - Discuss priorities and constraints
   - Offer support and resources

2. ✅ **This Sprint**: Redistribute Work
   - [FE#1210] Component library → Charlie Davis
   - [FE#1215] Search optimization → Diana Martinez
   - [FE#1230] Documentation → Eve Wilson
   - Estimated relief: 15-20 hours

3. ✅ **This Sprint**: Reduce Review Load
   - 7 PR reviews is too many
   - Delegate some to Charlie Davis
   - Keep only critical/complex reviews
   - Target: 3-4 reviews max

4. ✅ **Immediate**: Unblock Critical Items
   - [FE#1200] Search - check dependencies
   - [FE#1205] API - check API team status
   - Remove blockers so work progresses

5. ✅ **This Week**: Planned Time Off
   - Schedule 1-2 days off this sprint
   - Encourage early closure of PRs
   - Handoff reviews to team

**Positive Signs**:
- High productivity (28 commits)
- Leadership quality (great reviews)
- Strategic thinking (architecture work)
- Team impact (unblocking others)

**Support Plan**:
- Manager check-in: Daily standups for 1 week
- Peer support: Pair programming with Charlie
- Resources: Offer training/tools to help
- Recognition: Acknowledge high output (without encouraging more)
- Workload: Reduce by 25% next sprint

---

### 🟡 MONITOR: Diana Martinez
**Title**: DevOps Engineer
**Workload Score**: 82%
**Sprint Capacity**: 40 hours
**Capacity Used**: 32.8 hours (82%)

**Workload Breakdown**:
- Work Items: 4
- PRs Authored: 2
- PR Reviews: 4
- Infrastructure tasks: 8 hours (not tracked in work items)

**Status**: ⚠️ Monitor
**Comments**: Untracked infrastructure work making real workload higher
**Recommendation**: Better tracking of ops work in Azure DevOps

---

### 🟢 HEALTHY: Eve Wilson
**Title**: QA Engineer
**Workload Score**: 65%
**Sprint Capacity**: 40 hours
**Capacity Used**: 26 hours (65%)

**Status**: ✅ Healthy
**Recommendation**: Can take on more work

---

## Workload Distribution Visualization

```
Team Workload Matrix:

Alice:   ████████████████████████████████████████ 95% 🔴 OVERLOADED
Charlie: █████████████████████████░░░░░░░░░░░░░░░ 78% 🟡 Monitor
Diana:   ██████████████████████░░░░░░░░░░░░░░░░░░ 82% 🟡 Monitor
Bob:     ██████████████░░░░░░░░░░░░░░░░░░░░░░░░░░ 58% 🟢 Healthy
Eve:     █████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░ 65% 🟢 Healthy

Ideal:   ██████████████████████░░░░░░░░░░░░░░░░░░ 75%
Average: ███████████████████░░░░░░░░░░░░░░░░░░░░░ 74.4% ✅
```

---

## Load Balancing Recommendations

### Immediate (This Sprint - This Week)
**Goal**: Reduce Alice's load to 70%

1. ✅ Move [FE#1210] Component Library (8 hours)
   - From: Alice Johnson
   - To: Eve Wilson
   - Eve has 14 hours available

2. ✅ Move [FE#1230] Documentation (4 hours)
   - From: Alice Johnson
   - To: Eve Wilson
   - Eve can absorb this

3. ✅ Reduce Alice's PR reviews
   - From: 7 reviews
   - To: 3-4 critical reviews
   - Assign others to Charlie Davis (3) and Bob Smith (2)

**Expected Result**: Alice 95% → 75%

---

### Short Term (Next Sprint)
**Goal**: Better distribute work based on skills

1. ✅ Assign new features to Bob Smith (currently underutilized)
2. ✅ Give Charlie more P2/P3 items (good for growth)
3. ✅ Have Alice focus on P1 and architecture only
4. ✅ Implement better work item tracking for infrastructure

---

### Long Term (1-3 Months)
**Goal**: Prevent future overload situations

1. ✅ Consider hiring additional frontend developer
2. ✅ Develop Charlie Davis as senior architect (succession planning)
3. ✅ Create better capacity model
4. ✅ Implement workload monitoring dashboard
5. ✅ Regular team health assessments (every sprint)

---

## Sprint Burnout Risk Indicators

### Personal Indicators
- Working consistently > 8 hours/day
- Working weekends or evenings
- Skipping days off
- Taking work on vacation
- Decreased code review quality
- Increased typos/mistakes
- Missed deadlines
- Irritability or frustration in comments

### Observable Indicators
- Comment: Alice working at 9 PM
- Status: No days off planned
- Load: 95% utilization
- Blockers: 2 items stuck, causing stress
- Hours: 38 of 40 hours already used

---

## Team Morale Assessment

### Anonymous Survey Results (Current Sprint)
| Question | Score | Target | Status |
|----------|-------|--------|--------|
| Feel supported | 7.2/10 | >7.0 | ✅ |
| Workload fair | 5.8/10 | >7.0 | 🔴 |
| Opportunity to learn | 7.5/10 | >7.0 | ✅ |
| Manager support | 8.1/10 | >7.5 | ✅ |
| Team collaboration | 7.9/10 | >7.5 | ✅ |
| Overall satisfaction | 6.8/10 | >7.0 | ⚠️ |

**Key Finding**: "Workload fair" score is low (5.8)
- Likely driven by Alice's overload (team sees it)
- Charlie and Diana approaching limits
- May affect retention if not addressed

---

## Capacity vs. Actual Workload

### Planned Capacity (Sprint Planning)
```
Alice:   32 hours (allocated work)
Charlie: 36 hours (allocated work)
Diana:   30 hours (allocated work)
Bob:     24 hours (allocated work)
Eve:     28 hours (allocated work)
─────────────────────────────────
Total:  150 hours
```

### Actual Workload (Measured)
```
Alice:   38 hours (126% of plan)
Charlie: 31 hours (86% of plan)
Diana:   33 hours (110% of plan) - untracked ops work
Bob:     23 hours (96% of plan)
Eve:     26 hours (93% of plan)
─────────────────────────────────
Total:  151 hours (101% of plan)
```

**Analysis**: 
- Plan matched total, but distribution was off
- Alice given too much
- Infrastructure work hidden
- Others had room to help

---

## Preventive Measures

### For This Sprint (Remaining Days)
1. ✅ Redistribute 3-4 items from Alice
2. ✅ Reduce review burden
3. ✅ Encourage Alice to take day(s) off
4. ✅ Daily standups with Alice
5. ✅ Manager support/check-in

### For Next Sprint
1. ✅ Better capacity planning (include all work types)
2. ✅ More conservative planning (85% not 95%)
3. ✅ Regular health checks
4. ✅ Skills-based assignment
5. ✅ Cross-training to reduce single points of failure

### For Team Culture
1. ✅ Celebrate healthy work-life balance
2. ✅ Discourage hero culture ("working nights/weekends")
3. ✅ Regular one-on-ones
4. ✅ Career development paths
5. ✅ Peer support system

---

## Manager Action Items

- [ ] Schedule 1:1 with Alice today
  - Assess wellbeing
  - Discuss concerns
  - Offer support
  
- [ ] Redistribute work items this sprint
  - Move 3-4 items away from Alice
  - Ensure Bob gets meaningful work
  - Update sprint board
  
- [ ] Track and monitor
  - Daily standup for 1 week
  - Weekly workload check-in
  - Monitor morale survey
  
- [ ] Plan next sprint
  - More conservative allocation
  - Better capacity model
  - Include infrastructure work
  
- [ ] Long-term planning
  - Assess hiring needs
  - Develop succession plans
  - Improve tools/processes

---

## Success Metrics

### Immediate (This Sprint)
- [ ] Alice's workload ↓ to 70%
- [ ] All high-priority items blocked status cleared
- [ ] Alice takes 1-2 days off
- [ ] Team morale stabilizes

### Short Term (Next 3 Sprints)
- [ ] No team member > 85% utilization
- [ ] Workload fairness score > 7.0
- [ ] Zero overtime worked
- [ ] Improved code quality (fewer mistakes)

### Long Term (3-6 Months)
- [ ] Average team utilization 75-80%
- [ ] Retention of all key team members
- [ ] Team morale > 7.5/10
- [ ] Better work distribution
- [ ] Increased team velocity (less rework)

---

## Report Sign-off

**Prepared By**: Team Health Monitor
**Date**: November 14, 2024
**Next Review**: November 28, 2024 (end of sprint)

**Manager Acknowledgment**: 
- Name: John Manager
- Date: November 14, 2024
- Status: ✅ Reviewed and acknowledged

**Actions Planned**:
- [ ] Redistribute work (by Nov 15)
- [ ] Check-in with Alice (Nov 14)
- [ ] Team meeting about workload (Nov 15)
- [ ] Update sprint board (by EOD Nov 15)
```

## Health Scoring Formula

```
Workload Score = (
  (active_items / capacity_items) * 0.3 +
  (prs_authored / target_prs) * 0.2 +
  (reviews_assigned / target_reviews) * 0.15 +
  (hours_worked / capacity_hours) * 0.2 +
  (blocked_items / active_items * 10) * 0.15
) * 100

Target Ranges:
- 0-60%: Underutilized (help needed)
- 60-80%: Healthy (good productivity)
- 80-100%: Stretched (monitor closely)
- >100%: Overloaded (action required)
```

## Risk Assessment Framework

| Indicator | Green | Yellow | Red |
|-----------|-------|--------|-----|
| Workload | <75% | 75-90% | >90% |
| Work Items | <5 | 5-8 | >8 |
| PRs Active | <3 | 3-5 | >5 |
| Reviews | <3 | 3-5 | >5 |
| Blocked Items | 0 | 1-2 | >2 |
| Days Off | Taken | Planned | None |
| Comments | 8-5 | 5-9 PM | >9 PM |

## Burnout Prevention Best Practices
- Regular health assessments
- Transparent workload tracking
- Fair load distribution
- Encourage time off
- Celebrate work-life balance
- Provide support and resources
- Career development opportunities
- Open communication channels
- Manager training on recognition
- Team culture of wellbeing

## Integration Points
- Capacity planning
- Sprint planning
- One-on-ones
- Performance reviews
- Hiring decisions
- Succession planning
- Team events/celebrations

## Notes
- Health is as important as velocity
- Prevent burnout rather than react
- Individual needs vary
- Regular communication essential
- Act on warning signs early
- Celebrate healthy teams
