---
title: "Programming Language Design: Private Scopes"
date: "2022-11-02"
tags: programming-language-design
---

## The Problem
Current mainstream programming languages don't provide means of grouping code within a single function or method.
Often, a function can end up being quite long even when its only doing a single task.
The task itself can be complex requiring several steps and calculations but still logically be a single task.
Traditional wisdom states that long functions should be broken up into separate smaller functions, but this scatters logic and becomes hard to follow.
We need a facility for grouping and encapsulating code within a function.
It should group logic together and be easy to comprehend.

## The Solution
I propose adding a private scoping construct to our programming language tool belt.
It would create a new private scope within a function that would not have access to the outer scope.
Any data needed from the outer scope would need to be explicitly passed in.
A return could then be used to get data back out from the scope.
All variables created inside would remain private to the scope.

In JavaScript, it could look something like this:

```javascript
function foo(a, b, c) {
	// calculate x
	const x = scope (a, b) {
		const i = a * a;
		const j = b + 5;
		return i + j;
	}

	return c + x;
}
```

In this example, `a` and `b` are scoped and used to calculate a value that is returned and saved to the `x` variable.
This variable is then used to get the final result.

This allows grouping relevant code together while still maintaining a linear flow of logic.
With comments above each scope it becomes obvious what each section of code is doing.
The function namespace is also not polluted with extraneous temporary variables.
