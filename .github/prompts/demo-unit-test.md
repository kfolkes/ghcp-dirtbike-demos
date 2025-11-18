---
mode: 'agent'
description: 'Reusable Prompt: Add Unit Tests & Improve API Coverage for Demo Repositories.'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'githubRepo', 'problems', 'runCommands', 'runTasks', 'search', 'terminalLastCommand', 'testFailure', 'usages', 'playwright', 'github', 'Azure MCP Server']
---
# 🧪 Demo: Add Unit Tests & Coverage for Missing API Routes

## 📊 Current State
- Identify all existing test files in `src/routes/`
- List the route files without corresponding `.test.ts` files

## 🎯 Objective
Increase overall API test coverage by implementing comprehensive unit tests for ALL missing route files.

## 📋 Missing Test Files

### 🔗 Route Tests (High Priority)
Create unit test files for EVERY route file missing tests, following this checklist:
- [ ] `src/routes/<entity>.test.ts` for each uncovered entity

## ✅ Test Coverage Requirements

### For Each Route Test File:
- **CRUD Operations:**
  - ✅ GET all entities
  - ✅ GET single entity by ID
  - ✅ POST create new entity
  - ✅ PUT update existing entity
  - ✅ DELETE entity by ID

- **Error Scenarios:**
  - ❌ 404 for non-existent entities
  - ❌ 400 for invalid request payloads
  - ❌ 422 for validation errors
  - ❌ Edge cases (malformed IDs, empty requests)

## 🛠️ Implementation Guidelines

### Use Existing Pattern
Follow the testing pattern found in any existing `src/routes/*.test.ts` file. For example:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
```

### Test Structure Template
```typescript
describe('[Entity] API', () => {
    beforeEach(() => {
        // Setup app and reset data
    });

    it('should create a new [entity]', async () => { /* POST test */ });
    it('should get all [entities]', async () => { /* GET all test */ });
    it('should get a [entity] by ID', async () => { /* GET by ID test */ });
    it('should update a [entity] by ID', async () => { /* PUT test */ });
    it('should delete a [entity] by ID', async () => { /* DELETE test */ });
    it('should return 404 for non-existing [entity]', async () => { /* Error test */ });
});
```

## 🔧 Running Tests

```bash
# Run all API tests
npm run test:api

# Run with coverage
npm run test:api -- -- --coverage

# Run specific test file
npm run test:api -- src/routes/<entity>.test.ts
```

## 📈 Success Criteria
- [ ] Add missing route test files for all uncovered entities
- [ ] Achieve passing status for all new tests in CI/CD
- [ ] Improve the overall coverage report (`api/coverage/index.html`)

## 🚀 Getting Started
1. List route files lacking tests
2. For each, copy the test pattern from an existing route test file
3. Write basic CRUD tests first
4. Add error scenario tests
5. Run coverage and iterate until each test file covers all requirements
6. Reference ERD and other docs for entity relationships if available

## 📚 Related Files
- ERD Diagram: `api/ERD.png`
- Example test: `api/src/routes/branch.test.ts`
- Test config: `api/vitest.config.ts`
- Coverage report: `api/coverage/index.html`
