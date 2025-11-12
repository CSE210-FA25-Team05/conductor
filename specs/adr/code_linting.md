# ADR: Code Linting Tool Selection — ESLint

**Date:** 2025-11-10  
**Author:** Yifei Wang
**Reviewer(s):** TBD
**Status:** Pending Review

---

## 1. Context

The full-stack web application name **Conduntor** under development will serve as a student–professor portal enabling users to view grades, assignments, announcements, and other course-related information.The **Conductor** backend is built with **Node.js and Fastify**.

The codebase must:

- Maintain **consistent code style** across contributions from multiple developers
- Catch **common JavaScript/TypeScript errors** before runtime
- Support **automated enforcement** in CI/CD pipelines
- Integrate seamlessly with modern editors (VS Code, WebStorm) for real-time feedback

Given these requirements, the team evaluated several JavaScript linting tools — primarily **ESLint** and **JSLint**. We decided to adopt **ESLint**.

---

## 2. Decision

We will use ESLint as the primary linting tool for the Conductor, configured with `eslint:recommended` rules and Prettier integration.

---

## 3. Rationale

### 3.1. Extensibility and Rule Customization

ESLint provides a plugin-based architecture that allows fine-grained control over linting rules:

- Supports custom rule sets tailored to Fastify patterns
- Can enforce project-specific conventions (e.g., `console.log` in code)
- Allows rule severity levels (`error`, `warn`, `off`) to distinguish between blocking issues and suggestions

In contrast, **JSLint** has limited configuration options.

---

### 3.2. Modern JavaScript and TypeScript Support

Conductor uses ES2021+ syntax and may adopt **TypeScript** for future iterations, making it scalable for modern web development.
**JSLint** offers little configuration linting and cannot be customized for project-specific needs like Fastify route handlers or PostgreSQL query patterns.

---

### 3.3. Integration with Development Workflow

ESLint integrates across the entire development pipeline:

#### **Editor Integration**

- Real-time error highlighting in **VS Code**, **WebStorm**, and **Vim**
- Auto-fix on save for formatting issues
- Inline documentation for rule violations

#### **CI/CD Pipeline**

- GitHub Actions can run `eslint .` to block PRs with linting violations
- Generates actionable error reports with file paths and line numbers
- Integrates with **Codeclimate** for trend analysis and code quality metrics

This level of integration is not available for **JSLint**.

---

## 4. Alternatives

### JSLint

- **Pros:** Zero configuration, fast.
- **Cons:** Non-configurable, overly strict, rejects common patterns like `==` and `++`. Incompatible with Fastify's async/await and modern Node.js idioms.

---

## 5. Consequences

### Positive Outcomes

- **Consistent code quality** across multiple developer contributions
- **Early error detection** before code reaches production or CI/CD
- **Reduced code review friction** through automated style enforcement
- **Scalable enforcement** as codebase grows and team rotates

### Negative Outcomes / Trade-offs

- **Initial configuration overhead** to align ESLint with project-specific patterns
- **Learning curve** for developers unfamiliar with ESLint rule system
- **Build time increase** in CI/CD pipelines (mitigated by incremental linting and caching)
- **Maintenance burden** to keep ESLint plugins and rules updated with Node.js ecosystem changes

---

## 6. Implementation

```bash
npm install --save-dev eslint eslint-config-prettier eslint-plugin-prettier
```
