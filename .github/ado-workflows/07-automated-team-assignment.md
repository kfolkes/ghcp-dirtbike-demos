# Workflow 7: Automated Team Assignment

## Purpose
Intelligently assign unassigned work items based on team member expertise, historical commits in related code areas, and current capacity to ensure work gets to the most qualified and available team member.

## Use Cases
- **Smart Assignment**: Match work to best-suited team member
- **Load Balancing**: Distribute work evenly based on capacity
- **Expertise Matching**: Assign based on code history and specialization
- **Reduce Bottlenecks**: Prevent overloading specific team members
- **Onboarding**: Help new team members get work in their growth areas
- **Efficiency**: Improve first-time resolution rate
- **Team Development**: Expand team members' skills

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_wit_get_work_items_batch_by_ids` | Retrieve unassigned work items |
| `mcp_azure-devops_work_get_team_capacity` | Check current capacity of team members |
| `mcp_azure-devops_core_list_project_teams` | Get list of available teams |
| `mcp_azure-devops_wit_update_work_items_batch` | Assign work items to team members |
| `mcp_azure-devops_repo_search_commits` | Find commits in related code areas |

## Process Steps

### Step 1: Find Unassigned Work Items
```
First, search for unassigned items in current iteration:
- Query work items with state "New" or "Active"
- Filter where assignedTo is empty
- Get highest priority items first
```

Use WIQL (Work Item Query Language):
```
SELECT * FROM WorkItems 
WHERE [System.AssignedTo] = Null 
AND [System.State] != 'Closed'
AND [System.IterationPath] = '@CurrentIteration'
ORDER BY [Microsoft.VSTS.Common.Priority] ASC
```

### Step 2: Get Team Members
```
mcp_azure-devops_core_list_project_teams
Parameters:
  - project: "dirtbike-shop"
```
**Expected Output**: List of all teams and team members

### Step 3: Check Team Capacity
For each team member:
```
mcp_azure-devops_work_get_team_capacity
Parameters:
  - project: "dirtbike-shop"
  - team: "<team-name>"
  - iterationId: <current-iteration-id>
```
**Expected Output**: Each member's capacity and current utilization

### Step 4: Analyze Team Member Expertise
For each team member, search for recent commits:
```
mcp_azure-devops_repo_search_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - author: "<team-member-email>"
  - fromDate: <90-days-ago>
  - top: 50
```
**Expected Output**: Recent commits, which files they touched, expertise areas

### Step 5: Build Expertise Profile
For each team member, create a profile:
```
Profile Structure:
{
  memberId: string,
  name: string,
  currentWorkload: number,  // work items assigned
  capacityUsed: percentage,
  recentAreas: ["src/components", "src/hooks", "src/pages"],
  expertise: ["React", "TypeScript", "Testing"],
  commitFrequency: number,
  averageCycleTime: days,
  specializations: ["UI Components", "State Management"]
}
```

### Step 6: Score Work Item Requirements
For each unassigned work item:
```
Extract requirements from:
- Title and description keywords
- Work item type (Bug, Feature, Task)
- Priority level
- Related files (from linked artifacts)
- Technology tags
- Area path
```

### Step 7: Match Assignment
For each work item, calculate match scores for each team member:
```
Score = (
  expertise_match * 0.4 +           // Skills alignment
  available_capacity * 0.3 +         // Current capacity
  recent_area_commits * 0.2 +        // Code area familiarity
  skill_development_opportunity * 0.1 // Growth opportunity
)
```

### Step 8: Perform Assignments
Assign highest-scored match:
```
mcp_azure-devops_wit_update_work_items_batch
Parameters:
  - updates: [
    {
      id: <work-item-id>,
      path: "/fields/System.AssignedTo",
      value: "<team-member-id>",
      op: "Replace"
    }
  ]
```

### Step 9: Generate Assignment Report
Document why each assignment was made.

## Success Criteria
✅ All unassigned work items assigned
✅ Assignments based on expertise
✅ Load distributed evenly
✅ No team member overloaded
✅ Quality assignments that stick
✅ Assignments respect skill development
✅ First-time resolution improves
✅ Team satisfaction with assignments

## Example Chat Command
```
@copilot
Find all unassigned work items in DirtBike-Shop, check team capacity 
and expertise based on recent commits, intelligently assign each item 
to the best team member with available capacity.
```

## Assignment Scoring Algorithm

### Scoring Factors
| Factor | Weight | Description |
|--------|--------|-------------|
| Expertise Match | 40% | How well member's skills match work item |
| Available Capacity | 30% | How much capacity member has available |
| Code Familiarity | 20% | Recent commits in related code areas |
| Growth Opportunity | 10% | Chance to develop new skills |

### Expertise Scoring
```
score = (skills_matched / total_required_skills) * 100

Example:
Item requires: React, TypeScript, UI Design
Member has: React, TypeScript (no UI Design)
Score: 2/3 = 66%
```

### Capacity Scoring
```
available_hours = capacity_per_day * days_in_sprint - hours_assigned
utilization = (hours_assigned / capacity_per_day * days_in_sprint) * 100

Capacity score:
- 0-50% utilized:    100 (plenty available)
- 50-75% utilized:   75
- 75-90% utilized:   50
- 90-100% utilized:  25
- >100% utilized:    0  (overloaded)
```

### Code Familiarity Scoring
```
recent_commits_in_area = count of commits in last 90 days in code area
score = min(recent_commits_in_area * 10, 100)

Example:
- 10+ commits in area: 100
- 5-9 commits: 50-100
- 1-4 commits: 10-50
- 0 commits: 0 (but potential learning)
```

## Assignment Report Template
```
## Automated Work Item Assignments - [Date]

### Summary
- Total Unassigned Items: 12
- Assigned: 12
- Success Rate: 100%
- Total Capacity Allocated: 156 hours

### Assignments by Priority

#### Priority 1 (Critical)
- [WI#1234] Fix Login Bug
  - Assigned to: Alice Johnson
  - Reason: 90% expertise match, 2 recent commits in auth code
  - Confidence: 95%

#### Priority 2 (High)
- [WI#1235] Add Search Filter
  - Assigned to: Bob Smith
  - Reason: UI expert, 50% capacity available, 15 recent commits in components
  - Confidence: 88%

### Team Load Distribution
```
Alice Johnson:     75% ████████████████░░
Bob Smith:         68% █████████████░░░░░
Charlie Davis:     52% ██████████░░░░░░░░
Diana Martinez:    61% ██████████████░░░░░
```

### Capacity Analysis
- Total Team Capacity: 240 hours
- Total Allocated: 156 hours
- Remaining Buffer: 84 hours (35%)
- Team Utilization: 65%

### Confidence Metrics
- High Confidence (85-100%): 9 assignments
- Medium Confidence (70-85%): 3 assignments
- Low Confidence (<70%): 0 assignments

### Notes
- All assignments utilize team expertise
- Load balanced across team
- Growth opportunities included for junior members
- Overloaded members excluded from assignments
```

## Best Practices for Assignments

### Consider Work Item Type
- **Bugs**: Assign to expert in that code area
- **Features**: Balance between expertise and workload
- **Tasks**: Good for skill development and onboarding
- **Technical Debt**: Assign to relevant expert

### Respect Preferences
- Some team members prefer certain work types
- Consider learning interests
- Honor skill development goals
- Track assignment satisfaction

### Avoid Bottlenecks
- Don't overload single expert
- Spread knowledge across team
- Pair experienced with junior developers
- Rotate who handles different areas

### Monitor Outcomes
- Track assignment quality
- Measure first-time resolution rate
- Monitor cycle time per assignment
- Get feedback from assignees

## Assignment Automation Rules

### Hard Rules (Must Follow)
- Never assign > capacity
- Don't assign to on leave members
- Exclude junior devs from critical bugs
- Match required skills

### Soft Rules (Consider)
- Prefer code familiarity
- Balance workload ±10%
- Rotate assignments fairly
- Support skill development

## Escalation Criteria
Escalate to manager if:
- No qualified person available
- Critical item has no owner
- Person refuses assignment
- Assignment confidence < 50%

## Integration Points
- Link to capacity planning
- Feed into performance reviews
- Support training decisions
- Inform team composition
- Drive hiring needs

## Notes
- Run daily or when new items arrive
- Review assignments manually if confidence < 70%
- Adjust algorithm based on outcomes
- Include team feedback in improvements
- Consider time zones for distributed teams
- Document special cases and exceptions
