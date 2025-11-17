# Workflow 2: Build Failure Alert & Auto-Remediation

## Purpose
Monitor failed builds, automatically create work items with error details, notify the team, and provide remediation guidance to enable quick resolution.

## Use Cases
- **Proactive Alerting**: Identify build failures immediately
- **Error Documentation**: Capture failure reasons and stack traces
- **Team Notification**: Notify developers of failures in their code
- **Work Item Tracking**: Create bug records for tracking
- **PR Feedback**: Comment on PRs that cause build failures
- **Remediation Guidance**: Provide actionable fixes

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_pipelines_get_builds` | Query recent builds filtered by failed status |
| `mcp_azure-devops_pipelines_get_build_log_by_id` | Extract build logs to identify failure reason |
| `mcp_azure-devops_wit_create_work_item` | Create a bug work item with error details |
| `mcp_azure-devops_wit_add_work_item_comment` | Add comments with stack traces and affected files |
| `mcp_azure-devops_repo_create_pull_request_thread` | Comment on the PR with remediation steps |

## Process Steps

### Step 1: Query Failed Builds
```
mcp_azure-devops_pipelines_get_builds
Parameters:
  - project: "dirtbike-shop"
  - statusFilter: 2  # Failed (see BuildStatus enum)
  - resultFilter: 2  # Failed (see BuildResult enum)
  - queryOrder: "QueueTimeDescending"
  - top: 10
```
**Expected Output**: Array of recent failed builds with IDs and metadata

### Step 2: Extract Build Logs
For each failed build:
```
mcp_azure-devops_pipelines_get_build_log_by_id
Parameters:
  - project: "dirtbike-shop"
  - buildId: <build-id>
  - logId: <log-id>  # Usually 1 for main log
```
**Expected Output**: Full build log text with error messages and stack traces

### Step 3: Parse Error Information
From the build log, extract:
- Error type and message
- Stack trace
- Affected files
- Failure stage
- Timestamp

### Step 4: Create Bug Work Item
```
mcp_azure-devops_wit_create_work_item
Parameters:
  - project: "dirtbike-shop"
  - workItemType: "Bug"
  - fields:
    - name: "System.Title"
      value: "Build Failure: [Error Type] in [Build Number]"
    - name: "System.Description"
      value: "[Error message with stack trace]"
    - name: "System.Priority"
      value: "1"  # High priority
    - name: "System.AreaPath"
      value: "dirtbike-shop\\Build Infrastructure"
```
**Expected Output**: Created bug work item ID

### Step 5: Add Detailed Comments
```
mcp_azure-devops_wit_add_work_item_comment
Parameters:
  - project: "dirtbike-shop"
  - workItemId: <bug-id>
  - comment: "Build ID: [id]\nBuild Log: [link]\nAffected Files: [list]\nTimestamp: [date]"
```

### Step 6: Comment on Related PR (if applicable)
```
mcp_azure-devops_repo_create_pull_request_thread
Parameters:
  - repositoryId: "<repo-id>"
  - pullRequestId: <pr-id>
  - content: "❌ Build Failed: [Error Summary]\nBug Created: [Bug Work Item Link]\nRemediation: [Steps]\nLog: [Build Log Link]"
```

### Step 7: Assign to Developer
From the failed build, identify the commit author and assign the bug work item to them.

## Success Criteria
✅ Failed builds detected automatically
✅ Build logs extracted and analyzed
✅ Bug work items created with error details
✅ Stack traces captured
✅ Affected files identified
✅ PR authors notified
✅ Remediation steps provided
✅ Clear assignment to responsible developer

## Example Chat Command
```
@copilot
Find the last failed build in DirtBike-Shop, extract the error logs, 
create a bug work item with details, comment on the PR if applicable, 
and assign it to the developer.
```

## Error Parsing Guidelines

### Common Build Failures to Look For
1. **Compilation Errors**: TypeScript/JavaScript syntax errors
2. **Test Failures**: Failed unit or integration tests
3. **Lint Errors**: ESLint or code style violations
4. **Dependency Issues**: Missing or incompatible packages
5. **Build Tool Errors**: Webpack, Vite, or rollup errors

### Stack Trace Extraction
- Look for "ERROR", "FAIL", "error:" patterns
- Capture file paths and line numbers
- Include full error stack
- Preserve formatting for readability

## Notification Template
```
❌ Build Failed in [Project]

Error Type: [Type]
Build: [Build Number]
Branch: [Branch Name]
Commit: [Short SHA]
Author: [Developer Name]

Error Details:
[Error message and stack trace]

Affected Files:
- [file1.ts]
- [file2.tsx]

Bug Work Item: [Link to created bug]

Suggested Remediation:
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

## Notes
- Filter by recent builds to avoid overwhelming with old failures
- Deduplicate error messages to avoid creating duplicate bugs
- Include build log link for full context
- Assign based on commit author
- Escalate if multiple builds fail consecutively
- Track time to fix as a metric
