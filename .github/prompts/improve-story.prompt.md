# How to Improve an ADO Story/Issue - LLM Guide

This guide teaches LLMs (including Copilot) how to systematically analyze and improve Azure DevOps work items by examining the actual codebase, identifying gaps, and providing comprehensive improvement recommendations.

---

## 📋 Overview

When given an ADO work item, follow this structured process to provide substantial value:

1. **Retrieve the work item** from ADO
2. **Explore the codebase** to understand current state
3. **Analyze the code** against the work item requirements
4. **UPDATE ADO ITEM THROUGH MCP, DO NOT CREATE ANY DOCS** for improvement

---

## Step 1: Retrieve the Work Item

**What to do:**
- Use `mcp_azure-devops_wit_get_work_item` to fetch the issue/story
- Note the title, description, effort, priority
- Look for linked code/PRs/branches

**Commands:**
```
mcp_azure-devops_wit_get_work_item({
  id: {ISSUE_NUMBER},
  project: "DirtBike-Shop",
  expand: "all"
})
```

**What to look for:**
- Is the description clear and measurable?
- Are acceptance criteria defined?
- Are there linked artifacts (branches, commits, PRs)?
- What's the current state (To Do, Doing, Done)?

---

## Step 2: Map the Codebase

**What to do:**
- Identify which files are relevant to the work item
- Use `list_dir` to understand project structure
- Use `file_search` or `grep_search` to locate related code

**Key questions:**
- Which React components are affected?
- Are there related hooks or utilities?
- What types are involved?
- Are there existing tests?

**Example search patterns:**
```
Search: "cart", "checkout", "payment" (depending on story)
Look for: components, hooks, types, tests
```

---

## Step 3: Analyze Current Implementation

**What to do:**
- Read relevant files using `read_file`
- Understand the current state of implementation
- Look for gaps between story requirements and code reality

**Analysis checklist:**
- [ ] Is this feature already partially implemented?
- [ ] What parts are missing?
- [ ] Are there bugs in existing code?
- [ ] Is error handling present?
- [ ] Are there type safety issues?
- [ ] Is the code tested?
- [ ] Is accessibility considered?
- [ ] Are there performance concerns?

---

## Step 4: Analyze and Update ADO Item Directly

**⚠️ CRITICAL: Do NOT create separate improvement documents**

Instead, update the ADO work item fields directly. This ensures:
- Developers read requirements from the work item itself (single source of truth)
- No duplicate information scattered across files/documents
- Clear, focused acceptance criteria developers will actually check off
- Comments reserved only for post-mortems on Done items

**What to put in Description field:**
```markdown
## Current Problem
[What's broken or needs improvement - specific, not vague]

## Implementation Approach
### Phase 1: [Name]
[What to build, which files, specific structure]

### Phase 2: [Name]
[Next steps with file locations]

## Key Benefits
[Why this matters - 2-3 bullets max]
```

**What to put in Acceptance Criteria field:**

Organize into categories with checkbox items. Each must be:
- **Testable**: Can verify with a test
- **Specific**: References files, line numbers, or exact behavior
- **Measurable**: "No prop drilling" not "improve code"

```markdown
### Code Structure
- [ ] File X created at location Y with interface/class Z
- [ ] Feature A implemented using pattern B in file C

### Component Changes
- [ ] Component X updated to use hook Y instead of prop Z
- [ ] Component X receives zero props for feature Y

### Functionality Preservation
- [ ] Feature A still works with single item
- [ ] Feature A still works with multiple items
- [ ] Edge case X handled correctly

### Type Safety & Performance
- [ ] No `any` types in new code
- [ ] useMemo/useCallback applied where appropriate
- [ ] Context/memoization prevents unnecessary re-renders

### Testing
- [ ] Unit tests cover X behavior
- [ ] Integration tests verify end-to-end workflow
- [ ] Error case: useHook throws outside provider
```

**Key patterns learned:**

✅ **DO:**
- Put code examples directly in Description (show what to build)
- Include file paths and locations
- Specify multi-phase approach with clear boundaries
- Break criteria into 4-5 categories (Structure, Components, Functionality, Type Safety, Testing)
- Link related work items if dependencies exist
- Update Effort if analysis reveals complexity change
- Use checkboxes so developers literally check them off during implementation

❌ **DON'T:**
- Create external markdown documents with analysis
- Put vague acceptance criteria like "refactor the code"
- Leave ambiguity about which files to create/modify
- Forget to include edge cases or error scenarios
- Skip testing requirements
- Assume developers will research context - spell it out

---

## Step 5: Make It Specific

**Don't just identify problems - show solutions:**

❌ VAGUE:
```
"The cart component needs improvement"
```

✅ SPECIFIC:
```
"In Cart.tsx line 42, the averageRating calculation divides by totalItems (quantity sum) 
instead of cartItems.length (unique items). This causes incorrect averages when the same 
bike is added multiple times. Fix by changing:

  return totalRating / totalItems;  // ❌ Wrong
TO:
  return totalRating / cartItems.length;  // ✅ Correct

This affects line 48 in useCart.ts where averageRating is computed."
```

---

## Step 6: Provide Code Examples

**Format:**
1. **Current code** (with line numbers if possible)
2. **The problem** (annotated in code)
3. **The fix** (highlighted)
4. **Why it matters**

**Template:**
```markdown
### Problem: [Name]
**Location:** `src/path/file.tsx` lines 10-20

**Current Code:**
\`\`\`tsx
// ❌ This is wrong because...
const result = items.reduce((sum, item) => sum + item.value, 0) / items.length;
\`\`\`

**Issues:**
- Line 15: Empty array causes division by zero
- Not handling null items

**Improved Code:**
\`\`\`tsx
// ✅ This is correct because...
const result = items.length === 0 
  ? 0 
  : items.reduce((sum, item) => sum + item.value, 0) / items.length;
\`\`\`

**Benefits:**
- Handles empty state
- No runtime errors
- Clear intent
```

---

## Step 7: Include Testing Strategy

**For each improvement, specify:**

```markdown
### Test Cases

**Unit Tests:**
- [ ] Test with empty state
- [ ] Test with single item
- [ ] Test with multiple items
- [ ] Test edge cases

**E2E Tests:**
- [ ] Test user workflow A
- [ ] Test user workflow B
- [ ] Test error scenarios

**Manual Tests:**
- [ ] Visual regression
- [ ] Responsiveness
- [ ] Accessibility
```

---

## Step 8: Consider These Angles

When analyzing code, consider:

### Performance
- Is memoization used correctly?
- Are there unnecessary re-renders?
- Could computations be optimized?
- Is bundle size impacted?

### Accessibility (WCAG 2.1 AA)
- Are ARIA labels present and correct?
- Is keyboard navigation supported?
- Are focus states visible?
- Is semantic HTML used?

### Type Safety (TypeScript)
- Are there any `any` types?
- Are generics used appropriately?
- Are types exported and reusable?
- Could discriminated unions improve safety?

### Error Handling
- What happens on network failure?
- What happens with bad data?
- Are errors user-friendly?
- Is logging in place for debugging?

### Testing Coverage
- Are there unit tests?
- Are there E2E tests?
- What's the coverage percentage?
- Are edge cases tested?

### User Experience
- Is the flow clear?
- Are states communicated (loading, error, empty)?
- Is the interface intuitive?
- Are there unnecessary steps?

---

## Step 9: Link to Existing Work Items

When providing recommendations, link to related ADO items:

```markdown
### Related Issues
- Relates to: #[number] - [Title]
- Blocks: #[number] - [Title]
- Depends on: #[number] - [Title]
- Fixes: #[number] - [Title]
```

---

## Step 10: Update ADO Work Item Fields Directly (PRIMARY OBJECTIVE)

**THIS IS THE MAIN DELIVERABLE - Not external documents or comments**

After analyzing the codebase, use `mcp_azure-devops_wit_update_work_item` to update:

1. **System.Description** - Enhanced problem description + implementation approach
2. **Microsoft.VSTS.Common.AcceptanceCriteria** - Testable, specific checkboxes
3. **Microsoft.VSTS.Scheduling.Effort** - Adjust if complexity differs from estimate

### Description Field Template

**⚠️ USE HTML, NOT MARKDOWN** - ADO renders HTML, not markdown

Structure it to guide developers through implementation:

```html
<h2>Current Problem</h2>
<p>Specific issue: what's broken, prop drilling pattern, tight coupling, etc.</p>
<p>Include concrete examples: "7 props passed from App → Cart"</p>

<h2>Implementation Approach</h2>

<h3>Phase 1: [Name]</h3>
<p><strong>File:</strong> <code>src/path/file.tsx</code></p>
<p>What to build, structure, interfaces</p>

<h3>Phase 2: [Name]</h3>
<p><strong>File:</strong> <code>src/path/file.tsx</code></p>
<p>Next steps</p>

<h2>Key Benefits</h2>
<ul>
<li>Benefit 1</li>
<li>Benefit 2</li>
<li>Benefit 3</li>
</ul>
```

### Acceptance Criteria Field Template

**Organize into categories** - each checkbox is one task a developer checks off:

```markdown
### Code Structure
- [ ] File X created with interface/class Y
- [ ] Implementation uses pattern Z

### Component Refactoring  
- [ ] Component X updated to use hook instead of props
- [ ] Component Y receives zero props for feature Z

### Functionality Preservation
- [ ] Feature A still works (single item case)
- [ ] Feature A still works (multiple items case)
- [ ] Edge case X handled

### Type Safety & Performance
- [ ] No `any` types in new code
- [ ] useMemo/useCallback applied to calculations
- [ ] Context prevents re-render cascades

### Testing
- [ ] Unit tests for provider/hook
- [ ] Integration tests for workflows
- [ ] Error case: hook throws outside provider
```

### Example: Real Implementation

**Problem Item**: Work Item #51 - "Refactor: Extract cart logic to separate context"

**BEFORE** (vague):
- Description: "Move cart state to Context"
- Criteria: "Implement context" (ambiguous - developer guesses)

**AFTER** (specific, actionable):
- Description: Lists 4 phases with exact file paths, shows CartContextType interface, explains prop drilling problem with concrete numbers (7 props)
- Criteria: 26 checkboxes organized into 5 categories, each specific ("Cart.tsx: Updated to use `const { items, totalItems } = useCart();` instead of props")

Result: Developer knows exactly what to build, where to build it, and how to verify it's done.

### Commands to Update

```typescript
mcp_azure-devops_wit_update_work_item({
  id: 51,
  updates: [
    {
      path: "/fields/System.Description",
      value: "# [Enhanced Title]\n\n## Current Problem\n[Specific issue with examples]\n\n## Implementation Approach\n### Phase 1: [Name]\n[Details]",
    },
    {
      path: "/fields/Microsoft.VSTS.Common.AcceptanceCriteria",
      value: "### Code Structure\n- [ ] Item 1\n\n### Component Changes\n- [ ] Item 2",
    },
    {
      path: "/fields/Microsoft.VSTS.Scheduling.Effort",
      value: "8"  // Update if analysis reveals complexity change
    }
  ]
})
```

**When to Add Comments (Only for Done items)**

Use `mcp_azure-devops_wit_add_work_item_comment` ONLY if state is "Done":
- Implementation notes discovered during development
- Test coverage summary
- Known limitations or follow-up items
- Performance metrics

```typescript
mcp_azure-devops_wit_add_work_item_comment({
  project: "DirtBike-Shop",
  workItemId: 51,
  comment: "# Implementation Complete\n\n## Summary\n[What was built]\n\n## Test Coverage\n[Unit/E2E results]",
})
```

---

## Step 11: Link Related Work Items (Optional)

**What to do:**
- Use `mcp_azure-devops_wit_work_items_link` to connect related issues
- Link dependencies, blockers, or related features

**Command:**
```
mcp_azure-devops_wit_work_items_link({
  project: "DirtBike-Shop",
  updates: [
    {
      id: {ISSUE_NUMBER},
      linkToId: {RELATED_ISSUE_NUMBER},
      type: "related"  // or "depends on", "blocks", etc.
    }
  ]
})
```

---

## Step 12: Provide a Clear Next Action

**End with:**
```markdown
## Next Steps

1. **Update the Work Item in ADO:**
   - Update Description field with clarified requirements
   - Update Acceptance Criteria field with specific, testable criteria
   - Adjust Effort/Priority if complexity differs from estimate
   - Link any related issues

2. **For the Developer:**
   - Review the updated acceptance criteria
   - Start with: [Most important first]
   - Then: [Second priority]
   - Finally: [Nice to have]

3. **For the Code Reviewer:**
   - Verify implementation meets updated acceptance criteria
   - Focus on: [Critical aspects]
   - Watch for: [Common mistakes]
   - Verify: [Edge cases]

4. **For the QA Tester:**
   - Test all acceptance criteria
   - Test: [Primary scenarios]
   - Verify: [Edge cases]
   - Check: [Regressions]
```

---

## Tool Reference: Updating ADO Items

### Primary: Updating Work Item Fields (for To Do/Doing items)
```typescript
mcp_azure-devops_wit_update_work_item({
  id: 57,
  updates: [
    {
      path: "/fields/System.Description",
      value: "# Clarified Requirements\n\n## Current Issue\n[Issue description]\n\n## Specific Requirements\n- Requirement 1\n- Requirement 2",
      format: "markdown"
    },
    {
      path: "/fields/Microsoft.VSTS.Common.AcceptanceCriteria",
      value: "- [ ] Criterion 1 - testable and specific\n- [ ] Criterion 2 - measurable and clear\n- [ ] Criterion 3 - linked to code location",
      format: "markdown"
    },
    {
      path: "/fields/Microsoft.VSTS.Scheduling.Effort",
      value: "5"  // Update if analysis reveals different complexity
    }
  ]
})
```

### Secondary: Adding Comments (Only for Done items)
```typescript
mcp_azure-devops_wit_add_work_item_comment({
  project: "DirtBike-Shop",
  workItemId: 57,
  comment: "# Implementation Complete\n\n## Test Coverage\n- Unit tests: X%\n- E2E tests: Covered\n\n## Known Limitations\n[If any]\n\n## Follow-up Items\n- Related to: #XX",
  format: "markdown"
})
```

### Linking Work Items
```typescript
mcp_azure-devops_wit_work_items_link({
  project: "DirtBike-Shop",
  updates: [
    {
      id: 57,
      linkToId: 58,
      type: "depends on",
      comment: "This implementation depends on completing the auth system"
    }
  ]
})
```

---

## Updated Workflow: Analyze → Update → Link

### Complete Process:
1. Retrieve work item from ADO
2. Explore codebase and current state
3. Analyze against requirements
4. Create detailed improvement recommendations
5. **Update the work item's Description and Acceptance Criteria fields directly**
6. **If story is Done: add a comment with implementation notes**
7. **Link any related issues**
8. **Adjust effort/priority if analysis reveals complexity changes**

This ensures the work item itself contains clear, actionable requirements for developers before they start coding.

---

## Example: Complete Analysis Cycle

### Given:
Work Item #41: "Fix: Cart total calculation incorrect with multiple items"

### Step 1: Get the item
```
Retrieve ADO item #41
Current state: To Do
Description: "Cart shows wrong total when adding multiple of same bike"
```

### Step 2: Map code
```
Search for: "cart", "total", "calculation"
Found: useCart.ts, Cart.tsx
```

### Step 3: Read and analyze
```
Read: src/hooks/useCart.ts
Identify: totalPrice calculation seems correct
But: averageRating uses totalItems not cartItems.length
```

### Step 4: Create improvement doc
```
- Document current code with issue
- Show what's wrong (line reference)
- Provide corrected code
- Specify tests needed
- Explain impact on user
```

### Step 5: Be specific
```
Don't say: "Fix the rating calculation"
Say: "Line 52 in useCart.ts divides sum of ratings by totalItems 
     (quantity sum) instead of cartItems.length (unique bikes).
     When adding 2x same bike, average should be that bike's rating,
     not affected by quantity. Change: return totalRating / totalItems
     to: return totalRating / cartItems.length"
```

---

## Quality Checklist

Before finalizing your improvement document:

- [ ] **Specific**: Every issue has a file and line number
- [ ] **Actionable**: Each recommendation includes code examples
- [ ] **Tested**: Test cases are specified for each change
- [ ] **Linked**: Related work items are referenced
- [ ] **Prioritized**: Changes are ordered by impact
- [ ] **Realistic**: Estimates are provided
- [ ] **Accessible**: WCAG compliance is considered
- [ ] **Typed**: TypeScript implications are noted
- [ ] **Documented**: Code changes are well-explained
- [ ] **Reviewed**: The analysis makes sense

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Suggest changes without seeing the code
- Provide vague recommendations ("refactor this")
- Ignore accessibility requirements
- Skip error handling discussion
- Forget to mention testing
- Make assumptions about requirements
- Ignore existing good practices
- Forget to link to related issues

✅ **Do:**
- Show exact code locations
- Provide working code examples
- Test for WCAG 2.1 AA compliance
- Always include error handling
- Specify test cases
- Ask for clarification if confused
- Build on existing patterns
- Link related issues and epics

---

## Tools to Use

| Tool | Purpose | When to Use |
|------|---------|-----------|
| `mcp_azure-devops_wit_get_work_item` | Fetch issue details | Step 1 |
| `list_dir` | Explore structure | Step 2 |
| `file_search` | Find relevant files | Step 2 |
| `grep_search` | Search file contents | Step 2 |
| `read_file` | Read code files | Step 3 |
| `mcp_azure-devops_repo_search_commits` | Find related commits | Step 2 |
| `mcp_azure-devops_repo_list_pull_requests_by_repo_or_project` | Find related PRs | Step 2 |
| `mcp_azure-devops_wit_work_items_link` | Link related issues | Step 10 |

---

## Summary Template

Use this template when summarizing your findings:

```markdown
# Work Item #[NUMBER]: [TITLE]

## Summary
[One paragraph overview of the issue and your analysis]

## Current State
[What exists now, any partial implementation]

## Key Findings
1. [Finding 1 with specifics]
2. [Finding 2 with specifics]
3. [Finding 3 with specifics]

## Recommendations
### Priority 1: [Change 1]
[Specific code change with example]

### Priority 2: [Change 2]
[Specific code change with example]

## Testing Strategy
[How to verify changes work]

## Implementation Estimate
[Time to complete each recommendation]

## Related Work Items
[Links to ADO items]
```

---

## Closing Notes

**Remember:**
- The goal is to help developers implement features BETTER, not just implement them
- **Work items should be the source of truth** - update them directly, don't just comment
- **Developers should understand requirements from the work item itself**, not from additional research
- Specific beats vague every time
- Code examples in descriptions help developers understand the "why"
- Testing is not optional
- Accessibility is not a nice-to-have
- Performance matters
- Comments are for post-mortems on Done items, not pre-implementation analysis
- The best improvement is the one that gets implemented with clarity

---

*Last Updated: November 10, 2025*  
*For: Expert React Frontend Engineer LLMs*  
*Using: GitHub Copilot and Azure DevOps MCP*
