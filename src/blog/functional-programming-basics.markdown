---
title: Functional Programming Basics
date: 2017-05-12
---

Functional Programming is something I've been interested in ever since I first learned about it.
My first exposure to functional programming (FP) was in my comparative programming languages class at college where we used Standard ML for a few projects.
What I enjoyed the most about FP and Standard ML was how elegant and concise the code was.
Since then, I've been trying to get exposed to more FP concepts and learn more about programming in that style.
I am by no means an expert or authority on the subject, but I think I can illustrate the basic concepts one would need in order to get started programming in a more functional style.

Let me start by giving my definition of what FP actually is.
The obvious definition is that functional programming is programming using functions.
This definition, although correct, is vague and does not fully explain the FP style.
A better definition is that functional programming is programming using pure functions and without mutating state.
I think this is a much better description of what FP promotes.
When you write functional code, you write pure functions that don't mutate state.
I'll now explain what this means, how you can apply these concepts in your code, and why you would want to in the first place.

Immutable Data
--------------
FP seeks to minimize the amount of state in a program and it also seeks to avoid mutating that state.
This is achieved by using immutable variables and data structures.
That is, variables and data structures that can't be modified once they're created.
For example, the following statement in JavaScript declaures an immutable variable `x`: `const x = 5;`. 
The value of `x` can not be changed after its initial assignment.
This allows us to better reason about the code because we can guarantee that the value of `x` will always be five.
We don't have to worry about it's value changing elsewhere in the code.


Pure Functions
--------------


First Class Functions
---------------------


Higher Order Functions
----------------------
