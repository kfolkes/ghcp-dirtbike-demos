# Workflow 9: Performance Regression Detection

## Purpose
Monitor and alert on performance regressions by comparing build metrics against baseline, identifying root causes, creating work items, and notifying developers to maintain application performance standards.

## Use Cases
- **Performance Monitoring**: Track application performance metrics
- **Regression Detection**: Identify performance degradation early
- **Root Cause Analysis**: Find commits that caused regression
- **Developer Notification**: Alert author of problematic changes
- **Automated Escalation**: Create work items for significant issues
- **Performance Trending**: Track performance over time
- **SLA Maintenance**: Ensure performance targets are met

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_pipelines_get_builds` | Get recent builds with performance metrics |
| `mcp_azure-devops_pipelines_get_build_log_by_id` | Extract performance metrics from build logs |
| `mcp_azure-devops_wit_create_work_item` | Create performance work items |
| `mcp_azure-devops_repo_list_pull_requests_by_commits` | Find the PR that introduced regression |

## Process Steps

### Step 1: Get Recent Builds
```
mcp_azure-devops_pipelines_get_builds
Parameters:
  - project: "dirtbike-shop"
  - queryOrder: "FinishTimeDescending"
  - statusFilter: 4  # Succeeded
  - resultFilter: 0  # Succeeded
  - top: 20
```
**Expected Output**: Recent successful builds with timestamps

### Step 2: Extract Performance Metrics
For each recent build:
```
mcp_azure-devops_pipelines_get_build_log_by_id
Parameters:
  - project: "dirtbike-shop"
  - buildId: <build-id>
  - logId: 1  # Main log
```
**Expected Output**: Build log with performance data

### Step 3: Parse Performance Metrics
Extract metrics from build logs:
```
Metrics to track:
- Build Time: Total build duration (target: <10 minutes)
- Bundle Size: JavaScript bundle size (target: <200KB)
- Test Suite Duration: How long tests take (target: <5 minutes)
- Deploy Time: Time to deploy (target: <5 minutes)
- Lighthouse Score: Performance audit score (target: ≥90)
- First Contentful Paint (FCP): (target: <1.5s)
- Largest Contentful Paint (LCP): (target: <2.5s)
- Cumulative Layout Shift (CLS): (target: <0.1)
- Memory Usage: Application memory (target: baseline)
- API Response Time: Average API latency (target: <200ms)
```

### Step 4: Compare Against Baseline
```
For each metric:
baseline_value = average of last week's value
current_value = latest value
regression_percentage = ((current_value - baseline_value) / baseline_value) * 100

Example:
Build Time Baseline: 8 min
Build Time Current: 12 min
Regression: ((12-8)/8)*100 = 50% REGRESSION DETECTED
```

### Step 5: Identify Regressions
Flag metrics that exceed thresholds:
```
Regression Levels:
- Critical (>20% worse): Immediate action needed
- High (10-20% worse): Plan fix this sprint
- Medium (5-10% worse): Monitor and fix soon
- Low (<5% worse): Monitor trend
```

### Step 6: Find Root Cause
For each regression, search for commits since baseline:
```
mcp_azure-devops_repo_search_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - fromDate: <last-good-build-date>
  - toDate: <regressed-build-date>
  - top: 50
```
**Expected Output**: Commits in the regression window

### Step 7: Find PR that Introduced Regression
```
mcp_azure-devops_repo_list_pull_requests_by_commits
Parameters:
  - project: "dirtbike-shop"
  - repository: "<repo-name>"
  - commits: [<commit-shas-in-regression-window>]
  - queryType: "Commit"
```
**Expected Output**: PRs containing the regression-causing commits

### Step 8: Create Performance Work Item
For critical/high regressions:
```
mcp_azure-devops_wit_create_work_item
Parameters:
  - project: "dirtbike-shop"
  - workItemType: "Bug"
  - fields:
    - name: "System.Title"
      value: "[PERFORMANCE] [Metric] regressed [%]: [Description]"
    - name: "System.Description"
      value: "Regression detected in [metric]\nBaseline: [value]\nCurrent: [value]\nRegression: [%]\nBuild: [#]\nRootCause: [commit/PR]\nAffectedAreas: [components/functions]"
    - name: "System.Priority"
      value: "1"  # High priority
    - name: "System.AreaPath"
      value: "dirtbike-shop\\Performance"
```

### Step 9: Notify Developer
Comment on the PR that caused the regression:
```
mcp_azure-devops_repo_create_pull_request_thread
Parameters:
  - repositoryId: "<repo-id>"
  - pullRequestId: <pr-id>
  - content: "⚠️ Performance Regression Detected\n\nYour changes appear to have caused a performance regression:\n\n[Details]\n\nWork Item: [link]"
```

### Step 10: Generate Regression Report
Create comprehensive report of all regressions.

## Success Criteria
✅ Performance metrics extracted from builds
✅ Regressions detected automatically
✅ Baseline comparisons accurate
✅ Root cause identified (commit/PR)
✅ Work items created for significant issues
✅ Developer notifications sent
✅ Trend analysis available
✅ Clear remediation paths provided

## Example Chat Command
```
@copilot
Analyze recent DirtBike-Shop builds for performance metrics, compare 
against last week's baseline, identify regressions, find the PR that 
caused it, create a bug work item, and notify the developer.
```

## Performance Metrics by Category

### Build Performance
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Build Time | 8 min | >10 min | >12 min |
| Bundle Size | 200 KB | >220 KB | >250 KB |
| Test Time | 5 min | >6 min | >7 min |

### Runtime Performance
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| FCP | <1.5s | >1.8s | >2.5s |
| LCP | <2.5s | >3.0s | >4.0s |
| CLS | <0.1 | >0.12 | >0.15 |
| API Response | <200ms | >250ms | >350ms |

### Resource Metrics
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Memory | Baseline | +10% | +20% |
| CPU Usage | Baseline | +15% | +25% |
| Disk Usage | Baseline | +5% | +10% |

## Performance Regression Report Template
```
## Performance Regression Analysis - [Date]

### Executive Summary
- Regressions Detected: 2
- Critical: 1
- High: 1
- Action Items: 2

---

## Critical Regressions 🔴

### 1. Build Time: +45% Regression
**Baseline**: 8 minutes
**Current**: 11 minutes 36 seconds
**Regression**: 3 minutes 36 seconds

**Root Cause**: PR#1245 - "Add new charting library"
**Commit**: abc1234 - "Import chart components"
**Author**: Alice Johnson
**Date**: Nov 10, 2024

**Analysis**:
- New dependency adds 2MB to bundle
- Webpack analysis shows increased parse time
- 3 new chunks generated (previously 1)

**Impact**:
- Build pipeline takes 36s longer
- Delays all CI/CD workflows
- Affects team velocity

**Recommended Fix**:
1. Code split the charting library (lazy load)
2. Tree-shake unused chart types
3. Consider lighter alternative (smaller bundle)

**Work Item**: [PERF-1247](link)

---

## High Regressions 🟡

### 2. Bundle Size: +12% Regression
**Baseline**: 195 KB
**Current**: 218 KB
**Regression**: 23 KB

**Root Cause**: PR#1242 - "Add analytics tracking"
**Commit**: def5678 - "Integrate analytics SDK"
**Author**: Bob Smith
**Date**: Nov 8, 2024

**Analysis**:
- New analytics library: 18 KB (uncompressed)
- Minified: 6.2 KB
- Gzipped: 2.1 KB
- Adds 2.1 KB to production bundle

**Impact**:
- Slight increase in download time (~200ms on 4G)
- More noticeable on slow networks
- Affects page load metrics

**Recommended Fix**:
1. Use CDN-hosted analytics instead
2. Implement dynamic import
3. Negotiate with analytics team on version

**Work Item**: [PERF-1248](link)

---

## Metrics Trend Analysis

### Build Time Trend
```
Week 1:  8m 00s ▓░░░░░░░░░
Week 2:  8m 15s ▓░░░░░░░░░ (Stable)
Week 3:  8m 45s ▓▓░░░░░░░░ (+7.5%)
Week 4:  11m 36s ▓▓▓▓░░░░░░ (+33%) ⚠️ REGRESSION
```

### Bundle Size Trend
```
Week 1:  180 KB ▓▓▓▓▓░░░░░
Week 2:  190 KB ▓▓▓▓▓▓░░░░ (+5.6%)
Week 3:  195 KB ▓▓▓▓▓▓░░░░ (+2.6%)
Week 4:  218 KB ▓▓▓▓▓▓▓▓░░ (+12%) ⚠️ REGRESSION
```

---

## By the Numbers

| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Avg Build Time | 10m 45s | 8m 30s | ⬆️ +26% |
| Avg Bundle Size | 205 KB | 192 KB | ⬆️ +7% |
| Avg Test Duration | 5m 30s | 5m 15s | ⬆️ +5% |
| FCP (Prod) | 1.8s | 1.5s | ⬆️ +20% |

---

## Root Cause Summary
- 60% caused by dependency additions
- 25% caused by increased functionality
- 15% caused by suboptimal code patterns

---

## Recommended Actions (Priority Order)

### Immediate (Today)
1. ✅ Review PR#1245 (build time)
   - Consider code splitting
   - Estimate: 2-4 hours

2. ✅ Review PR#1242 (bundle size)
   - Evaluate CDN alternative
   - Estimate: 1-2 hours

### Short Term (This Sprint)
1. Implement code splitting for charting
2. Migrate analytics to CDN
3. Rerun performance benchmarks

### Long Term (Next Sprint)
1. Establish performance budgets
2. Implement performance gates in CI
3. Train team on performance best practices

---

## Prevention Measures

### For Future PRs
- Include bundle size analysis in PR template
- Require performance review for large changes
- Enforce performance budget checks
- Run lighthouse audits in CI

### For Team
- Performance training for developers
- Regular performance sprints
- Monitor metrics continuously
- Celebrate performance wins

---

## Work Items Created
- PERF-1247: Optimize charting library loading
- PERF-1248: Reduce analytics bundle size

## Notifications Sent
- Notified Alice Johnson (PR#1245)
- Notified Bob Smith (PR#1242)
- Notified performance team
- Escalated to engineering lead
```

## Performance Profiling Tools

### Bundle Analysis
```
Tools: webpack-bundle-analyzer, source-map-explorer
Commands:
- npm run analyze:bundle
- npm run analyze:source-map
```

### Runtime Performance
```
Tools: Chrome DevTools, Lighthouse, WebPageTest
Metrics:
- Core Web Vitals (CWV)
- Custom metrics from RUM
- API performance metrics
```

### Build Performance
```
Tools: Build log analysis, performance timeline
Track:
- Each build stage duration
- Dependency resolution time
- Compilation time
- Test execution time
```

## Alert Thresholds
```
CRITICAL (Immediate):
- Build time >20% worse
- Bundle size >15% worse
- Test failures >5%
- API response >500ms

HIGH (This Sprint):
- Build time 10-20% worse
- Bundle size 10-15% worse
- API response 250-500ms

MEDIUM (Next Sprint):
- Build time 5-10% worse
- Bundle size 5-10% worse

LOW (Monitor):
- Build time <5% worse
- Bundle size <5% worse
```

## Integration Points
- Link to build pipeline
- Feed into quality dashboards
- Integrate with APM (Application Performance Monitoring)
- Connect to incident management
- Include in release notes

## Notes
- Run analysis after each build
- Compare against multiple baselines (daily, weekly)
- Consider external factors (CI runner load)
- Track performance across branches
- Document performance decisions
- Celebrate improvements
- Use data to inform architecture decisions
