# Bonsai Decision Tree Custom Model – GitHub Copilot Demo Workflow

## Overview
This walkthrough demonstrates how data scientists can leverage GitHub Copilot to design, validate, and operationalize Bonsai decision tree custom models in any repository. The plan is intentionally tool- and project-agnostic so you can adapt it to different stacks while showcasing AI-assisted development for predictive decisioning use cases.

**Duration:** 20-30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Familiarity with decision trees, comfort with your project’s language/runtime, access to GitHub Copilot, and a workspace where you can add API or service logic

---

## What You’ll Build

A reusable workflow that:
- Captures requirements and constructs a Bonsai decision tree specification with Copilot
- Generates and validates Bonsai tree syntax
- Encodes Bonsai artifacts for downstream APIs or storage
- Integrates validation via the Custom Model Parser service
- Stores, tests, and documents the custom model within any codebase

---

## Demo Scenario: Adaptive Bid Optimizer (Customizable)

Use the example of a bid optimization model that responds to:
- **Region** or market segments
- **Time windows** such as business vs off-hours
- **Product categories** or other business dimensions
- **Supplier tiers** or customer status

Swap these dimensions with ones that better fit your data science narrative while following the same workflow.

---

## Step 1: Capture Requirements with GitHub Copilot

### 1.1 Draft a Model Specification

**Action:** Ask GitHub Copilot to produce a plain-language model brief (Markdown, JSON, or your preferred format) outlining tree structure, inputs, and expected outputs.

**Example Prompt:**
```
Create a Bonsai decision tree specification for a bid optimization model.
Include sections for:
- supported market regions (e.g., US:CA, US:NY, US:TX)
- business hour vs off-hour logic
- category multipliers for product types
- expected bid output range in USD
Summarize key assumptions and validation criteria.
```

### 1.2 Brainstorm Feature Signals

**Copilot Chat Prompt:**
```
List common feature signals I should consider for a Bonsai-based bid optimizer.
Highlight how each feature impacts pricing decisions.
```

Document insights in your demo notes so you can reference them while Copilot generates code.

---

## Step 2: Generate the Bonsai Decision Tree

### 2.1 Create the Base Tree File

**Action:** Add a Bonsai file in a location that matches your project conventions (for example, `<project-root>/models/bonsai/bid-optimizer.bonsai`).

**Example Prompt:**
```
Create a Bonsai decision tree that:
1. Bids $2.50 when region is US:CA during business hours (9-17)
2. Bids $1.80 for US:NY during business hours
3. Bids $1.20 for US:TX during business hours
4. Uses $0.80 for off-hours outside 9-17
5. Defaults to $1.00 otherwise
Use Bonsai syntax with tab indentation.
Include comments explaining each branch.
```

Review Copilot’s output, confirm tab indentation, and adjust thresholds to fit your scenario.

### 2.2 Layer Additional Dimensions

Enhance the tree with secondary logic (e.g., product categories, supplier tiers). Prompt Copilot to embed nested decisions rather than duplicating branches.

**Example Prompt:**
```
Extend the existing Bonsai tree to apply category multipliers:
- Electronics: base bid * 1.5
- Perishables: base bid * 2.0
- Standard: base bid
Use nested conditions and keep indentation valid.
```

---

## Step 3: Encode and Validate Formatting

### 3.1 Build a Bonsai Encoder Utility

Create a small script or service (language-agnostic) that:
1. Reads a Bonsai file from disk
2. Verifies tab indentation (rejects spaces)
3. Encodes the contents as Base64
4. Returns both raw and encoded text
5. Surfaces meaningful errors

**Example Prompt:**
```
Generate a utility that reads a Bonsai file, ensures tabs are used for indentation,
encodes it as Base64, and returns both versions. Include descriptive error handling.
```

### 3.2 Test the Encoder

Ask Copilot to scaffold tests aligned with your project’s testing framework (Vitest, Jest, Pytest, etc.). Cover valid encoding, indentation violations, empty files, large files, and special characters.

Run the tests using your project’s test command.

---

## Step 4: Integrate the Custom Model Parser

### 4.1 Create a Parser Client

Implement a client that calls the [Custom Model Parser Service](https://learn.microsoft.com/en-us/xandr/data-science-toolkit/custom-model-parser-service):
- Accepts the Base64-encoded Bonsai string
- Submits it to the parser endpoint
- Checks response size limits (< 3 MB)
- Returns parsed output (Lisp format) and validation status
- Adheres to your project’s HTTP and error-handling patterns

**Example Prompt:**
```
Generate a service client that posts a Base64 Bonsai payload to the Custom Model Parser API,
handles syntax or size errors, and returns the parsed Lisp structure.
Use axios/fetch (match project style) and strong TypeScript typings.
```

### 4.2 Add Parser Tests

Use Copilot to produce integration-style tests that mock parser responses and cover success, syntax failures, oversize payloads, and network errors.

---

## Step 5: Persist Custom Models

### 5.1 Define Storage Structures

Decide where models live (database, object storage, configuration files). Prompt Copilot to generate repository/data-access code that captures:
- Unique model identifier and name
- Author/advertiser or tenant metadata
- Base64-encoded text and original Bonsai source
- Model output type (e.g., bid, modifier)
- Active flags and timestamps

**Example Prompt:**
```
Create a repository class for persisting Bonsai models with CRUD operations.
Include validation for required fields and size limits.
```

### 5.2 Create or Update Schema

If using a relational database, have Copilot draft a migration that introduces a `custom_models` table (or equivalent). Ensure indexes support lookup patterns you need during the demo.

Run your database migration command and verify success.

---

## Step 6: Expose API or Service Endpoints

### 6.1 Implement Endpoints

Add REST, GraphQL, or RPC handlers that let consumers:
- Create models by submitting Bonsai code
- Trigger validation via the parser service
- Retrieve models by ID or tenant
- Update or deactivate models

**Example Prompt:**
```
Generate REST handlers for managing Bonsai models.
Include create, read, update, soft-delete, and validate endpoints.
Use the project’s error utilities and request validation patterns.
```

### 6.2 Write Endpoint Tests

Ask Copilot to generate tests (unit or integration) that exercise all flows, mock parser interactions, and assert validation behavior.

---

## Step 7: Optional Frontend or Tooling Integration

If your demo needs a UI:
- Scaffold a management interface for listing, editing, and validating models
- Integrate a lightweight code editor (e.g., CodeMirror, Monaco) for Bonsai syntax
- Surface validation errors and parser feedback in real time

Prompt Copilot to create components following your design system and testing approach (React Testing Library, Playwright, Cypress, etc.).

---

## Step 8: Document and Share

### 8.1 Update API Docs or Runbooks

Ask Copilot to extend your OpenAPI/Swagger docs or markdown runbooks with the new endpoints, request/response schemas, and example payloads.

### 8.2 Capture Demo Notes

Include a short narrative explaining:
- Business problem
- Key decision nodes in the tree
- Validation pipeline
- How Copilot accelerated each step

---

## Step 9: Test, Build, and Package

- Run automated tests across backend, frontend, and utilities
- Execute build pipelines (`npm run build`, `dotnet build`, `mvn package`, etc.)
- Confirm artifacts are ready for deployment or sharing

Highlight Copilot’s contributions when reviewing test files or build scripts it helped draft.

---

## Demo Talking Points

- **Code Generation:** Copilot drafts Bonsai syntax, utilities, repositories, and endpoints from natural-language prompts.
- **Testing:** Copilot scaffolds thorough unit and integration tests, ensuring model safety before deployment.
- **Consistency:** Generated code aligns with existing patterns (naming, error handling, typing).
- **Productivity:** Iterate quickly—refine prompts, accept suggestions, and keep human-in-the-loop validation.
- **Adaptability:** Same workflow applies to different domains—swap feature signals, storage layers, or UI stacks as needed.

---

## Common Issues & Mitigations

- **Indentation Errors:** Bonsai requires tabs; integrate the encoder utility or editor configuration to enforce this.
- **Oversized Models:** Parser rejects payloads >3 MB—prune tree depth or split logic across models.
- **Encoding Bugs:** Always encode using UTF-8 (e.g., Node’s `Buffer.from`, Python’s `base64` module) and include tests for special characters.

---

## Extensions and Variations

1. **Model Versioning:** Track revisions, compare performance, enable rollbacks.
2. **Analytics Hooks:** Log model usage and outcomes for offline evaluation.
3. **Visual Builders:** Pair the Bonsai workflow with graphical tree editors.
4. **Template Library:** Offer prebuilt Bonsai templates for common scenarios.
5. **Ensemble Strategies:** Combine multiple models with weighted logic or fallbacks.

Use Copilot to bootstrap each enhancement, keeping prompts explicit about the desired architecture and style.

---

## Resources

- [Create a Bonsai Decision Tree Custom Model](https://learn.microsoft.com/en-us/xandr/data-science-toolkit/create-a-bonsai-decision-tree-custom-model)
- [Bonsai Language Features](https://learn.microsoft.com/en-us/xandr/data-science-toolkit/bonsai-language-features)
- [Custom Model Parser Service](https://learn.microsoft.com/en-us/xandr/data-science-toolkit/custom-model-parser-service)
- [Custom Model Service](https://learn.microsoft.com/en-us/xandr/data-science-toolkit/custom-model-service)

Keep project-specific references (architecture docs, coding standards) handy so Copilot can align outputs perfectly.

---

## Demo Checklist

- [ ] Workspace cloned and dependencies installed
- [ ] GitHub Copilot enabled in editor
- [ ] Bonsai decision tree file created and reviewed
- [ ] Encoder utility and tests passing
- [ ] Parser client validated with sample payload
- [ ] Data persistence or repository layer implemented
- [ ] API/UI surfaces wired and documented
- [ ] Automated tests and build succeed
- [ ] Demo talking points rehearsed
- [ ] Backup snippets prepared in case Copilot needs guidance during live session

---

**Last Updated:** November 2025  
**Validated With:** GitHub Copilot (GPT-5-Codex Preview), VS Code, representative Node.js and Python toolchains
