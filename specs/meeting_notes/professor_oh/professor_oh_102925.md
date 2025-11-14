# Professor Office Hours

## Our Questions

### Is it easy to get a csv list of students' email and name? (Maybe from canvas)

- Not necessarily. Powell wants our app to work without needing canvas, since it is a dependency (and he also doesn’t like canvas). So we must think of how students get added. Should the professor/TAs have to manually input all the student emails? Should the students sign up for the class themselves using a sign up code? Should we stick with our CSV file method?

### Who is the work journal intended for? Who is supposed to see it?

- The work journal is mainly meant for the professor and TAs to see how you are contributing. Its purpose is to provide more signals (more data points) for students to be graded and judged on. Powell suggested that we could allow a toggle between whether our post is public and private though, so that you can keep private thoughts there too.

### What is expected to happen when one of the services we use is no longer available?

- If we use other services, we have to be prepared for that service no longer being an option to us (gone out of business, got too expensive, etc). We could create self-contained solutions. Or use the hexagonal port-adapter pattern when we use dependencies, so that it’s easy to swap out whatever service we’re plugging in. We should think of services as general, not specific, like instead of seeing it as Gradescope, we should think of it as an Assessment Tool so that anything like Gradescope would also fill that role.

### What is meant by “Availability - generally and specifically” for the class directory?

- Generally means your general schedule, something that occurs every week. Like “I don’t work past 10pm” or “I have a class from 2-4pm”. Specifically means availability for that specific week. Like “I have an event going on Friday, so I can’t meet then” or “I won’t be available Thanksgiving week since I’m going back home.” So we need some way for students to change their specific availability on our website.

## Other Things Mentioned

- Powell wants a self-reflection feature that tells you how good you’re doing in the class and on your team. It would use data like conversation activity or git activity to create a score from 1 to 10 telling you how good you’re doing. The purpose is to lessen the work the professor or TAs have to do, calling out bad team members to work more, and instead puts the responsibility on the student themself.
- To go above and beyond on the project, we should create something that we as a student want to use.
- The roles are hierarchical, with professor as the most powerful, then TA, then Tutor, then team leader, then student as the least powerful.
- For authorization, we can use google authentication, but we also need some way to link that student to the university. Usually it will be their UCSD email, but for students without a UCSD email (like extension students), we could use invite codes, which is a secret code given to those students allowing them to sign up for the class.
- It’s okay to have an attendance system where people can cheat, as long as it’s not too easy. Cheating is hard to prevent fully.
