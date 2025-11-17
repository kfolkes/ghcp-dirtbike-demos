# Workflow 3: Sprint Burndown & Velocity Tracking

## Purpose
Generate comprehensive sprint insights including burndown metrics, team velocity, work item progress, and capacity utilization to enable informed sprint management and forecasting.

## Use Cases
- **Sprint Planning**: Baseline velocity for sprint planning
- **Progress Tracking**: Monitor sprint completion in real-time
- **Burndown Reports**: Generate visual burndown data
- **Velocity Metrics**: Calculate and trend team velocity over sprints
- **Risk Identification**: Identify at-risk items early
- **Capacity Utilization**: Ensure team isn't overloaded
- **Predictive Forecasting**: Estimate sprint completion probability

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_work_list_team_iterations` | Get current iteration for the team |
| `mcp_azure-devops_wit_get_work_items_for_iteration` | Fetch all work items in the iteration |
| `mcp_azure-devops_work_get_team_capacity` | Get team capacity and member availability |
| `mcp_azure-devops_wit_my_work_items` | Get assigned work items for tracking |
| `mcp_azure-devops_repo_search_commits` | Query recent commits linked to work items |

## Process Steps

### Step 1: Get Current Sprint/Iteration
```
mcp_azure-devops_work_list_team_iterations
Parameters:
  - project: "dirtbike-shop"
  - team: "<team-name>"
  - timeframe: "current"
```
**Expected Output**: Current iteration metadata (ID, name, dates, status)

### Step 2: Fetch Work Items in Iteration
```
mcp_azure-devops_wit_get_work_items_for_iteration
Parameters:
  - project: "dirtbike-shop"
  - iterationId: <iteration-id>
  - team: "<team-name>"
```
**Expected Output**: Array of work items with status (New, Active, Resolved, Closed, etc.)

### Step 3: Get Team Capacity
```
mcp_azure-devops_work_get_team_capacity
Parameters:
  - project: "dirtbike-shop"
  - team: "<team-name>"
  - iterationId: <iteration-id>
```
**Expected Output**: Team capacity, days off, activities, and member availability

### Step 4: Calculate Burndown Metrics
Process work items to calculate:
- **Total Items**: Count all items in sprint
- **Completed**: Count items with state "Closed" or "Resolved"
- **In Progress**: Count items with state "Active"
- **Not Started**: Count items with state "New"
- **Blocked**: Count items marked as blocked
- **Completion %**: (Completed / Total) * 100
- **Ideal Burndown**: Calculate ideal linear burndown based on sprint days remaining

### Step 5: Calculate Velocity
```
Query previous sprints for comparison:
- Last Sprint Completed: [X] story points
- 2 Sprints Ago: [Y] story points
- Average Velocity: [Z] story points
- Trend: [Up/Down/Stable]
```

### Step 6: Get Team Member Assignments
```
mcp_azure-devops_wit_my_work_items
Parameters:
  - project: "dirtbike-shop"
  - type: "assignedtome"
  - includeCompleted: false
  - top: 100
```
For each team member to create utilization map.

### Step 7: Search for Recent Commits
```
mcp_azure-devops_repo_search_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - fromDate: <sprint-start-date>
  - toDate: <sprint-end-date>
  - top: 100
```
**Expected Output**: Commits during sprint for correlation with work items

### Step 8: Generate Burndown Report
Compile metrics into report structure:
```
Sprint: [Sprint Name]
Duration: [Start Date] - [End Date]
Days Remaining: [N days]

Status:
- Total Items: [X]
- Completed: [Y] ([Y/X]%)
- In Progress: [Z]
- Not Started: [W]
- Blocked: [V]

Capacity:
- Planned Capacity: [HH] hours
- Remaining Capacity: [HH] hours
- Utilization: [%]

Velocity:
- This Sprint (Projected): [Points]
- Last Sprint: [Points]
- 2 Sprints Ago: [Points]
- Average: [Points]
- Trend: [Up/Down/Stable]

Health Indicators:
- On Track: [Yes/No]
- Risk Items: [Count]
- Burndown Slope: [Ideal/Ahead/Behind]

Recommendations:
- [Item 1]
- [Item 2]
```

## Success Criteria
✅ Current sprint identified
✅ All work items retrieved
✅ Burndown metrics calculated
✅ Team capacity assessed
✅ Velocity calculated and trended
✅ Risk items identified
✅ Detailed report generated
✅ Actionable recommendations provided

## Example Chat Command
```
@copilot
Get the current sprint for DirtBike-Shop team, show all work items, 
team capacity, completed tasks, remaining work, and recent commits 
linked to work items. Generate a burndown summary.
```

## Burndown Analysis

### Work Item States
- **New**: Not started, ready for work
- **Active**: Currently in progress
- **Resolved**: Completed development, awaiting review
- **Closed**: Done, verified
- **Removed**: Deprioritized or cancelled

### Key Metrics to Track
1. **Daily Burndown**: Plot remaining work vs. ideal
2. **Velocity**: Story points completed per sprint
3. **Cycle Time**: Time from Active to Closed
4. **Lead Time**: Time from Created to Closed
5. **Utilization**: % of capacity used
6. **Blockers**: Count of blocked items and duration

### Risk Assessment
- Items behind burndown line
- Unstarted items nearing sprint end
- Items in progress longer than expected
- Blocked items without clear resolution
- Overloaded team members

## Visualization Template
```
Sprint Burndown Chart:

Ideal:    ████████████░░░░░░░░░░░░░░░░░░░░░░░
Actual:   ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░

Day 1    Day 3    Day 5    Day 7    Day 9    Day 10
100%     75%      50%      25%      10%      0%
```

## Notes
- Run daily for trend analysis
- Compare against historical velocity
- Flag items at risk early
- Consider team member availability (vacations, etc.)
- Adjust capacity for cross-functional work
- Include forecasting for sprint completion probability
- Document blockers and resolutions for retrospective
