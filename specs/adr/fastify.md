# ADR: Backend Framework Selection — Fastify

**Date:** 2025-11-08  
**Status:** Accepted

---

## 1. Context

The **Conductor Tool** is a web-based platform designed to streamline the logistics and evaluation processes of large-scale university software engineering classes (approximately **500–1000 concurrent user sessions**).

Its backend must:

- Support secure authentication (**Google OAuth / UCSD SSO**)
- Handle role-based authorization and sensitive student data (**FERPA compliance**)
- Offer fast, reliable responses to multiple simultaneous API calls
- Integrate cleanly with a **PostgreSQL** database
- Remain lightweight and maintainable by student developers with varying experience levels
- Follow **core platform technology** principles (Node.js, ES6+, vanilla JS/TS compatibility) for long-term sustainability

Given these constraints, the team evaluated several Node.js-based frameworks — primarily **Fastify**, **Express**, **Hono**, and **NestJS** — and decided to adopt **Fastify**.

---

## 2. Decision

We will use **Fastify** as the backend HTTP framework for the Conductor Tool, instead of **Express**, **Hono**, or **NestJS**.

---

## 3. Rationale

### 3.1. Performance and Concurrency Handling

Fastify’s routing and request lifecycle are optimized for **asynchronous, low-overhead I/O**.

- Internal benchmarks show **Fastify can handle up to 70k req/s**, often **2× faster than Express** under JSON serialization-heavy workloads.
- Since Conductor will handle moderate concurrency (hundreds of active student sessions), this difference translates directly to **lower latency**, **smoother class-time usage**, and **fewer server resources**.
- Fastify’s encapsulated plugin model ensures that middleware registration does not globally impact performance — crucial for scalability as we modularize routes (auth, directory, attendance, analytics).

In contrast, **Express’s** legacy middleware stack introduces synchronous middleware chains and lacks structured control over plugin scopes, which could result in global state leakage and unpredictable latency under load.

---

### 3.2. Type Safety and Validation

- Fastify integrates **built-in schema validation** using **Ajv (JSON Schema v7)**.  
  Each route can declare a `schema` for request and response payloads.
- This provides **automatic input validation and output serialization**, preventing malformed data from entering the system — particularly important for handling class rosters and attendance logs that are subject to **FERPA** regulations.
- Express requires third-party validation libraries like `joi` or `express-validator`, which introduce **extra dependencies** and **inconsistent error formats**.
- The combination of Fastify’s schema system and TypeScript’s type inference allows the backend to **generate OpenAPI documentation automatically**, improving maintainability and transparency.

---

### 3.3. Developer Experience and Maintainability

Fastify provides **Express-like syntax** (`fastify.get()`, `fastify.post()`, etc.), so onboarding for developers familiar with Express is straightforward.

However, its architecture encourages:

- **Encapsulated plugin development** – routes, hooks, and decorators can be isolated per module (e.g., `attendance.js`, `auth.js`), reducing side effects.
- **Structured lifecycle hooks** (`onRequest`, `preHandler`, `onResponse`) — useful for uniform logging, auditing, and security policies.
- **Zero-cost async/await support**, reducing callback complexity common in Express middleware.

For a project intended to involve **rotating student developers**, these conventions ensure **code modularity**, **clearer boundaries**, and easier maintenance without enforcing heavy structure like NestJS.

---

### 3.4. Security and Observability

Given that Conductor will manage **personal and institutional data**, the framework’s support for secure and auditable operations is essential:

- Fastify integrates **Pino**, a zero-dependency structured logger that can log to JSON for auditing.
- Hooks at every lifecycle stage allow logging of access events (e.g., login attempts, failed auth, role changes) and integration with monitoring tools like Datadog or Elastic.
- The encapsulated design limits middleware exposure — preventing accidental leakage of sensitive context across routes.
- Fastify’s ecosystem supports secure headers (`@fastify/helmet`), rate limiting (`@fastify/rate-limit`), and CSRF protection plugins — all officially maintained.

This level of integration and control over security layers is **cleaner and more predictable** than Express’s unstructured middleware chaining.

---

### 3.5. Alignment with Project Requirements

| **Requirement**                               | **Fastify Fit**                                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Accessibility & internationalization**      | Built-in content-type negotiation and schema-based encoding ensures UTF-8 and multi-language safety.                              |
| **Moderate concurrency (500–1000 sessions)**  | Optimized routing and serialization pipeline handle concurrent I/O efficiently.                                                   |
| **Research-oriented, “moldable” development** | Modular plugin system enables evolutionary addition of new components (e.g., analytics, journaling) without refactoring the core. |
| **Long-term maintainability**                 | Active LTS release cycle; backward compatibility guarantees; compatible with pure Node.js ES modules.                             |
| **Security & FERPA compliance**               | Lifecycle hooks, structured logging, and schema validation provide strong data-integrity guarantees.                              |

---

### 3.6. Community and Ecosystem Support

While Fastify’s ecosystem is smaller than Express’s, it is **modern**, **stable**, and **officially curated**.

Plugins such as:

- `@fastify/postgres` – PostgreSQL integration
- `@fastify/helmet` – HTTP header security
- `@fastify/static` – Static file serving
- `@fastify/jwt` – JWT-based authentication

integrate seamlessly with minimal configuration overhead.

The maintainers also actively support **Node.js core compatibility**, ensuring long-term reliability — an important factor for a university-maintained tool expected to live beyond a single academic term.

---

## 4. Alternatives Considered

### Express

- **Pros:** Mature, largest community, many tutorials.
- **Cons:** Synchronous middleware model, lack of type safety, weaker plugin encapsulation, and poor out-of-box performance. Would require multiple third-party libraries for validation, logging, and rate limiting — increasing technical debt.

### Hono

- **Pros:** Very lightweight, Cloudflare Worker-friendly, modern API.
- **Cons:** Small community, limited documentation for OAuth and PostgreSQL integrations. Lacks mature plugin ecosystem for security and schema validation. Would increase development time for essential middleware.

### NestJS

- **Pros:** Highly structured, opinionated architecture with built-in Dependency Injection and decorator-based routes.
- **Cons:** Heavyweight, complex for short-lifecycle academic projects. The learning curve and boilerplate make it unsuitable for fast iteration or “moldable development.” Overkill for our current scale.

---

## 5. Consequences

### Positive Outcomes

- Improved throughput and stability under concurrent load
- Stronger guarantees for data integrity through schema validation
- Simplified plugin isolation and modular growth
- Enhanced auditability and observability
- Easier developer onboarding with familiar syntax but better patterns

### Negative Outcomes / Trade-offs

- Smaller ecosystem than Express (fewer community plugins)
- Slightly steeper learning curve for plugin encapsulation patterns
- Potential compatibility adjustments for older Node.js utilities expecting Express middleware signatures

---
