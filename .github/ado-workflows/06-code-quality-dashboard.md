# Workflow 6: Code Quality Dashboard

## Purpose
Generate comprehensive code quality metrics dashboard showing build success rates, test pass rates, code coverage, PR metrics, and code quality issues to track and improve overall product quality.

## Use Cases
- **Quality Tracking**: Monitor code quality trends over time
- **Team Health**: Assess team's coding practices and standards
- **Performance Metrics**: Track build times, test duration
- **Review Process**: Measure PR review effectiveness
- **Technical Debt**: Identify code quality issues and debt
- **Improvement Goals**: Set and track quality targets
- **Executive Reporting**: Provide stakeholders with quality metrics
- **Risk Assessment**: Identify risky areas in codebase

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_pipelines_get_builds` | Get recent builds with status and metrics |
| `mcp_azure-devops_testplan_show_test_results_from_build_id` | Extract test pass rates and coverage |
| `mcp_azure-devops_repo_list_pull_requests_by_repo_or_project` | Query PR metrics (review time, approval rate) |
| `mcp_azure-devops_search_code` | Search for code quality issues (console.log, TODO, FIXME) |

## Process Steps

### Step 1: Get Recent Builds
```
mcp_azure-devops_pipelines_get_builds
Parameters:
  - project: "dirtbike-shop"
  - queryOrder: "FinishTimeDescending"
  - top: 30
```
**Expected Output**: Last 30 builds with status, duration, and timestamps

### Step 2: Calculate Build Success Metrics
From builds data:
```
Metrics to calculate:
- Total Builds: [Count of last 30]
- Successful Builds: [Count with status = Succeeded]
- Failed Builds: [Count with status = Failed]
- Success Rate: (Successful / Total) * 100
- Average Build Time: Sum of durations / Total builds
- Queue Time: Average time waiting to build
- Trend: Compare to previous week/month
```

### Step 3: Extract Test Results
For recent successful builds:
```
mcp_azure-devops_testplan_show_test_results_from_build_id
Parameters:
  - project: "dirtbike-shop"
  - buildid: <build-id>
```
**Expected Output**: Test pass/fail counts, coverage percentage, test durations

### Step 4: Aggregate Test Metrics
```
Calculate:
- Total Tests: Sum of all tests run
- Passed Tests: Count of passing tests
- Failed Tests: Count of failing tests
- Skipped Tests: Count of skipped tests
- Test Pass Rate: (Passed / Total) * 100
- Code Coverage: Average coverage across builds
- Critical Tests: Count of critical/high-priority tests
- Test Execution Time: Average test suite duration
- Slowest Tests: Tests taking longest to run
```

### Step 5: Analyze Pull Requests
```
mcp_azure-devops_repo_list_pull_requests_by_repo_or_project
Parameters:
  - project: "dirtbike-shop"
  - status: "Completed"
  - top: 50
```
**Expected Output**: Completed PRs with review metrics

### Step 6: Calculate PR Metrics
```
From PR data, calculate:
- Total PRs Closed: [Count]
- Average Review Time: Calculate days from creation to completion
- Average Review Count: Total reviewers / PRs
- Approval Rate: PRs approved / Total PRs
- Comments Per PR: Average comments on completed PRs
- Rework Rate: PRs with multiple review iterations
- Time to Merge: Days from approval to merge
```

### Step 7: Search for Code Quality Issues
```
mcp_azure-devops_search_code
Parameters:
  - searchText: "console.log|TODO|FIXME|HACK|XXX|BUG"
  - project: ["dirtbike-shop"]
  - repository: ["<repo-name>"]
  - top: 50
```
**Expected Output**: Files with quality issues

### Step 8: Categorize Issues Found
```
- console.log statements: [Count]
- TODO comments: [Count]
- FIXME comments: [Count]
- HACK comments: [Count]
- Unused variables: [Estimate from search]
- Dead code: [Estimate from search]
- Long functions: [Identified areas]
- Code complexity: [High complexity areas]
```

### Step 9: Generate Dashboard Report
Compile all metrics into a comprehensive dashboard.

## Success Criteria
✅ Build metrics calculated
✅ Test results aggregated
✅ Code coverage tracked
✅ PR metrics measured
✅ Quality issues identified
✅ Trends identified
✅ Professional dashboard generated
✅ Actionable insights provided

## Example Chat Command
```
@copilot
Generate a code quality dashboard for DirtBike-Shop showing: recent 
build success rates, test pass rates, code coverage, average PR review 
time, and issues (TODOs, console.logs, etc).
```

## Dashboard Template
```
# Code Quality Dashboard - DirtBike-Shop

Report Generated: [Date]
Time Period: Last 30 Days

---

## 📊 Build Metrics
| Metric | Value | Trend | Status |
|--------|-------|-------|--------|
| Success Rate | 94.2% | ↑ +2.1% | ✅ Excellent |
| Total Builds | 47 | - | - |
| Average Build Time | 8m 23s | ↓ -15s | ✅ Good |
| Queue Time Avg | 1m 12s | ↑ +30s | ⚠️ Monitor |
| Failed Builds | 3 | ↓ -2 | ✅ Good |

### Build Timeline
```
Week of Nov 1:  ████████████████ 88%
Week of Nov 8:  ██████████████████ 94%
Week of Nov 15: ████████████████ 88%
```

---

## ✅ Test Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total Tests | 823 | - | - |
| Pass Rate | 96.8% | ≥95% | ✅ Passing |
| Failed Tests | 26 | ≤30 | ✅ Good |
| Code Coverage | 82.4% | ≥80% | ✅ Good |
| Test Execution | 4m 32s | ≤5m | ✅ Good |

### Test Trends
- Last Week: 95.2%
- This Week: 96.8%
- Trend: ↑ Improving

### Slowest Tests (Top 5)
1. Integration test suite: 2m 14s
2. API endpoint tests: 1m 08s
3. Component rendering: 45s
4. Database queries: 32s
5. Authentication flow: 28s

---

## 🔍 Code Review Metrics
| Metric | Value | Average | Status |
|--------|-------|---------|--------|
| Avg Review Time | 18.5 hrs | Target: <24hrs | ✅ Good |
| Average Reviewers | 2.1 | Target: ≥2 | ✅ Good |
| Approval Rate | 92% | Target: ≥90% | ✅ Good |
| PRs Closed | 24 | - | - |
| Rework Rate | 8% | Target: <10% | ✅ Good |

### Review Turnaround
- 0-4 hours: 45%
- 4-24 hours: 38%
- 24+ hours: 17%

---

## 🐛 Code Quality Issues

### Issues Found
- console.log statements: 12
- TODO comments: 8
- FIXME comments: 5
- HACK comments: 2
- Unused variables: 4

### Top Problem Areas
1. **src/components/Cart.tsx**: 4 console.log, 2 TODOs
2. **src/hooks/useSearch.ts**: 2 FIXMEs
3. **src/pages/AdminDashboard.tsx**: 3 console.log
4. **src/data/bikes.ts**: 2 HACKs

### Recommendations
- Remove debug console.log statements
- Address TODOs before next release
- Refactor identified FIXME areas
- Review HACK comments for better solutions

---

## 📈 Trends & Analysis

### Build Success Trend
```
Week 1:  90% ▓░░░░░░░░░░
Week 2:  91% ▓▓░░░░░░░░░
Week 3:  94% ▓▓▓▓░░░░░░░ ↑ Improving
Week 4:  94% ▓▓▓▓░░░░░░░
```

### Test Coverage Trend
```
Sep:  78% █████████░░░░░░░░░░
Oct:  80% ███████████░░░░░░░░░
Nov:  82% █████████████░░░░░░░ ↑ Improving
```

### Review Time Trend
```
Month 1: 24.2 hrs
Month 2: 21.5 hrs
Month 3: 18.5 hrs ↓ Improving
```

---

## ⚠️ Risk Assessment

### High Risk Areas
- AdminDashboard component: Multiple quality issues
- Search hook: Unresolved FIXMEs

### Critical Failures (Last 30 Days)
1. Build 1247: Compilation error in Cart.tsx (Oct 28)
2. Build 1238: Test suite timeout (Oct 24)
3. Build 1229: Missing environment variable (Oct 15)

### Mitigation Recommended
- Code review for high-risk areas
- Add linting rules for console.log
- Schedule refactoring sprint for FIXMEs

---

## 🎯 Quality Goals & Progress

| Goal | Target | Current | Status | Progress |
|------|--------|---------|--------|----------|
| Build Success | 95% | 94.2% | ⚠️ | 99% |
| Test Coverage | 85% | 82.4% | ⚠️ | 97% |
| Review Time | <20hrs | 18.5hrs | ✅ | 108% |
| Zero Critical Issues | - | 0 | ✅ | On Track |

---

## 📋 Recommendations

1. **Immediate Actions**
   - Remove 12 console.log statements
   - Review 2 HACK comments in bikes.ts
   - Address failing tests

2. **Short Term (1-2 weeks)**
   - Resolve all TODO comments
   - Fix identified FIXME items
   - Improve test execution time

3. **Long Term (1-3 months)**
   - Increase code coverage to 85%
   - Reduce average review time to <16 hours
   - Establish code quality standards
   - Implement automated code analysis

---

## 📞 Next Steps
- Team review of dashboard (scheduled)
- Action items assignment
- Progress tracking weekly
- Goal adjustments if needed
```

## Key Performance Indicators (KPIs)

### Build Quality
- **Success Rate**: % of builds that pass
- **Build Duration**: How long builds take
- **Queue Time**: Wait time before build starts

### Test Quality
- **Pass Rate**: % of tests passing
- **Code Coverage**: % of code covered by tests
- **Test Duration**: How long test suite takes

### Development Quality
- **Review Time**: Days from PR creation to merge
- **Review Count**: Number of reviewers per PR
- **Rework Rate**: % of PRs needing changes

### Code Quality
- **Issues Count**: Technical debt items found
- **Issue Severity**: Distribution of severity levels
- **Issue Density**: Issues per 1000 lines of code

## Benchmarking
| Metric | Excellent | Good | Average | Poor |
|--------|-----------|------|---------|------|
| Build Success | >98% | 95-98% | 90-95% | <90% |
| Test Pass Rate | >99% | 95-99% | 90-95% | <90% |
| Code Coverage | >90% | 80-90% | 70-80% | <70% |
| Review Time | <12hrs | 12-24hrs | 24-48hrs | >48hrs |

## Automation Considerations
- Run daily for trend analysis
- Generate weekly reports
- Alert on quality regressions
- Track metrics over time
- Compare to industry benchmarks
- Identify and reward improvements
- Use data to inform process improvements

## Notes
- Quality metrics should be monitored continuously
- Set realistic goals based on team size and complexity
- Celebrate improvements and successes
- Use data objectively to guide decisions
- Balance speed with quality
- Involve team in setting and reviewing goals
