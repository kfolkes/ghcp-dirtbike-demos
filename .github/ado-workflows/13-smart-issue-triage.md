# Workflow 13: Smart Issue Triage

## Purpose
Automatically triage and categorize incoming issues by analyzing content, extracting keywords, setting appropriate priority levels, and assigning to relevant teams to ensure issues are handled efficiently with minimal manual work.

## Use Cases
- **Rapid Triage**: Automatically categorize new issues
- **Smart Routing**: Route to correct team immediately
- **Consistency**: Apply uniform categorization rules
- **Priority Setting**: Automatically assess severity
- **Team Distribution**: Spread work appropriately
- **SLA Automation**: Trigger appropriate SLAs based on priority
- **Escalation**: Identify critical issues automatically
- **Cycle Time**: Reduce time to first assignment

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_search_workitem` | Find untriaged work items |
| `mcp_azure-devops_wit_get_work_item` | Retrieve full details |
| `mcp_azure-devops_wit_update_work_items_batch` | Update categorization and assignment |
| `mcp_azure-devops_core_list_project_teams` | Get available teams for assignment |

## Process Steps

### Step 1: Find Untriaged Work Items
```
Use WIQL to find items needing triage:
SELECT * FROM WorkItems 
WHERE [System.State] = 'New'
AND [System.Tags] NOT CONTAINS 'triaged'
AND [System.IterationPath] IS EMPTY
ORDER BY [System.CreatedDate] DESC
```

### Step 2: Get Full Details
For each untriaged item:
```
mcp_azure-devops_wit_get_work_item
Parameters:
  - id: <work-item-id>
  - project: "DirtBike-Shop"
  - fields: ["System.Title", "System.Description", "System.WorkItemType"]
```
**Expected Output**: Full work item details (Issue type work items)

### Step 3: Extract Keywords
From title and description, identify:
- Feature keywords (search, filter, payment, etc.)
- Technology keywords (React, TypeScript, database, etc.)
- Severity indicators (crash, broken, slow, etc.)
- Component keywords (UI, API, database, etc.)
- Issue type keywords (bug, feature, documentation, etc.)

### Step 4: Analyze Content
```
Title Analysis:
- Length and completeness
- Presence of version info
- Presence of reproduction steps

Description Analysis:
- Completeness (does it explain the issue?)
- Presence of error messages
- Presence of reproduction steps
- Presence of expected vs actual behavior
- Presence of attachments/screenshots

Work Item Type:
- Is it correctly classified?
- Should it be Bug/Feature/Task?
```

### Step 5: Determine Category
Based on keywords and content, categorize as:
- **Bug/Issue**: Defect/problem (keywords: broken, error, crash, fail, not working, fix)
- **Feature**: New functionality (keywords: add, new, implement, support, create)
- **Improvement**: Enhancement (keywords: optimize, improve, better, faster, refactor)
- **Documentation**: Docs issue (keywords: docs, document, guide, missing docs)
- **Task**: Work item (keywords: task, refactor, simplify, cleanup, tech debt)

### Step 6: Set Priority
Based on analysis, assign priority:
```
Priority Assessment:
- Critical (P0): System down, security issue, data loss
  Keywords: broken, crash, error, security, unauthorized
  Confidence threshold: 90%

- High (P1): Feature not working, significant functionality impaired
  Keywords: not working, blocking, broken, fail, error
  Confidence threshold: 75%

- Medium (P2): Issue impacts functionality but workaround exists
  Keywords: issue, problem, incorrect, slow
  Confidence threshold: 60%

- Low (P3): Minor issue, enhancement, documentation
  Keywords: improve, document, nice-to-have
  Confidence threshold: 40%
```

### Step 7: Identify Area Path
Determine affected component:
- **Frontend**: UI, components, React
- **Backend**: API, services, database
- **Infrastructure**: DevOps, CI/CD, deployment
- **Documentation**: Docs, guides, README
- **Testing**: Tests, QA, automation

### Step 8: Recommend Team
Based on type and area:
- Frontend issues → Frontend team
- Backend issues → Backend team
- Infrastructure → DevOps team
- Cross-functional → Tech lead team

### Step 9: Update Work Items
```
mcp_azure-devops_wit_update_work_items_batch
Parameters:
  - updates: [
    {
      id: <work-item-id>,
      path: "/fields/System.AreaPath",
      value: "DirtBike-Shop",
      op: "Add"
    },
    {
      id: <work-item-id>,
      path: "/fields/Microsoft.VSTS.Common.Priority",
      value: "1|2|3",
      op: "Add"
    },
    {
      id: <work-item-id>,
      path: "/fields/System.Tags",
      value: "triaged;[category];[priority]",
      op: "Add"
    }
  ]
```

### Step 10: Generate Triage Report
Document categorization decisions.

## Success Criteria
✅ All new items triaged automatically
✅ Correct categorization applied
✅ Priority levels accurate
✅ Team assignments appropriate
✅ Area paths assigned
✅ Tags applied consistently
✅ Minimal rework needed
✅ Quick time to first assignment

## Example Chat Command
```
@copilot
Find all untriaged work items in DirtBike-Shop, analyze their content, 
auto-categorize by type, set priority levels, assign to appropriate 
teams, and add relevant labels and area paths.
```

## Keyword-Based Classification

### Bug Detection Keywords
```
High Confidence (>85%):
- crash, exception, error, failed, broken, not working, 
  doesn't work, bug, issue, problem, wrong, incorrect

Medium Confidence (60-85%):
- slow, timeout, stuck, hang, freeze, unresponsive

Low Confidence (<60%):
- incorrect, missing, not showing
```

### Feature Detection Keywords
```
High Confidence (>85%):
- add, new, feature, implement, support, enable, create, 
  allow, request, enhancement

Medium Confidence (60-85%):
- improve, optimize, better, make, how to

Low Confidence (<60%):
- would be nice, consider, maybe, think about
```

### Priority Scoring Algorithm
```
Score = (
  severity_score * 0.4 +
  urgency_score * 0.3 +
  impact_score * 0.2 +
  completeness_score * 0.1
)

Severity:
- crash/data loss: 100
- feature broken: 80
- workaround exists: 50
- minor: 20

Urgency:
- today: 100
- this week: 80
- this sprint: 50
- no deadline: 20

Impact:
- all users: 100
- many users: 70
- some users: 40
- one user: 10

Completeness:
- full details: 100
- some details: 50
- minimal: 0
```

## Triage Report Template
```
## Smart Issue Triage Report - [Date]

### Summary
- Items Triaged: 24
- Items Recategorized: 3
- Time Saved: ~4 hours

### Triage Distribution

#### By Category
| Category | Count | % | Avg Priority |
|----------|-------|---|--------------|
| Issue (Bug) | 8 | 33% | P1 |
| Feature | 9 | 38% | P2 |
| Improvement | 4 | 17% | P3 |
| Task | 2 | 8% | P3 |
| Documentation | 1 | 4% | P3 |

#### By Priority
| Priority | Count | % | Action |
|----------|-------|---|--------|
| P0 (Critical) | 2 | 8% | Urgent review |
| P1 (High) | 7 | 29% | Assign ASAP |
| P2 (Medium) | 12 | 50% | Plan for sprint |
| P3 (Low) | 3 | 13% | Backlog |

#### By Component
| Component | Count | Team | Priority |
|-----------|-------|------|----------|
| Frontend | 12 | Frontend | - |
| Backend | 8 | Backend | - |
| Infrastructure | 3 | DevOps | - |
| Documentation | 1 | All | - |

---

### Critical Items (P0) 🔴

#### ITEM #2341
**Title**: "Login page broken - users can't access app"
**Type**: Issue (Auto-categorized)
**Priority**: P1 (High)
**Component**: Frontend - Authentication
**Assigned To**: Frontend Team
**Urgency**: Today
**Impact**: All users

**Analysis**:
- Keyword signals: "broken", "can't", "users", "access"
- Severity score: 95 (system-blocking)
- Title indicates widespread impact
- Categorized as high-priority Issue

**Confidence**: 99%

**Recommended Action**: 
1. Immediate review
2. Assign to senior developer
3. Estimate & commit to fix
4. Daily updates

---

#### ITEM #2342
**Title**: "Payment processing fails with 500 error"
**Type**: Issue (Auto-categorized)
**Priority**: P1 (High)
**Component**: Backend - Payments
**Assigned To**: Backend Team
**Urgency**: Today
**Impact**: Transaction failures

**Analysis**:
- Keywords: "fails", "error", "500"
- Severity: Business-impacting
- Financial impact: Potential revenue loss
- Needs stack trace

**Confidence**: 97%

---

### High Priority Items (P1) 🟠

#### ITEM #2343
**Title**: "Search results showing duplicate bikes"
**Type**: Issue (Auto-categorized)
**Priority**: P1 (High)
**Component**: Frontend - Search
**Assigned To**: Frontend Team

**Analysis**:
- Type: Functionality issue
- Severity: Not system-breaking but frustrating
- Workaround: Manual filtering
- Impact: Single feature area

**Confidence**: 88%

#### ITEM #2344
**Title**: "Add dark mode support"
**Type**: Feature (Auto-categorized)
**Priority**: P2 (Medium)
**Component**: Frontend - UI
**Assigned To**: Frontend Team

**Analysis**:
- Keyword: "Add" (feature indicator)
- User requests: 12 upvotes
- Business value: High (UX improvement)
- Effort estimate: Medium

**Confidence**: 92%

---

### Recategorization (Items that changed)

#### ITEM #2320
**Original Category**: Feature
**Auto-Categorized**: Issue
**Reason**: "Button doesn't work" indicates defect, not request
**New Priority**: P1 (from P3)
**Status**: ✅ Corrected

---

### Quality Metrics

#### Confidence Scores
- High (>90%): 18 items (75%)
- Medium (70-90%): 5 items (21%)
- Low (<70%): 1 item (4%)

Average Confidence: 88%

#### Manual Review Needed
1 item with low confidence (<70%) flagged for manual review

---

### Distribution to Teams

#### Frontend Team
- Assigned: 12 items
- P0: 1, P1: 3, P2: 6, P3: 2
- Estimated effort: 40 hours

#### Backend Team
- Assigned: 8 items
- P0: 1, P1: 2, P2: 4, P3: 1
- Estimated effort: 32 hours

#### DevOps Team
- Assigned: 3 items
- P0: 0, P1: 2, P2: 1, P3: 0
- Estimated effort: 8 hours

#### Documentation
- Assigned: 1 item
- P0: 0, P1: 0, P2: 0, P3: 1
- Estimated effort: 2 hours

---

### Issues Requiring Attention

#### Incomplete Information
- ITEM #2315: No reproduction steps provided
  - Suggestion: "Could you provide steps to reproduce?"
  - Priority: P1

#### Misclassified (Caught by Automation)
- ITEM #2320: Was "Feature", recategorized as "Bug"
- 3 other items requiring manual verification

#### Ambiguous
- ITEM #2333: Could be Performance or Bug
  - Recommendation: Assign to team lead for clarification
  - Flag for discussion

---

### Efficiency Gains

**Time Saved**: 
- Manual categorization: 24 items × 10 min = 240 minutes
- Automation time: 24 items × 30 sec = 12 minutes
- **Savings: 228 minutes (3.8 hours)** ✅

**Consistency Improved**:
- Consistent rules applied: 24/24 (100%) ✅
- Prior manual triage consistency: ~75%
- **Improvement: 25%** ✅

**Assignment Accuracy**:
- Correct team assigned: 23/24 (96%) ✅
- Incorrect assignments: 1 (needs review)
- Confidence score helped identify: ✅

---

### Next Steps

1. ✅ Review 1 low-confidence item manually
2. ✅ Contact users for missing info (3 items)
3. ✅ Escalate P0 items to leads
4. ✅ Plan assignment for teams
5. ✅ Set up SLAs based on priority

---

### Triage Rules Used

**Applied Rules:**
- 24 keyword-based rules
- 8 priority scoring rules
- 6 team assignment rules
- 100% match accuracy

**Rules Accuracy:**
- Precision: 96%
- Recall: 94%
- F1-Score: 95%

---

### Recommendations

1. **Improve Issue Templates**
   - Add reproduction steps section
   - Add expected vs. actual section
   - Add environment section

2. **Set Response SLAs**
   - P0: 1 hour
   - P1: 4 hours
   - P2: 1 day
   - P3: 3 days

3. **Automate Follow-ups**
   - Request missing info
   - Remind assignees
   - Track progress

4. **Monitor Metrics**
   - First assignment time
   - Triage accuracy
   - Priority distribution
```

## Triage Automation Rules

### Rule Priority Order
1. Severity keywords (crash, broken, error)
2. Business impact (payment, login, security)
3. Scope (affects all users vs. one user)
4. Completeness (enough info to act?)

## Team Assignment Logic
```
IF bug in authentication → Frontend Security
ELSE IF bug in payments → Backend Payments
ELSE IF bug in search → Frontend Search
ELSE IF backend issue → Backend
ELSE IF frontend issue → Frontend
ELSE IF infrastructure → DevOps
ELSE → Tech Lead (needs review)
```

## SLA Mapping
```
P0 (Critical): 1 hour to acknowledge, 4 hours to start fix
P1 (High): 4 hours to acknowledge, 1 day to start fix
P2 (Medium): 1 day to acknowledge, 3 days to start fix
P3 (Low): 3 days to acknowledge, 1 sprint to start fix
```

## Confidence Score Interpretation
```
95-100%: High confidence - auto-process
80-95%: Good confidence - auto-process with monitoring
70-80%: Medium confidence - flag for review
<70%: Low confidence - require manual review
```

## Automation Considerations
- Run hourly or on-demand
- Apply rules consistently
- Monitor accuracy metrics
- Adjust rules based on feedback
- Track false positives/negatives
- Continuous improvement

## Notes
- Escalate uncertain items to team lead
- Request missing information automatically
- Update templates based on learnings
- Celebrate triage accuracy improvements
