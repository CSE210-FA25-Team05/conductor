# Git Guidelines

Our git guidelines are based on [GitHub Flow](https://githubflow.github.io/). This git branching strategy is simpler than gitflow, and encourages continuous delivery.

## Process

- Anything in the main branch is deployable
   - Make sure to only merge stable branch
- To work on something new, create a descriptively named branch off of main (ie: new-oauth2-scopes)
- Commit to that branch locally and regularly push your work to the same named branch on the server
- When you need feedback or help, or you think the branch is ready for merging, open a pull request
   - If branch has been open for too long, and your scared of merge conflicts, you can periodically merge main into feature branch
-  After someone else has reviewed and signed off on the feature, you can merge it into main
   - This commit message should be very descriptive
   - Make sure it passes CI
- Once it is merged and pushed to main, you can and should deploy immediately
- Delete feature branch

## Merging

Each merge into main should be reviewed, and signed off by team leads and QA.

Each  merge into main should be complete with a detailed message in the following form: 

```
## <feature_name>: <feature_description (short)>

**Related Issue:** [Issue #](Issue link)

**Context (Why):**

**Changes (What):**

- **Change 1:** 
- **Change 2:** 

**Testing:**

- **Automated:**
- **Manual:**

** For Reviewers:**

Add notes for reviewers, tag reviewers here

**Checklist:**

- [x] Code follows project style guidelines (`prettier`, `eslint`).
- [x] Documentation updated.
- [x] Added relevant tests.
- [x] CI Passing.
- [x] Considered accessibility implications for frontend.
- [x] Considered reactivity implications for frontend.
```

## Issues:









