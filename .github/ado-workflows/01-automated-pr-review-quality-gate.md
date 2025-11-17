# Workflow 1: Automated PR Review & Quality Gate

## Purpose
Automatically review pull requests, link work items, add reviewers, and verify build quality to ensure code quality standards before merge.

## Use Cases
- **Quality Assurance**: Automatically verify that PRs meet quality gates before human review
- **Streamlined Reviews**: Reduce manual effort by auto-assigning reviewers based on code areas
- **Build Verification**: Ensure builds pass before approvals
- **Work Item Tracking**: Automatically link related work items to maintain traceability
- **Team Notification**: Keep team informed of PR status and requirements

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_repo_list_pull_requests_by_repo_or_project` | Fetch all active PRs for the repository |
| `mcp_azure-devops_repo_get_pull_request_by_id` | Get detailed PR information and associated commits |
| `mcp_azure-devops_pipelines_get_builds` | Check if the latest build passed |
| `mcp_azure-devops_wit_link_work_item_to_pull_request` | Link related work items to the PR |
| `mcp_azure-devops_repo_update_pull_request_reviewers` | Add frontend team as reviewers |
| `mcp_azure-devops_repo_create_pull_request_thread` | Add a comment with build status and test results |

## Process Steps

### Step 1: List Active Pull Requests
```
mcp_azure-devops_repo_list_pull_requests_by_repo_or_project
Parameters:
  - project: "dirtbike-shop"
  - repositoryId: "<repo-id>"
  - status: "Active"
  - top: 50
```
**Expected Output**: Array of active PRs with IDs and basic metadata

### Step 2: Get PR Details
For each PR from Step 1:
```
mcp_azure-devops_repo_get_pull_request_by_id
Parameters:
  - repositoryId: "<repo-id>"
  - pullRequestId: <pr-id>
  - includeWorkItemRefs: true
```
**Expected Output**: PR details including commits, reviewers, linked work items

### Step 3: Check Build Status
For each PR:
```
mcp_azure-devops_pipelines_get_builds
Parameters:
  - project: "dirtbike-shop"
  - definitions: [<build-definition-id>]
  - branchName: "refs/pull/<pr-id>/merge"
```
**Expected Output**: Build status (succeeded, failed, in progress)

### Step 4: Link Work Items (if not already linked)
```
mcp_azure-devops_wit_link_work_item_to_pull_request
Parameters:
  - projectId: "<project-id>"
  - repositoryId: "<repo-id>"
  - pullRequestId: <pr-id>
  - workItemId: <work-item-id>
```

### Step 5: Add Reviewers
```
mcp_azure-devops_repo_update_pull_request_reviewers
Parameters:
  - repositoryId: "<repo-id>"
  - pullRequestId: <pr-id>
  - reviewerIds: ["<team-member-id1>", "<team-member-id2>"]
  - action: "add"
```

### Step 6: Post Quality Gate Comment
```
mcp_azure-devops_repo_create_pull_request_thread
Parameters:
  - repositoryId: "<repo-id>"
  - pullRequestId: <pr-id>
  - content: "✅ Quality Gate Status:\n- Build: [PASSED/FAILED]\n- Work Items: Linked\n- Reviewers: Assigned"
```

## Success Criteria
✅ All active PRs are reviewed
✅ Work items linked to PRs
✅ Reviewers assigned
✅ Build status verified
✅ Quality gate comments posted
✅ No manual intervention needed for routine checks

## Example Chat Command
```
@copilot
List all active PRs in DirtBike-Shop repository, get their build status, 
link work items, add the frontend team as reviewers, and post a quality 
gate comment with the build results.
```

## Notes
- Filter PRs by status to focus on "Active" only
- Check build status for the PR merge commit
- Ensure reviewers are part of the correct team
- Post comments with clear pass/fail status
- Handle cases where builds are still running
