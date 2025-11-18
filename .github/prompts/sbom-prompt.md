# SBOM Generation Workflow (Local/Generic)

## Overview
This document provides a **generic, repo-agnostic process** for generating Software Bill of Materials (SBOM) files locally for any software project. SBOMs provide transparency into the software supply chain by documenting all dependencies and components.

This workflow is designed for **local generation** and does not require Azure DevOps, GitHub Actions, or any specific CI/CD platform.

---

## What is an SBOM?

A Software Bill of Materials (SBOM) is a comprehensive inventory of all software components, libraries, and dependencies used in an application. It's essential for:
- **Supply chain security** and transparency
- **Vulnerability tracking** and remediation
- **Compliance** with security standards (e.g., NTIA, Executive Order 14028)
- **License compliance** and auditing
- **Software composition analysis**

---

## Prerequisites

### 1. Install SBOM Generation Tool

Choose the tool that best fits your project ecosystem:

#### **Option A: Microsoft SBOM Tool** (Recommended for .NET/Node.js)

```bash
# Install via .NET CLI
dotnet tool install --global Microsoft.Sbom.DotNetTool

# Verify installation
sbom-tool --version
```

**Supported Package Managers:**
- npm/yarn/pnpm (Node.js)
- NuGet (.NET)
- pip/conda (Python)
- Maven/Gradle (Java)
- CocoaPods (iOS)
- Go modules

#### **Option B: Syft** (Multi-language, container support)

```bash
# macOS/Linux
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Windows (PowerShell)
iwr -useb https://raw.githubusercontent.com/anchore/syft/main/install.sh | iex

# Verify installation
syft version
```

#### **Option C: CycloneDX CLI** (OWASP standard)

```bash
# For Node.js projects
npm install -g @cyclonedx/cyclonedx-npm

# For Python projects
pip install cyclonedx-bom

# For Java/Maven projects
# Use the CycloneDX Maven plugin in pom.xml

# Verify installation
cyclonedx-npm --version
```

### 2. Ensure Project Dependencies are Installed

Before generating an SBOM, install all project dependencies:

```bash
# Node.js/npm
npm install
# or for monorepos
npm ci

# Python
pip install -r requirements.txt

# Java/Maven
mvn install

# .NET
dotnet restore

# Go
go mod download
```

---

## SBOM Generation Methods

### Method 1: Microsoft SBOM Tool (Cross-platform)


#### Basic Syntax

```bash
sbom-tool generate \
  -b <build-directory> \
  -bc <component-directory> \
  -pn "<package-name>" \
  -pv "<version>" \
  -ps "<supplier/organization>" \
  -nsb <namespace-uri> \
  -V Verbose \
  -pm <package-manager> \
  -D true
```

#### Parameter Reference

| Parameter | Flag | Description | Example |
|-----------|------|-------------|---------|
| BuildDropPath | `-b` | Directory containing build artifacts | `./`, `./api`, `./dist` |
| BuildComponentPath | `-bc` | Directory to scan for components | `./`, `./src` |
| PackageName | `-pn` | Name of your package/application | `"MyApp"`, `"MyApp-API"` |
| PackageVersion | `-pv` | Version of your package | `"1.0.0"`, `"2.3.4-beta"` |
| PackageSupplier | `-ps` | Organization/supplier name | `"MyCompany"`, `"ACME Corp"` |
| NamespaceUriBase | `-nsb` | Base URI for SBOM namespace | `https://mycompany.com/myapp` |
| Verbosity | `-V` | Logging verbosity | `Verbose`, `Information`, `Error` |
| PackageManager | `-pm` | Package manager type | `Npm`, `NuGet`, `PyPI`, `Maven`, `Gradle` |
| DeleteManifestDirIfPresent | `-D` | Delete existing manifest dir | `true` or `false` |

#### Examples for Different Project Types

##### **Single Node.js Project**

```bash
sbom-tool generate \
  -b . \
  -bc . \
  -pn "MyApplication" \
  -pv "1.0.0" \
  -ps "MyCompany" \
  -nsb https://mycompany.com/myapp \
  -V Verbose \
  -pm Npm \
  -D true

# Output: _manifest/spdx_2.2/manifest.spdx.json
# Move to desired location:
mv _manifest/spdx_2.2/manifest.spdx.json sbom.json
```

##### **Python Project**

```bash
sbom-tool generate \
  -b . \
  -bc . \
  -pn "MyPythonApp" \
  -pv "2.0.0" \
  -ps "ACME Corp" \
  -nsb https://acme.com/python-app \
  -V Verbose \
  -pm PyPI \
  -D true

mv _manifest/spdx_2.2/manifest.spdx.json python-sbom.json
```

##### **.NET Project**

```bash
sbom-tool generate \
  -b ./bin/Release \
  -bc . \
  -pn "MyDotNetApp" \
  -pv "3.1.0" \
  -ps "MyCompany" \
  -nsb https://mycompany.com/dotnet-app \
  -V Verbose \
  -pm NuGet \
  -D true

mv _manifest/spdx_2.2/manifest.spdx.json dotnet-sbom.json
```

##### **Java/Maven Project**

```bash
sbom-tool generate \
  -b ./target \
  -bc . \
  -pn "MyJavaApp" \
  -pv "1.5.0" \
  -ps "Enterprise Inc" \
  -nsb https://enterprise.com/java-app \
  -V Verbose \
  -pm Maven \
  -D true

mv _manifest/spdx_2.2/manifest.spdx.json java-sbom.json
```

##### **Monorepo with Multiple Workspaces**

```bash
# Generate SBOM for workspace 1 (e.g., backend API)
sbom-tool generate \
  -b ./api \
  -bc ./api \
  -pn "MyApp-API" \
  -pv "1.0.0" \
  -ps "MyCompany" \
  -nsb https://mycompany.com/myapp \
  -V Verbose \
  -pm Npm \
  -D true

mv api/_manifest/spdx_2.2/manifest.spdx.json api-sbom.json

# Generate SBOM for workspace 2 (e.g., frontend)
sbom-tool generate \
  -b ./frontend \
  -bc ./frontend \
  -pn "MyApp-Frontend" \
  -pv "1.0.0" \
  -ps "MyCompany" \
  -nsb https://mycompany.com/myapp \
  -V Verbose \
  -pm Npm \
  -D true

mv frontend/_manifest/spdx_2.2/manifest.spdx.json frontend-sbom.json
```

---

### Method 2: Syft (Fast, container-aware)

Syft can scan directories, container images, and archives.

#### Basic Directory Scan

```bash
# Generate SBOM in SPDX format
syft packages dir:. -o spdx-json > sbom.spdx.json

# Generate SBOM in CycloneDX format
syft packages dir:. -o cyclonedx-json > sbom.cyclonedx.json

# Scan a specific directory
syft packages dir:./src -o spdx-json > src-sbom.json
```

#### Scan Container Image

```bash
# Scan local Docker image
syft packages docker:myapp:latest -o spdx-json > container-sbom.json

# Scan remote image
syft packages docker:nginx:latest -o spdx-json > nginx-sbom.json
```

#### Multiple Output Formats

```bash
# Generate multiple formats at once
syft packages dir:. -o spdx-json=sbom.spdx.json -o cyclonedx-json=sbom.cyclonedx.json -o table
```

---

### Method 3: CycloneDX Tools

#### For Node.js (npm)

```bash
# Generate CycloneDX SBOM
cyclonedx-npm --output-file sbom.cyclonedx.json

# Include dev dependencies
cyclonedx-npm --output-file sbom-full.cyclonedx.json --short-PURLs false

# For a specific workspace in monorepo
cd api && cyclonedx-npm --output-file ../api-sbom.cyclonedx.json
```

#### For Python

```bash
# Generate CycloneDX SBOM for Python project
cyclonedx-py --output sbom.cyclonedx.json

# From requirements.txt
cyclonedx-py -r requirements.txt --output sbom.cyclonedx.json

# Include environment packages
cyclonedx-py --env --output sbom-env.cyclonedx.json
```

#### For Java/Maven

Add to your `pom.xml`:

```xml
<plugin>
    <groupId>org.cyclonedx</groupId>
    <artifactId>cyclonedx-maven-plugin</artifactId>
    <version>2.7.9</version>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>makeAggregateBom</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Then run:
```bash
mvn cyclonedx:makeAggregateBom
# Output: target/bom.json
```

---

### Method 4: Native Package Manager Commands

#### npm (Node.js)

```bash
# Simple dependency list (JSON)
npm list --json > npm-deps.json

# Include all nested dependencies
npm list --all --json > npm-deps-full.json

# For specific workspace in monorepo
npm list --json --workspace=api > api-deps.json
```

**Note:** This creates a dependency tree, not a standardized SBOM format.

#### pip (Python)

```bash
# List installed packages
pip list --format=json > pip-packages.json

# With pip-licenses for license info
pip install pip-licenses
pip-licenses --format=json --output-file=pip-licenses.json
```

#### Maven (Java)

```bash
# Generate dependency tree
mvn dependency:tree -DoutputType=text -DoutputFile=maven-deps.txt

# More detailed dependency report
mvn dependency:list > maven-deps-list.txt
```

---

## SBOM File Organization

### Recommended Naming Conventions

```
<project-name>-sbom-<package-manager>.<format>.json

Examples:
- myapp-sbom-npm.json
- api-sbom-npm.spdx.json
- frontend-sbom-npm.cyclonedx.json
- backend-sbom-maven.spdx.json
- myapp-container-sbom.json
```

### Storage Locations

#### **Option 1: Repository Root** (Recommended for visibility)
```
/
├── README.md
├── package.json
├── api-sbom.json
├── frontend-sbom.json
└── ...
```

#### **Option 2: Dedicated SBOM Directory**
```
/
├── sbom/
│   ├── api-sbom.json
│   ├── frontend-sbom.json
│   ├── container-sbom.json
│   └── README.md
└── ...
```

#### **Option 3: With Release Artifacts**
```
/releases/
├── v1.0.0/
│   ├── myapp-v1.0.0.tar.gz
│   ├── sbom-v1.0.0.spdx.json
│   └── RELEASE_NOTES.md
└── v1.1.0/
    └── ...
```

---

## Automating SBOM Generation

### Using NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "sbom:generate": "sbom-tool generate -b . -bc . -pn \"MyApp\" -pv \"1.0.0\" -ps \"MyCompany\" -nsb https://mycompany.com/myapp -V Verbose -pm Npm -D true && mv _manifest/spdx_2.2/manifest.spdx.json sbom.json",
    "sbom:api": "sbom-tool generate -b ./api -bc ./api -pn \"MyApp-API\" -pv \"1.0.0\" -ps \"MyCompany\" -nsb https://mycompany.com/myapp -V Verbose -pm Npm -D true && mv api/_manifest/spdx_2.2/manifest.spdx.json api-sbom.json",
    "sbom:frontend": "sbom-tool generate -b ./frontend -bc ./frontend -pn \"MyApp-Frontend\" -pv \"1.0.0\" -ps \"MyCompany\" -nsb https://mycompany.com/myapp -V Verbose -pm Npm -D true && mv frontend/_manifest/spdx_2.2/manifest.spdx.json frontend-sbom.json",
    "sbom:all": "npm run sbom:api && npm run sbom:frontend"
  }
}
```

Then run:
```bash
npm run sbom:all
```

### Using Shell Scripts

#### **Linux/macOS Script** (`generate-sbom.sh`)

```bash
#!/bin/bash

set -e

echo "🔍 Generating SBOMs for project..."

# Configuration
PACKAGE_NAME="MyApp"
VERSION="1.0.0"
SUPPLIER="MyCompany"
NAMESPACE="https://mycompany.com/myapp"
PACKAGE_MANAGER="Npm"

# Function to generate SBOM
generate_sbom() {
  local workspace=$1
  local name=$2
  local output=$3
  
  echo "📦 Generating SBOM for ${name}..."
  
  sbom-tool generate \
    -b "./${workspace}" \
    -bc "./${workspace}" \
    -pn "${name}" \
    -pv "${VERSION}" \
    -ps "${SUPPLIER}" \
    -nsb "${NAMESPACE}" \
    -V Verbose \
    -pm "${PACKAGE_MANAGER}" \
    -D true
  
  mv "${workspace}/_manifest/spdx_2.2/manifest.spdx.json" "${output}"
  echo "✅ SBOM saved to ${output}"
}

# Generate SBOMs
generate_sbom "api" "${PACKAGE_NAME}-API" "api-sbom.json"
generate_sbom "frontend" "${PACKAGE_NAME}-Frontend" "frontend-sbom.json"

echo "✨ All SBOMs generated successfully!"
```

Make executable and run:
```bash
chmod +x generate-sbom.sh
./generate-sbom.sh
```

#### **Windows Script** (`generate-sbom.bat`)

```batch
@echo off
setlocal enabledelayedexpansion

echo Generating SBOMs for project...

REM Configuration
set PACKAGE_NAME=MyApp
set VERSION=1.0.0
set SUPPLIER=MyCompany
set NAMESPACE=https://mycompany.com/myapp
set PACKAGE_MANAGER=Npm

REM Generate API SBOM
echo Generating API SBOM...
sbom-tool generate -b ./api -bc ./api -pn "%PACKAGE_NAME%-API" -pv "%VERSION%" -ps "%SUPPLIER%" -nsb "%NAMESPACE%" -V Verbose -pm %PACKAGE_MANAGER% -D true
move api\_manifest\spdx_2.2\manifest.spdx.json api-sbom.json
echo API SBOM saved to api-sbom.json

REM Generate Frontend SBOM
echo Generating Frontend SBOM...
sbom-tool generate -b ./frontend -bc ./frontend -pn "%PACKAGE_NAME%-Frontend" -pv "%VERSION%" -ps "%SUPPLIER%" -nsb "%NAMESPACE%" -V Verbose -pm %PACKAGE_MANAGER% -D true
move frontend\_manifest\spdx_2.2\manifest.spdx.json frontend-sbom.json
echo Frontend SBOM saved to frontend-sbom.json

echo All SBOMs generated successfully!
```

Run:
```batch
generate-sbom.bat
```

#### **PowerShell Script** (`Generate-SBOM.ps1`)

```powershell
#!/usr/bin/env pwsh

# Configuration
$PackageName = "MyApp"
$Version = "1.0.0"
$Supplier = "MyCompany"
$Namespace = "https://mycompany.com/myapp"
$PackageManager = "Npm"

function Generate-SBOM {
    param(
        [string]$Workspace,
        [string]$Name,
        [string]$Output
    )
    
    Write-Host "📦 Generating SBOM for $Name..." -ForegroundColor Cyan
    
    sbom-tool generate `
        -b "./$Workspace" `
        -bc "./$Workspace" `
        -pn "$Name" `
        -pv "$Version" `
        -ps "$Supplier" `
        -nsb "$Namespace" `
        -V Verbose `
        -pm "$PackageManager" `
        -D true
    
    Move-Item -Path "$Workspace/_manifest/spdx_2.2/manifest.spdx.json" -Destination $Output -Force
    Write-Host "✅ SBOM saved to $Output" -ForegroundColor Green
}

Write-Host "🔍 Generating SBOMs for project..." -ForegroundColor Yellow

Generate-SBOM -Workspace "api" -Name "$PackageName-API" -Output "api-sbom.json"
Generate-SBOM -Workspace "frontend" -Name "$PackageName-Frontend" -Output "frontend-sbom.json"

Write-Host "✨ All SBOMs generated successfully!" -ForegroundColor Green
```

Run:
```powershell
pwsh Generate-SBOM.ps1
```

---

## SBOM Validation & Analysis

### Validate SBOM Format

#### Using jq (JSON validation)

```bash
# Check if SBOM is valid JSON
jq empty sbom.json && echo "✅ Valid JSON" || echo "❌ Invalid JSON"

# Pretty print SBOM
jq . sbom.json

# Validate against SPDX schema
curl -s https://raw.githubusercontent.com/spdx/spdx-spec/v2.2/schemas/spdx-schema.json > spdx-schema.json
npx ajv-cli validate -s spdx-schema.json -d sbom.json
```

### Analyze SBOM Contents

```bash
# Count total packages
jq '.packages | length' sbom.json

# List all package names
jq '.packages[].name' sbom.json

# Extract package names and versions
jq '.packages[] | "\(.name)@\(.versionInfo)"' sbom.json

# Find specific packages (e.g., "express")
jq '.packages[] | select(.name | contains("express"))' sbom.json

# Check SBOM metadata
jq '.documentNamespace, .creationInfo.created, .name' sbom.json

# Find packages with specific license
jq '.packages[] | select(.licenseDeclared | contains("MIT"))' sbom.json

# Group by license type
jq '.packages | group_by(.licenseDeclared) | map({license: .[0].licenseDeclared, count: length})' sbom.json
```

### Scan for Vulnerabilities

#### Using Grype

```bash
# Install Grype
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

# Scan SBOM for vulnerabilities
grype sbom:./sbom.json

# Output as JSON
grype sbom:./sbom.json -o json > vulnerabilities.json

# Only show high/critical vulnerabilities
grype sbom:./sbom.json --fail-on high
```

#### Using OSV Scanner

```bash
# Install OSV Scanner
go install github.com/google/osv-scanner/cmd/osv-scanner@latest

# Scan SBOM
osv-scanner --sbom=sbom.json

# Output as JSON
osv-scanner --sbom=sbom.json --format json > osv-results.json
```

#### Using npm audit (for npm projects)

```bash
# Run audit
npm audit

# JSON output
npm audit --json > npm-audit-results.json

# Fix vulnerabilities automatically
npm audit fix
```

---

## SBOM Formats Comparison

| Format | Standard | Use Case | Tools | Output |
|--------|----------|----------|-------|--------|
| **SPDX** | ISO/IEC 5962:2021 | Industry standard, compliance, legal | Microsoft SBOM Tool, Syft | JSON, YAML, RDF |
| **CycloneDX** | OWASP | Security analysis, vulnerability tracking | CycloneDX CLI, Syft | JSON, XML |
| **SWID** | ISO/IEC 19770-2:2015 | Software asset management | SWID tools | XML |
| **Package-specific** | Varies | Quick snapshots, debugging | npm list, pip list | JSON, text |

### When to Use Each Format

- **SPDX**: Compliance requirements, legal reviews, license auditing, broad ecosystem support
- **CycloneDX**: Security-focused workflows, integration with OWASP tools, vulnerability scanning
- **Both**: Generate both for maximum compatibility and use-case coverage

---

## Best Practices

### ✅ Do's

1. **Generate SBOMs regularly**
   - After every dependency update
   - Before each release
   - When security patches are applied

2. **Use standardized formats**
   - Prefer SPDX or CycloneDX over proprietary formats
   - Include complete dependency trees (not just direct dependencies)

3. **Version control your SBOMs**
   - Commit SBOMs to Git
   - Tag SBOMs with release versions
   - Track changes over time

4. **Include comprehensive data**
   - All transitive dependencies
   - License information
   - Package versions (exact, not ranges)
   - Package source/origin

5. **Automate generation**
   - Use scripts or package.json tasks
   - Integrate into build process
   - Set up pre-commit hooks

6. **Document your process**
   - Explain how to regenerate SBOMs
   - Document which tool and version was used
   - Include instructions in README

### ❌ Don'ts

1. **Don't manually edit SBOMs**
   - Always regenerate from source
   - Trust automated tools over manual intervention

2. **Don't skip transitive dependencies**
   - Include the full dependency tree
   - Vulnerabilities often hide in nested deps

3. **Don't ignore dev dependencies** (situational)
   - Include if they affect build artifacts
   - Exclude if only used in development (document this choice)

4. **Don't use outdated tools**
   - Keep SBOM generators up to date
   - Tool bugs can lead to incomplete SBOMs

5. **Don't forget container base images**
   - If deploying containers, scan base images too
   - OS packages matter for security

6. **Don't store SBOMs without context**
   - Include generation date and tool version
   - Link SBOM to specific code version/commit

---

## Troubleshooting

### Issue: SBOM Tool Not Found

**Symptoms:**
```
'sbom-tool' is not recognized as an internal or external command
```

**Solutions:**
```bash
# Verify installation
dotnet tool list --global

# Check PATH
echo $PATH  # Linux/macOS
echo %PATH%  # Windows

# Reinstall
dotnet tool uninstall --global Microsoft.Sbom.DotNetTool
dotnet tool install --global Microsoft.Sbom.DotNetTool

# Add dotnet tools to PATH (if needed)
# Linux/macOS: export PATH="$PATH:$HOME/.dotnet/tools"
# Windows: Add %USERPROFILE%\.dotnet\tools to PATH
```

### Issue: Missing or Incomplete Dependencies

**Symptoms:**
- SBOM is empty or has very few packages
- Build fails before SBOM generation

**Solutions:**
```bash
# Ensure dependencies are installed
npm install  # or npm ci for reproducible builds
pip install -r requirements.txt
mvn install
dotnet restore

# Verify dependency directories exist
ls node_modules/  # Node.js
ls venv/  # Python
ls target/  # Java/Maven

# Clear cache and reinstall
npm cache clean --force && npm install
pip cache purge && pip install -r requirements.txt
```

### Issue: Invalid or Empty SBOM Output

**Symptoms:**
- SBOM file is empty (`{}`)
- JSON syntax errors
- Missing expected packages

**Solutions:**
```bash
# Run with verbose logging
sbom-tool generate ... -V Verbose

# Check console output for errors
# Verify package.json / pom.xml / requirements.txt is valid

# Ensure you're in correct directory
pwd  # Should be project root or specific workspace

# Try different package manager if auto-detection fails
sbom-tool generate ... -pm Npm  # Explicitly specify
```

### Issue: Permission Denied

**Symptoms:**
```
Permission denied writing to _manifest/
```

**Solutions:**
```bash
# Linux/macOS: Check file permissions
ls -la
chmod +x generate-sbom.sh  # Make script executable

# Run with appropriate permissions
sudo sbom-tool generate ...  # Use sparingly

# Windows: Run as Administrator (if needed)
# Right-click CMD/PowerShell -> Run as Administrator

# Alternative: Change output directory to writable location
sbom-tool generate ... -ManifestDirPath ./sbom-output
```

### Issue: Tool Version Conflicts

**Symptoms:**
- Different results on different machines
- Unexpected SBOM structure changes

**Solutions:**
```bash
# Check tool version
sbom-tool --version
syft version
cyclonedx-npm --version

# Update to latest
dotnet tool update --global Microsoft.Sbom.DotNetTool
npm update -g @cyclonedx/cyclonedx-npm

# Pin specific versions in CI/CD or documentation
# Document: "Generated with sbom-tool v1.5.0"
```

---

## Integration with CI/CD (Optional)

While this guide focuses on **local generation**, you can adapt these commands for CI/CD:

### GitHub Actions Example

```yaml
name: Generate SBOM

on:
  push:
    branches: [main]

jobs:
  sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.x'
      
      - name: Install SBOM Tool
        run: dotnet tool install --global Microsoft.Sbom.DotNetTool
      
      - name: Generate SBOM
        run: |
          sbom-tool generate -b . -bc . -pn "MyApp" -pv "1.0.0" -ps "MyCompany" -nsb https://mycompany.com/myapp -V Verbose -pm Npm -D true
          mv _manifest/spdx_2.2/manifest.spdx.json sbom.json
      
      - name: Upload SBOM
        uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: sbom.json
```

### GitLab CI Example

```yaml
generate-sbom:
  image: mcr.microsoft.com/dotnet/sdk:8.0
  script:
    - dotnet tool install --global Microsoft.Sbom.DotNetTool
    - export PATH="$PATH:$HOME/.dotnet/tools"
    - sbom-tool generate -b . -bc . -pn "MyApp" -pv "1.0.0" -ps "MyCompany" -nsb https://mycompany.com/myapp -V Verbose -pm Npm -D true
    - mv _manifest/spdx_2.2/manifest.spdx.json sbom.json
  artifacts:
    paths:
      - sbom.json
```

---

## Additional Resources

### Official Documentation
- **Microsoft SBOM Tool**: https://github.com/microsoft/sbom-tool
- **Syft**: https://github.com/anchore/syft
- **CycloneDX**: https://cyclonedx.org/
- **SPDX Specification**: https://spdx.dev/

### Standards & Frameworks
- **NTIA SBOM Minimum Elements**: https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom
- **Executive Order 14028** (Software Supply Chain): https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/
- **CISA SBOM Guide**: https://www.cisa.gov/sbom

### Vulnerability Scanning Tools
- **Grype**: https://github.com/anchore/grype
- **OSV Scanner**: https://github.com/google/osv-scanner
- **Trivy**: https://github.com/aquasecurity/trivy
- **Dependency-Track**: https://dependencytrack.org/

### Useful Articles
- [What is an SBOM? (CISA)](https://www.cisa.gov/sbom)
- [SBOM at a Glance (NTIA)](https://www.ntia.doc.gov/files/ntia/publications/sbom_at_a_glance_apr2021.pdf)
- [Framing Software Component Transparency](https://www.ntia.gov/files/ntia/publications/framingsbom_20191112.pdf)

---

## Quick Reference

### Common Commands

```bash
# Microsoft SBOM Tool - Single project
sbom-tool generate -b . -bc . -pn "MyApp" -pv "1.0.0" -ps "MyCompany" -nsb https://mycompany.com/myapp -V Verbose -pm Npm -D true

# Syft - Directory scan (SPDX)
syft packages dir:. -o spdx-json > sbom.spdx.json

# Syft - Container scan
syft packages docker:myapp:latest -o spdx-json > container-sbom.json

# CycloneDX - Node.js
cyclonedx-npm --output-file sbom.cyclonedx.json

# Validate JSON
jq empty sbom.json

# Count packages
jq '.packages | length' sbom.json

# Scan for vulnerabilities
grype sbom:./sbom.json
```

### File Naming Convention

```
<component>-sbom-<package-manager>.<format>.json

Examples:
api-sbom-npm.json
frontend-sbom-npm.spdx.json
backend-sbom-maven.cyclonedx.json
myapp-container-sbom.json
```

---

## Summary

This workflow provides a **repo-agnostic, local-first approach** to SBOM generation:

1. **Choose your tool** based on project ecosystem (Microsoft SBOM Tool, Syft, CycloneDX)
2. **Install dependencies** before generating SBOMs
3. **Generate SBOMs** using command-line tools
4. **Automate** with npm scripts or shell scripts
5. **Validate** using jq, schema validators, or vulnerability scanners
6. **Store** in version control with clear naming conventions
7. **Update** regularly (after dependency changes, before releases)

**Key Benefits:**
- ✅ Works locally without CI/CD dependencies
- ✅ Supports multiple languages and package managers
- ✅ Generates industry-standard formats (SPDX, CycloneDX)
- ✅ Enables vulnerability tracking and compliance
- ✅ Provides software supply chain transparency

---

**Last Updated:** November 17, 2025
