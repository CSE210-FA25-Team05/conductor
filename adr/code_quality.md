# ADR: Code Quality Monitoring Tool Selection — Codeclimate

**Date:** 2025-11-10  
**Author:** Yifei Wang
**Reviewer(s):** TBD
**Status:** Pending Approval

---

## 1. Context

The full-stack web application name **Conduntor** under development will serve as a student–professor portal enabling users to view grades, assignments, announcements, and other course-related information.The **Conductor** backend is built with **Node.js and Fastify**.

For automated code quality monitoring, the codebase needs to address:

- Track code maintainability over time
- Identify complex functions before they become problematic
- Integrate with GitHub pull requests
- Maintain security standards by detecting vulnerable patterns

Given these requirements, the team evaluated **Codeclimate** and **Codacy**. We decided to adopt **Codeclimate**.

---

## 2. Decision

We will use **Codeclimate** as the primary code quality monitoring platform for the **Conductor**, configured to analyze JavaScript code with ESLint integration and to comment on pull requests.

---

## 3. Rationale

### 3.1. Maintainability Metrics and Technical Debt Tracking

Codeclimate provides maintainability metrics based on complexity analysis:

- **Maintainability Grades**: Each file receives a grade based on complexity, code duplication, and function length
- **Technical Debt Estimation**: Quantifies refactoring effort in hours/days, helping prioritize improvements
- **Complexity Scores**: Identifies functions exceeding cognitive complexity thresholds
- **Trend Analysis**: Visualizes maintainability changes over time, showing whether quality is improving or degrading

**Codacy** provides similar features but with less granular technical debt estimation and less optimized trend analysis.

---

### 3.2. Pull Request Integration and Inline Feedback

Codeclimate integrates directly with GitHub pull requests to provide immediate feedback:

- **Automated PR comments** highlight new issues introduced in changed code
- **Diff-based analysis** only flags problems in modified files
- **Inline annotations** show exactly which lines violate maintainability rules
- **Status checks** block merging if new issues exceed configured thresholds

---

### 3.3. Integration with ESLint

Codeclimate runs the same ESLint configuration used in local development and CI/CD:

- Reads `.eslintrc.json` to ensure **consistent rule enforcement** across all environments
- Detects security vulnerabilities via eslint-plugin-security rules
- Reports code style violations via Prettier

---

### 3.4. Security Vulnerability Detection

Codeclimate includes security-focused checks:

- **Insecure dependencies**: Flags known CVEs in npm packages
- **Unsafe patterns**: Detects eval(), SQL injection risks, unsafe regex
- **Authentication issues**: Identifies missing authorization checks in Fastify routes
- **Data exposure**: Warns about logging sensitive information aligned with FERPA requirements

---

## 4. Alternatives Considered

### Codacy

- **Pros:** Similar feature set to Codeclimate, good PR integration, supports multiple languages.  
- **Cons:** Less technical debt estimation, weaker trend analysis UI, and smaller community.

---

## 5. Consequences

### Positive Outcomes

- **Early issue detection** via PR comments catches problems before merge
- **Technical debt visibility** enables informed refactoring prioritization
- **Security scanning** provides additional layer beyond ESLint for FERPA compliance
- **Trend analysis** shows codebase health trajectory across semesters

### Negative Outcomes / Trade-offs

- **Analysis delays** may require more time compared to instant local linting
- **External dependency** on Codeclimate service availability
- **Configuration maintenance** required to keep `.codeclimate.yml` aligned with project evolution

---

## 6. Implementation

### Initial Setup

1. **Sign up for Codeclimate Quality**
   - Visit: https://codeclimate.com/quality
   - Sign in with GitHub account
   - Add repository from organization

2. **Create configuration file**

**`.codeclimate.yml`** (project root):
```yaml
version: "2"

# Maintainability checks
checks:
  argument-count:
    enabled: true
    config:
      threshold: 4
  
  complex-logic:
    enabled: true
    config:
      threshold: 4
  
  file-lines:
    enabled: true
    config:
      threshold: 250
  
  method-complexity:
    enabled: true
    config:
      threshold: 5
  
  method-lines:
    enabled: true
    config:
      threshold: 25
  
  similar-code:
    enabled: true
    config:
      threshold: 50
  
  identical-code:
    enabled: true
    config:
      threshold: 50

plugins:
  eslint:
    enabled: true
    channel: eslint-8

# Exclude patterns
exclude_patterns:
  - "node_modules/"
  - "tests/"
  - "**/*.test.js"
```