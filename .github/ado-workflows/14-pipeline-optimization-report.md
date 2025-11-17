# Workflow 14: Pipeline Optimization Report

## Purpose
Analyze pipeline performance metrics to identify bottlenecks, measure stage-by-stage execution times, and provide specific optimization recommendations to improve build speed and efficiency.

## Use Cases
- **Performance Visibility**: Understand where time is spent
- **Bottleneck Identification**: Find slowest stages
- **Optimization Priority**: Focus efforts on highest impact
- **Trend Tracking**: Monitor improvements over time
- **Resource Planning**: Identify resource needs
- **Cost Optimization**: Reduce compute time and costs
- **Developer Productivity**: Faster feedback loops
- **Predictability**: Better build time forecasting

## Tools Required
| Tool | Purpose |
|------|---------|
| `mcp_azure-devops_pipelines_get_builds` | Get recent builds with timing |
| `mcp_azure-devops_pipelines_get_build_log_by_id` | Extract stage-by-stage timing |

## Process Steps

### Step 1: Get Recent Successful Builds
```
mcp_azure-devops_pipelines_get_builds
Parameters:
  - project: "dirtbike-shop"
  - statusFilter: 4  # Succeeded
  - resultFilter: 0  # Succeeded
  - queryOrder: "FinishTimeDescending"
  - top: 20
```
**Expected Output**: Last 20 successful builds with timestamps

### Step 2: Extract Build Logs
For each build:
```
mcp_azure-devops_pipelines_get_build_log_by_id
Parameters:
  - project: "dirtbike-shop"
  - buildId: <build-id>
  - logId: 1  # Main log
```
**Expected Output**: Build log with task execution details

### Step 3: Parse Stage Timing
From build logs, extract:
```
Stages to track:
1. Checkout: Git clone time
2. Setup: Dependency installation
3. Build: Compilation and bundling
4. Test: Unit and integration tests
5. Lint: Code quality checks
6. Security: Security scanning
7. Package: Create artifacts
8. Publish: Publish to storage
```

### Step 4: Calculate Metrics
```
For each stage:
- Duration (seconds)
- % of total build time
- Trend (vs. previous builds)

For entire build:
- Total time
- Queue time (waiting to start)
- Execution time
- Parallelization efficiency
```

### Step 5: Identify Slowest Stages
```
Top bottlenecks:
1. Stage: [Duration] [% of total]
2. Stage: [Duration] [% of total]
3. Stage: [Duration] [% of total]
```

### Step 6: Analyze Queue Time
```
Queue time analysis:
- Average queue time
- Max queue time
- Trend (increasing/decreasing)
- Impact on overall build time
- Build agent availability
```

### Step 7: Calculate Parallelization
```
Potential parallelization opportunities:
- Currently running in sequence: [stages]
- Could run in parallel: [stages]
- Time savings: [X minutes]
```

### Step 8: Generate Report
Create comprehensive optimization report.

## Success Criteria
✅ Pipeline metrics extracted accurately
✅ All stages identified and timed
✅ Bottlenecks clearly identified
✅ Queue time analyzed
✅ Parallelization opportunities found
✅ Specific recommendations provided
✅ Implementation guidance included
✅ Savings projections realistic

## Example Chat Command
```
@copilot
Analyze the last 20 DirtBike-Shop builds, identify the slowest stages, 
calculate queue vs execution time, and provide specific optimization 
recommendations to improve pipeline speed.
```

## Pipeline Optimization Report Template
```
# Pipeline Optimization Report - DirtBike-Shop
**Period**: Last 20 successful builds (Nov 1-14, 2024)
**Average Build Time**: 12 minutes 45 seconds
**Median Build Time**: 12 minutes 30 seconds
**Std Deviation**: 1 minute 15 seconds

---

## Executive Summary

| Metric | Value | Target | Opportunity |
|--------|-------|--------|-------------|
| Avg Build Time | 12m 45s | 10m | -21.25% |
| Queue Time | 2m 10s | <1m | -54% |
| Test Time | 5m 20s | 4m | -25% |
| Build Time | 3m 15s | 2m 30s | -23% |

**Overall Improvement Potential**: 3 minutes 45 seconds (29% faster)

---

## Build Stage Analysis

### Stage-by-Stage Breakdown

```
Pipeline Timeline (Average):

0:00    Checkout
        [████] 45 seconds (6%)

0:45    Install Dependencies
        [██████████] 2m 15s (18%)
        ⚠️ QUEUE TIME: 2m 10s (17%)

3:00    Lint & Format
        [███] 1m 10s (9%)

4:10    Build Application
        [█████] 3m 15s (26%)
        🔴 BOTTLENECK #1

7:25    Run Tests
        [██████████████] 5m 20s (42%)
        🔴 BOTTLENECK #2

12:45   Security Scan
        [██] 45s (6%)

13:30   Package & Publish
        [████] 1m 15s (10%)

Total: 12m 45s
```

---

## Bottleneck Analysis

### 🔴 CRITICAL BOTTLENECK #1: Test Execution
**Duration**: 5m 20s
**Percentage of Build**: 42%
**Trend**: Increasing (+15s vs. last week)

**Breakdown**:
- Unit tests: 2m 10s
- Integration tests: 2m 45s
- E2E tests: 0m 25s

**Root Cause Analysis**:
- Test suite has grown from 800 → 1200 tests
- No parallelization (runs sequentially)
- Some tests are slow (>1s each)
- Database setup time: 30s

**Opportunities**:
1. Parallelize tests (estimate: -2m 30s)
2. Remove slow tests from CI (keep in pre-commit)
3. Optimize database setup (estimate: -20s)
4. Mock external services (estimate: -30s)

**Effort to Fix**: Medium (2-3 hours)
**Time Savings**: 3 minutes 20 seconds (63%)
**Impact**: HIGH ⭐⭐⭐

---

### 🔴 CRITICAL BOTTLENECK #2: Build/Compilation
**Duration**: 3m 15s
**Percentage of Build**: 26%
**Trend**: Stable

**Breakdown**:
- TypeScript compilation: 1m 45s
- Webpack bundling: 1m 30s

**Root Cause Analysis**:
- TypeScript checking all files (no incremental build)
- Webpack not using tree-shaking
- Source maps generated for all builds
- No build cache

**Opportunities**:
1. Enable TypeScript incremental (estimate: -45s)
2. Enable tree-shaking (estimate: -30s)
3. Disable source maps in CI (estimate: -20s)
4. Implement build cache (estimate: -1m)

**Effort to Fix**: Low (1-2 hours)
**Time Savings**: 2 minutes 35 seconds (79%)
**Impact**: HIGH ⭐⭐⭐

---

### 🟡 SECONDARY BOTTLENECK: Dependency Installation
**Duration**: 2m 15s
**Percentage of Build**: 18%
**Trend**: Stable

**Breakdown**:
- npm install: 2m 10s
- Plus queue time: 2m 10s (total 4m 20s)

**Root Cause Analysis**:
- 450+ npm packages
- No lock file optimization
- Network latency
- CI runner location (far from npm registry)

**Opportunities**:
1. Implement npm cache (estimate: -1m 15s in cache hits)
2. Use npm ci instead of npm install (estimate: -20s)
3. Reduce dependencies (estimate: -30s)
4. Use CDN closer to runners (estimate: -15s)

**Effort to Fix**: Low (1 hour)
**Time Savings**: 2 minutes 20 seconds (cost: depends on cache hit rate)
**Impact**: MEDIUM ⭐⭐

---

### ⚠️ QUEUE TIME ANALYSIS
**Average Queue Time**: 2m 10s (17% of total time)
**Max Queue Time**: 4m 32s (build #1201)
**Min Queue Time**: 0m 15s (build #1210)

**Root Cause Analysis**:
- Only 2 parallel build agents
- Peak hours (10 AM - 12 PM): queue 3-4 minutes
- Off-peak hours (evenings): immediate start

**Opportunities**:
1. Add 2 more build agents (estimate: -2m queue time)
2. Prioritize certain builds (estimate: -1m for critical builds)
3. Implement build cancellation for obsolete PRs (estimate: -30s)

**Cost Impact**:
- 2 new agents: ~$200/month
- Savings: 2m * 25 builds/day = 50m/day = ~21 hours/month
- Payback: Strong ROI

**Effort to Fix**: Medium (2-4 hours infrastructure setup)
**Time Savings**: 2 minutes 10 seconds
**Impact**: MEDIUM ⭐⭐ (only if parallelizable)

---

## Timing Trend Analysis

### Build Time Trend (Last 20 Builds)
```
Build 1180: 12m 15s ▓░░░░░░░░░
Build 1190: 13m 20s ▓▓░░░░░░░░ (↑ +1m 5s)
Build 1195: 12m 45s ▓░░░░░░░░░ (↓ -35s)
Build 1198: 13m 00s ▓░░░░░░░░░ (↑ +15s)
Build 1200: 12m 30s ░░░░░░░░░░ (↓ -30s) Latest
```

**Trend**: Slightly increasing, trending toward 13m baseline
**Action**: Implement optimizations to reverse trend

### Component Trend (Last 20 Builds)
```
Test Time:     5m 05s → 5m 35s  (↑ +30s) INCREASING ⚠️
Build Time:    3m 10s → 3m 20s  (↑ +10s) Stable
Lint Time:     1m 00s → 1m 12s  (↑ +12s) Stable
Dependencies:  2m 10s → 2m 15s  (↑ +5s)  Stable
```

---

## Recommendations (Priority Order)

### 🔴 TIER 1: High Impact, Low Effort

#### 1. Enable Test Parallelization
**Current**: Tests run sequentially (5m 20s)
**After**: Run 4 tests in parallel (1m 45s)
**Savings**: 3m 35s
**Effort**: 2-3 hours
**Complexity**: Medium
**Risk**: Low (tests are independent)

**Implementation**:
```yaml
- Run tests in parallel with jest maxWorkers=4
- Configure separate test databases
- Ensure tests don't share state
- Add parallel CI configuration
```

**Estimated Savings**: 3 minutes 35 seconds (28% overall)

---

#### 2. Optimize TypeScript Compilation
**Current**: Full rebuild every time (1m 45s)
**After**: Incremental build (1m 00s)
**Savings**: 45 seconds
**Effort**: 1 hour
**Complexity**: Low
**Risk**: Very low

**Implementation**:
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

**Estimated Savings**: 45 seconds (6% overall)

---

#### 3. Disable Source Maps in CI
**Current**: Generate source maps for all builds
**After**: Skip in CI, only for releases
**Savings**: 20 seconds
**Effort**: 30 minutes
**Complexity**: Low
**Risk**: Very low

**Estimated Savings**: 20 seconds (3% overall)

---

### 🟠 TIER 2: High Impact, Medium Effort

#### 4. Implement Build Caching
**Current**: Rebuild everything
**After**: Cache intermediate results
**Savings**: 1m 00s (avg. cache hit)
**Effort**: 2-3 hours
**Complexity**: Medium
**Risk**: Medium (cache invalidation issues)

**Implementation**:
- Cache npm packages
- Cache webpack dist
- Cache compiled TypeScript
- Cache lint results

**Estimated Savings**: 1 minute (8% overall, when cache hits)

---

#### 5. Add Build Agents
**Current**: 2 agents, ~2m queue time
**After**: 4 agents, minimal queue
**Savings**: 2m queue time
**Cost**: $200/month
**Effort**: 2-4 hours
**Complexity**: Medium

**ROI**: Strong (2m saved * 25 builds/day = 50m/day)

**Estimated Savings**: 2 minutes (17% overall)

---

### 🟡 TIER 3: Lower Priority

#### 6. Reduce Dependency Size
**Current**: 450+ npm packages
**After**: Audit and remove unused (targeting 400)
**Savings**: 30 seconds
**Effort**: 4-6 hours
**Complexity**: High
**Risk**: Breaking changes

---

#### 7. Optimize Webpack Configuration
**Current**: Default configuration
**After**: Tuned for CI
**Savings**: 30 seconds
**Effort**: 2-3 hours
**Complexity**: Medium

---

## Implementation Roadmap

### Phase 1: Quick Wins (This Sprint)
**Effort**: 3-4 hours total
**Savings**: 1m 5s
**ROI**: Very high

1. ✅ Enable TypeScript incremental build
2. ✅ Disable source maps in CI
3. ✅ Setup build caching for npm

**Target Completion**: End of sprint
**Expected Result**: 12m 45s → 11m 40s

---

### Phase 2: Medium Term (Next Sprint)
**Effort**: 4-6 hours
**Savings**: 3m 35s
**ROI**: Very high

1. ✅ Parallelize tests
2. ✅ Implement full build cache
3. ✅ Optimize webpack config

**Target Completion**: 2 weeks
**Expected Result**: 11m 40s → 8m 05s

---

### Phase 3: Longer Term (Next Month)
**Effort**: 6-8 hours + infrastructure
**Savings**: 2m queue time
**Cost**: $200/month

1. ✅ Add 2 build agents
2. ✅ Reduce dependencies
3. ✅ Implement smart build cancellation

**Target Completion**: 4 weeks
**Expected Result**: 8m 05s → 6m 10s (off-peak)

---

## Success Metrics

### Current Baseline
| Metric | Value |
|--------|-------|
| Avg Build Time | 12m 45s |
| P95 Build Time | 14m 20s |
| Queue Time | 2m 10s |
| Test Time | 5m 20s |

### Phase 1 Target (In 1 week)
| Metric | Target | Improvement |
|--------|--------|-------------|
| Avg Build Time | 11m 40s | -8.2% |
| Test Time | 5m 20s | 0% (TBD) |
| Queue Time | 2m 10s | 0% |

### Phase 2 Target (In 3 weeks)
| Metric | Target | Improvement |
|--------|--------|-------------|
| Avg Build Time | 8m 05s | -36% |
| Test Time | 1m 45s | -67% |
| Queue Time | 2m 10s | 0% |

### Phase 3 Target (In 6 weeks)
| Metric | Target | Improvement |
|--------|--------|-------------|
| Avg Build Time | 6m 10s | -52% |
| Test Time | 1m 45s | -67% |
| Queue Time | 30s | -86% |

---

## Cost-Benefit Analysis

### Phase 1 (Quick Wins)
- Investment: 3-4 hours
- Savings: 1 minute per build
- Impact: 25 builds/day × 1 min = 25 min/day = 8.3 hours/month
- ROI: Immediate and high

### Phase 2 (Medium Term)
- Investment: 4-6 hours + time
- Savings: 3m 35s per build
- Impact: 25 builds/day × 3.58 min = ~90 min/day = 30 hours/month
- ROI: Very strong

### Phase 3 (Infrastructure)
- Investment: $200/month + 6-8 hours
- Savings: 2 minutes queue time
- Impact: 25 builds/day × 2 min = 50 min/day = 16.7 hours/month
- ROI: Payback in 1 month, ongoing benefit

**Total Investment**: ~13-18 hours + $200/month
**Total Savings**: ~54 minutes per build (73% improvement)
**Monthly Impact**: ~54 hours/month = +1.4 FTE developer productivity

---

## Monitoring & Tracking

### Metrics Dashboard
Track these metrics weekly:
- Average build time
- Build time trend
- Stage-by-stage timing
- Queue time
- Test duration
- Build cache hit rate

### Success Criteria
✅ 50% reduction in build time (target: 6-7 min)
✅ <1 min queue time (off-peak)
✅ 90% cache hit rate for dependencies
✅ Parallel test execution

---

## Implementation Checklist

- [ ] Review and approve optimization plan
- [ ] Phase 1: Implement quick wins
- [ ] Monitor results and gather metrics
- [ ] Phase 2: Implement parallelization
- [ ] Load test and verify
- [ ] Phase 3: Infrastructure upgrades
- [ ] Document final configuration
- [ ] Train team on new setup
```

## Key Performance Indicators (KPIs)

### Build Performance
- **Total Build Time**: Current + Target + Trend
- **Queue Time**: Waiting time before execution
- **Execution Time**: Actual build work
- **By-Stage Timing**: Each pipeline stage

### Efficiency Metrics
- **Build Time Trend**: Direction and rate of change
- **Variance**: Consistency of build times
- **Agent Utilization**: How fully agents are used
- **Cache Hit Rate**: Effectiveness of caching

### Cost Metrics
- **Cost per Build**: Infrastructure cost
- **Cost per Minute Saved**: ROI calculation
- **Cost of Queue Time**: Implicit developer waiting cost

## Optimization Techniques

| Technique | Savings | Effort | Risk |
|-----------|---------|--------|------|
| Parallelization | 40-60% | Medium | Low |
| Caching | 30-50% | Medium | Medium |
| Incremental builds | 20-30% | Low | Very Low |
| Infrastructure | 30-50% | High | Very Low |
| Dependency reduction | 10-20% | High | Medium |

## Best Practices
- Monitor continuously
- Profile before optimizing
- Focus on highest impact items
- Test changes in staging first
- Document configuration
- Train team on changes
- Celebrate improvements
