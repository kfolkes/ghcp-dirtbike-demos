# Workflow 4: Security & Dependency Alerts

## Purpose
Monitor code for security vulnerabilities, dependency issues, and code quality problems. Automatically create work items, link affected code, and provide remediation guidance.

## Use Cases
- **Vulnerability Management**: Track and prioritize security issues
- **Dependency Tracking**: Monitor third-party package security
- **Secret Detection**: Identify accidentally committed secrets
- **Compliance**: Maintain audit trail of security responses
- **Code Quality**: Enforce secure coding practices
- **Risk Mitigation**: Address vulnerabilities before they impact production
- **Team Education**: Use alerts as learning opportunities

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_advsec_get_alerts` | Fetch all security alerts (secrets, code, dependencies) |
| `mcp_azure-devops_advsec_get_alert_details` | Get detailed information about each alert |
| `mcp_azure-devops_search_code` | Search for affected code in the codebase |
| `mcp_azure-devops_wit_create_work_item` | Create security work items for each alert |
| `mcp_azure-devops_wit_add_artifact_link` | Link commits that introduced the vulnerability |

## Process Steps

### Step 1: Fetch Security Alerts
```
mcp_azure-devops_advsec_get_alerts
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - alertType: "Secret|Code|Dependency|License"  # Filter by type
  - severities: ["Critical", "High"]  # High severity only
  - states: ["Active"]  # Active, not dismissed
  - onlyDefaultBranch: true
  - orderBy: "severity"
  - top: 50
```
**Expected Output**: Array of active security alerts with metadata

### Step 2: Get Alert Details
For each alert identified as critical or high:
```
mcp_azure-devops_advsec_get_alert_details
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - alertId: <alert-id>
  - ref: "<branch-name>"  # Usually main
```
**Expected Output**: Detailed alert information including file location, line numbers, severity, and suggested fixes

### Step 3: Categorize Alerts
Organize by type:
- **Secrets**: API keys, passwords, tokens
- **Vulnerability**: Known security CVEs in dependencies
- **Code Issues**: Potential code-based vulnerabilities
- **License Issues**: Problematic licenses
- **Other**: Dependency or supply chain risks

### Step 4: Search for Affected Files
For code-based alerts:
```
mcp_azure-devops_search_code
Parameters:
  - searchText: "<vulnerable-pattern|package-name>"
  - project: ["dirtbike-shop"]
  - repository: ["<repo-name>"]
  - top: 20
```
**Expected Output**: Files containing the vulnerability or affected package

### Step 5: Create Security Work Items
For each high/critical alert:
```
mcp_azure-devops_wit_create_work_item
Parameters:
  - project: "dirtbike-shop"
  - workItemType: "Bug"
  - fields:
    - name: "System.Title"
      value: "[SECURITY] [Alert Type]: [Description]"
    - name: "System.Description"
      value: "Severity: [Level]\nAlert ID: [ID]\nDescription: [Details]\nAffected Files: [Files]\nRecommended Fix: [Fix Details]"
    - name: "System.Priority"
      value: "1"  # Critical priority
    - name: "System.AreaPath"
      value: "dirtbike-shop\\Security"
    - name: "System.Tags"
      value: "security;vulnerability"
```
**Expected Output**: Created security work item ID

### Step 6: Link Commits
For alerts related to specific commits:
```
mcp_azure-devops_wit_add_artifact_link
Parameters:
  - workItemId: <security-work-item-id>
  - project: "dirtbike-shop"
  - linkType: "Fixed in Commit"
  - commitId: "<commit-sha>"
  - projectId: "<project-id>"
  - repositoryId: "<repo-id>"
  - comment: "Commit that introduced vulnerability"
```

### Step 7: Add Remediation Comments
```
mcp_azure-devops_wit_add_work_item_comment
Parameters:
  - project: "dirtbike-shop"
  - workItemId: <security-work-item-id>
  - comment: "Remediation Steps:\n1. [Step 1]\n2. [Step 2]\nReferences:\n- [Link to Advisory]\n- [Link to Fix]\nAffected Components: [List]"
```

### Step 8: Generate Alert Report
Compile summary of all alerts and remediation status.

## Success Criteria
✅ All active security alerts identified
✅ High/Critical alerts prioritized
✅ Affected files located
✅ Work items created for each alert
✅ Commits linked showing vulnerability source
✅ Remediation guidance provided
✅ Clear action items assigned
✅ Audit trail maintained

## Example Chat Command
```
@copilot
Get all high-severity security alerts in DirtBike-Shop, search for 
affected files, create security work items with details, link commits, 
and add remediation guidance.
```

## Alert Type Guidelines

### Secret Detection Alerts
- API Keys and tokens
- Database credentials
- Private encryption keys
- OAuth secrets
- **Action**: Rotate immediately, revoke exposed secrets

### Dependency Vulnerability Alerts
- Known CVEs in npm packages
- Outdated dependencies
- Vulnerable package versions
- **Action**: Update to patched version or apply security patch

### Code Vulnerability Alerts
- SQL Injection risks
- Cross-site scripting (XSS) vulnerabilities
- Insecure deserialization
- Authentication bypass risks
- **Action**: Code review and refactoring required

### License Compliance Alerts
- Copyleft licenses (GPL, AGPL)
- Restrictive licenses
- Incompatible licenses
- **Action**: Replace package or negotiate license

## Severity Levels
| Level | Response Time | Action |
|-------|---------------|--------|
| **Critical** | Immediate | Emergency patch or rollback |
| **High** | < 24 hours | Schedule fix and deploy |
| **Medium** | < 7 days | Plan fix in next sprint |
| **Low** | < 30 days | Include in backlog |

## Remediation Template
```
Security Alert: [Title]
Severity: [Level]
Alert ID: [ID]
Alert Type: [Type]

Description:
[Detailed description of the vulnerability]

Affected Components:
- File: [filepath]
- Line: [line number]
- Package: [package-name@version]

Risk Assessment:
- Exploitability: [High/Medium/Low]
- Impact: [High/Medium/Low]
- Current Status: [Production/Staging/Dev]

Recommended Fix:
Option 1: [Fix option 1]
Option 2: [Fix option 2]

Testing:
- Unit Tests: [Test names]
- Integration Tests: [Test names]
- Security Tests: [Test names]

Validation:
- Code Review: Required
- Security Review: Required
- Deployment: [Target environment]
```

## Automation Considerations
- Run daily or on-demand for alert detection
- Group related alerts for batch processing
- Escalate critical alerts to security team
- Auto-remediate where possible (dependency updates)
- Track metrics on MTTR (Mean Time To Remediation)
- Generate quarterly security reports
- Maintain vulnerability database

## Integration Points
- Link to build failures if security tests fail
- Reference in PR reviews for related code changes
- Include in security scorecards
- Feed into compliance audits
- Track in security incidents log

## Notes
- Severity doesn't always equal priority (context matters)
- False positives should be tracked and adjusted
- Consider business context when planning fixes
- Coordinate with product/security team for releases
- Document all security exceptions and approvals
- Provide training on how to prevent common issues
