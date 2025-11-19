# ADR: Frontend Framework Selection — Svelte + SvelteKit

**Date:** 2025-11-18  
**Status:** In Review

---

## 1. Context

The Conductor app will be used by University Professors to manage their classes. 

The Conductor Frontend must:
- Secure handle authentication tokens (jwt)
- Maintain RAIL requirements
- Implement Internatinalization
- Role-based layouts
- Remain lightweight and maintainable by student developers with varying experience levels

Given these constraints, we initially decided to use JS WebComponents with Vanilla JS/HTML/CSS.

However, we quickly ran into issues, including: 
- Auth checks and protected routes.
- Difficult logic and complex ShadowDOM usage for people unexperienced with WebComponents.
- Undesirable syntax.
- Handling State and Errors.
- Limited global state.

We explored many options to fix these issues.
- Other frameworks like React or Vue. 
- WebComponent frameworks, like Fast.
- Serving frontend files with static server and proxy like NGINX and APACHE.
- Serving frontend files from backend fastify server. 

However, all of these issues were either overly complex for our project scope or did not fix our problems.

---

## 2. Decision

We decided to use *Svelte* and *SvelteKit* as our frontend framework.

*Svelte* is a JavaScript compiler. 

*SvelteKit* is a Framework that runs *Svelte*, and provides helpful features like a Router and Hooks.

---

## 3. Rationale

We believe *Svelte* is a perfect blend of developer productivity, simplicity, and performance.

### 3.1 Fast and Lightweight

We want to prioritize speed and simplicity. However, we still want some of the
niceties that come with a framework. We think *Svelte* perfectly strikes this
balance as it: 
- Compiles to optimized JS. 
- No VirtualDOM
- Prefetching page data (if necessary)
- Hot Module Replacment (HMR): only updates what is needed. 
- Small bundle size compared with React and Vue.


### 3.2 Simple Syntax for Pages and Components

The syntaxe for a `.svelte` file is clean and easy to understand:
```
<script>
</script>

// html here

<style>
</style>
```
Both *Svelte* pages, layouts, and components use the same syntax, and it is compiled to Vanilla JS, HTML, and CSS.

This makes it easy to read and write components. 

### 3.3. Built-in Router with Hooks

*SvelteKit* comes with a Router and lets us create server hooks in `hooks.server.js`. This makes it simple, centralized, and secure to authenticate web requests and implement gaurded routes.

### 3.4. Project Structure

*SvelteKit* lays out project files in a clear and intuitive mannor.

A route is definged in `src/routes/<route_name>`

There are three related files.
1. `src/routes/<route_name>/+page.svelte`
    1. Main html, js, and css related to this page.
2. `src/routes/<route_name>/+layout.svelte`
    2. Layouts that are related to this page and all subpages.
3. `src/routes/<route_name>/+page.js`
    3. Exports load function that is called on each page load. This provides a unified place to make fetch data and handle errors. The data returned from this function is easily used in the other svelte files.

### 3.5. Instumentation

If we decide to implement frontend telemetry, *SvelteKit* makes it very easy.


## 4. Alternatives Considered

### NGINX Server

- **Pros:** Reliable and tructed, fast.
- **Cons:** Complex configuration, only solved server needs.

Overall, we felt this would hinder our development speed, and was overkill for the scale of this app (500-1000 concurent users)

### Vue

- **Pros:** Single page components, widely used
- **Cons:** Higher overhead, VirtualDOM

### React

- **Pros:** Vast ecosystem, widely used, React Native
- **Cons:** Higher overhead, VirtualDOM, changes directions often

### Serving Frontend Files from Backend Fastify Server

- **Pros:** Less dependencies, one thing to learn, secure authentication.
- **Cons:** Coupled, doesn't improve DX, hard to manage state

## 5. Consequences

### Positive Outcomes

- Faster development speed.
- Enforced file structures for consistent understanding of code.
- Better error handling.
- We can focus on writing HTML, CSS, and JS instead of wrestling WebComponents.
- We do not have to write our own server, use a complex proxy, or integrate into our backend server.
- Easier template management, especially with different roles.

### Negative Outcomes / Trade-offs

- Although lightweight, still introduces overhead. 
- Slight learning curve.
- Integration costs.
- Smaller ecosystem, compared to React or Vue.
- Another dependency.


---



