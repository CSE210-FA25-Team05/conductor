# ADR: Code Documentation Automation

**Date:** 2025-11-10  
**Status:** Accepted  

---

## 1. Context

One of the requirements for the CI/CD submission and a generally good practice is to have documentation. The suggested tool was Jsdoc, but that is usually manually called on a terminal. Adding automation removes the need to worry about it.

---

## 2. Decision

Chose to use Husky to run a script calling the Jsdoc to run automattically. This automatically links the repo to Git hooks and allows for running Jsdoc through scripts when something like a commit is done. 

---

## 3. Alternatives Considered

### Git Hook
Easiest way to do locally, but not easily sharable for other devices. Done by manually making some files in .git folder. But it is not shared when cloned by other people.

### Github CI/CD
Add a script on Github workflows to generate documentation, and have it generated in the CI/CD pipeline. This is sharable and runs on server end. 


---

## 4. Consequences

### Positive Outcomes

-  Automatic updating of documentation from local end whenever a commit is done.
-  More control on documentation compared to other automated methods mentioned since its local.
-  Very easy to run and requires pretty much no effort

### Negative Outcomes / Trade-offs

-  No easy way to do it from Github repository side
-  By using jsdoc there is less control on how the documentation is written
-  Will only work if the JS code files are formatted correctly, otherwise may have issues

---
