# ADR: Code Formatting Tool Selection — Prettier

**Date:** 2025-11-10  
**Author:** Yifei Wang
**Reviewer(s):** TBD
**Status:** Pending Review

---

## 1. Context

The full-stack web application name **Conduntor** under development will serve as a student–professor portal enabling users to view grades, assignments, announcements, and other course-related information.The **Conductor** backend is built with **Node.js and Fastify**.

For automated code formatting, the codebase needs to address:

- Inconsistent indentation, spacing, and quote styles causing merge conflicts
- Code review time wasted on style

The team requires a **zero-configuration, opinionated formatter** that:

- Works automatically
- Integrates with **ESLint**
- Supports modern **JavaScript**
- Runs in CI/CD pipelines
- Maintains consistent output across all developer environments

Given these needs, the team evaluated **Prettier**, **StandardJS** (formatting mode). We decided to adopt **Prettier**.

---

## 2. Decision

We will use **Prettier** as the automated code formatter for the **Conductor**, integrated with ESLint via `eslint-plugin-prettier` to ensure formatting rules do not conflict with linting rules.

---

## 3. Rationale

### 3.1. Opinionated Consistency with Minimal Configuration

Prettier is intentionally opinionated to eliminate debates about code style:

- **Automatic semicolon insertion** (`semi: true`) prevents ASI-related bugs
- **Trailing commas** (`trailingComma: "es5"`) produce cleaner git diffs when adding array/object elements
- **Single quotes** (`singleQuote: true`) align with Node.js and Fastify conventions
- **80-character line width** (`printWidth: 80`) ensures readability on split screens and accessibility tools
- **2-space indentation** (`tabWidth: 2`) matches JavaScript community standards and Fastify documentation

Unlike **StandardJS**, which enforces a non-configurable style that may conflict with project needs, Prettier allows minimal configuration while maintaining consistency. The team can adjust these settings and Prettier handles all other formatting decisions automatically.

---

### 3.2. Integration with ESLint

Code formatting and linting serve different purposes:

- **ESLint** catches logic errors, security issues, and code smells
- **Prettier** enforces consistent formatting

But `eslint-plugin-prettier` allows ESLint to run Prettier as a rule, reporting formatting issues as linting errors.

**StandardJS** cannot integrate with ESLint in this way, forcing teams to choose one or the other.

---

## 4. Alternatives

### StandardJS

- **Pros:** Zero configuration, combined linting and formatting.
- **Cons:** Non-configurable (incompatible with single quotes preference), cannot integrate with ESLint, opinionated style may conflict with Fastify conventions.

---

## 5. Consequences

### Positive Outcomes

- **Zero formatting debates** — eliminates bikeshedding about code style
- **Faster code reviews** — reviewers focus on logic, not formatting
- **Cleaner git history** — formatting is consistent across all commits
- **Reduced merge conflicts** — trailing commas and consistent breaks
- **Improved accessibility** — enforced line lengths
- **Developer productivity** — eliminated manual formatting time

### Negative Outcomes / Trade-offs

- **Opinionated style** — team must accept Prettier's decisions (e.g., line breaking in long function calls)
- **Initial setup time** — requires configuring editor integrations and pre-commit hooks
- **Dependency management** — requires keeping Prettier and eslint-plugin-prettier versions in sync

---

## 6. Implementation

```bash
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier
```
