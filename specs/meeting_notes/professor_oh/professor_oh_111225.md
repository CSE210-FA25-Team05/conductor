Attendance

- Justin, Omair, Peter, Zerlina

Presentation Format

- There are two kinds of stakeholders (that the Prof/TA will be roleplaying)
- Business Stakeholder
  - They want to see progress/activity
  - Proof of effort
  - You don't want to upset their assumptions about where you are/what's going on - the work shouldn't be so far gone that they feel like they can't change anything.
  - They would be looking for demos/screenshots/etc
  - They will most likely glaze over any technical details so don't get too far in the weeds about what you're doing.
- Technical Stakeholder
  - They'll be looking at the architecture and progress in the codebase.
  - They want proof of quality
    - Do you have build pipelines?
    - "Quality isn't sprinkled on - it's baked in"
      - They want to see early efforts to make sure that the final product has viability long term.
- Both groups are looking to address one thing: risk
  - If they see risk on either end of their domains they will be upset.
  - Both groups will need to have felt like they've been spoken to.
  - Do not get into the weeds in either end as well - getting too specific about one thing will cause another stakeholder to get bored.
  - They might feel like you're ignoring them because you can't explain what it is that they're doing.
- This class is about doing three kinds of presentations
  - Starting Something
    - This was the "Warmup Project"
  - Showing Progress
    - This will be the "Sprint Review"
  - Launching Something
    - This will be the "Final Exam"
- We will most likely have 5-10 mins, try to get closer to 5 because of how many groups there are going to be.
  - Presenting earlier will mean that you have a more permissive grading structure, presenting later means you need to have your act together because you had opportunities to learn from other groups.

ADR Granularity

- You can group them together at some point
- ADRs are mostly about creating a written trail for understanding a decision you made and validating it when someone asks you about it.
  - You're protecting against a "time traveler"
  - Someone from the future who's in love with a tech stack asking "Why did you choose what you did, mine is better"
  - Or if something goes wrong in the future and someone says "why did you choose this" you'll have a rationale.

Justin's Question

- Question:
  - Does it make sense to split the frontend/backend?
- You can split it but it might make things complicated.
- The assumption here is that microservices are preferred - this is a relatively new development in WebDev.
- It isn't necessary per se - we don't expect more than 1000 people to use this app so it won't have to scale to a very large level.
- There are frameworks that can do sessionization like Larval and Symphony (in PHP).

UI Comments

- Largely moving in the right direction.
- The point of concern is prioritization - what do you want the user that you're targeting to see.
- As it stands the UI is making no suggestions or push - the user is presented with every option which would cause a large cognitive load.
- What is the travel time it takes for the targeted user to get something done
  - Student - they want to take attendance ASAP
  - Professor - they want to see the class mood ASAP
- You want to play "UI Golf"
  - take the least amount of time to get something done.
- Labels and Topics
  - You want the user to know what they're about to get into before they click a link.
  - The UI labels have to be:
    - Consistent
    - Regular
    - Most likely need to be two words.
  - No one understands what "User Manager" is - you may have to rename to create clarity.
  - The goal is to reduce cognitive load.
  - The abundance of choice can lead to failure.
- The users will be using the top left and bottom of the screen of their device the most.
- Make sure you think about hierarchy of what the user is using the app for (students will have a different set of rankings than TA).

Comprehensive Exam Review

- Based out of the SWEBOK (https://www.computer.org/education/bodies-of-knowledge/software-engineering) categories.
  - Ignores the last three.
- Before the last week of class (Week 10) we will be provided a bank of questions (approximately 1-3 questions per section, approx. 45 questions) that we will have to research and write up answers for covering the topics that are discussed.
- This writeup must be submitted the day before an oral interview.
  - You are allowed to bring these answers to refer to during the oral interview.
- The assessment will be a 30 minute oral exam in which you have a conversation with Powell based on a selection of questions of his choice.
  - There will be approximately 8 questions (mostly time based).
  - Also known as a "Soviet style exam"
- He is looking to see if you are on par as an "emerging peer" in the sophistication of your responses.
  - It is a casual conversation - starts with some easier questions, moves into harder ones, and then winds down with some easier ones again.
- If it's borderline he may look at the writeup but its very rare that anyone is borderline - he can tell if you're good enough through talking with you.
- Relying on ChatGPT will most likely result in a fail - you really do have to put in the research and work in the week before.
- Be careful because you'll have other responsibilities both inside and outside class so consider if you have the bandwidth to pay attention to this.
