---
title: In Defense of Long Functions
date: 2021-10-14
tags: code-style
draft: true
---

During my time in college and in the programming community at large, I've heard the general sentiment that long functions are bad and short functions are good.
The argument is that short functions are easier to maintain and reason about and that long functions should be rewritten into shorter functions that only do one thing.
This rule is usually accepted as gospel without any opposition or discussion.
It sounds logical at first but is this guideline actually a good rule of thumb?
Are long functions inherently bad and short functions inherently better?
I don't believe this is the case.
The length of a function should not even be considered in most cases.
In fact, there are significant disadvantages to refactoring code into small functions.

When I program, I don't write any functions until I absolutely need to.
I look for at least three examples of code duplication in the code base before I even consider writing a function.
I then make sure its a clear case of doing the exact same thing and not just mere coincidence.
Doing this ensures that my functions actually encapsulate common functionality.
I never try to predict the future and write functions ahead of time unless it is completely obvious that a function is needed.
I also am not bothered at all by how many lines of code a function contains.

## Long Function Advantages
The benefits of this approach is that you focus on solving the problem at hand rather than trying write generic, reusable functions.
The primary goal of making software applications is to solve real world problems.
When writing functions, it is too easy to get distracted by trying to write the perfectly reusable function.
You waste time thinking about what arguments the function should take, how generic it should it be, what the use cases are, who's going to consume it, etc.
Taking the time to think about these things is good when you're writing a library, but not so much when making an application.

Another benefit is that the code base becomes easier to understand and document.
With less functions, there is less cognitive load in understanding how all the functions interact with each other.
The call graph is greatly simplified.
It is much easier to understand 10 functions that are 200-500 SLOC than it is to understand 200 functions that are all 10-50 SLOC.
This is especially true for less experienced developers and developers new to the code base.
They don't have to scour the code base trying understand how every function is used and where its called from.
Documenting the code is easier simply because there is less to document.

## Short Function Disadvantages
I've already alluded to some of the costs of having many short functions but I'll further elaborate my point.
Every time a function is added to a code base, it allows other developers to start calling that function elsewhere in the code.
This can lead to unintended consequences that the original person who wrote the function never considered.
They most likely only considered their own use case and probably only call the function in a few places.
When other people start calling the function, it creates tight coupling between modules where there shouldn't be.
Updating the function then becomes impossible due to other modules depending on it.
These effects can be mitigated to some extent by languages that support private variable scope inside modules and classes, but short functions should still be avoided due to the cognitive load mentioned earlier.

Having short functions can also result in logic getting spread around the code making it difficult to reason about the program overall.
Understanding the code requires searching through files and directories rather than reading the code top to bottom.

## Code Examples
Often times people will rewrite a long function into smaller ones whose names really only serve as comments about the code.
Here is an exaggerated example:

```javascript
function superLongFunction(a, b, c, d) {
	const x = doFooThing(a, b);	
	const y = doBarThing(x, c);
	const z = doBatThing(y, d);
	return x + y + z;
}

function doFooThing(a, b) {
	// 10-50 SLOC
}
function doBarThing(x, c) {
	// 10-50 SLOC
}
function doBatThing(y, d) {
	// 10-50 SLOC
}
```

The developer has rewritten `superLongFunction` into 3 function calls.
These functions are all only once and are only called in `superLongFunction`.
This makes the code somewhat clearer in its intent, but it comes with costs mentioned previously.
Now, in order to understand `superLongFunction`, you have to find `doFooThing`, `doBarThing`, and `doBatThing` and in the code base.
Early on this is not a problem, but over time functions can get moved around obstructing the flow of logic further.
There are now 3 more functions that may be consumed in the future by other developers not knowing that they were only meant to be called from `superLongFunction`.

It would be much clearer and effective to simply add in some comments like so:

```javascript
function superLongFunction(a, b, c, d) {
	// do Foo Thing here
	const x = // 20-50 SLOC
	// do Bar Thing here
	const y = // 20-50 SLOC
	// do Bat Thing here
	const z = // 20-50 SLOC
	return z
}
```

This way, the intent is just as clear, and no new functions are added that have to be maintained and documented.
Everything stays inside `superLongFunction`.

Another alternative would be to use inner functions if your language supports them.

```javascript
function superLongFunction(a, b, c, d) {
	function doFooThing(a, b) {...}
	function doBarThing(x, c) {...}
	function doBatThing(y, d) {...}

	const x = doFooThing(a, b);	
	const y = doBarThing(x, c);
	const z = doBatThing(y, d);
	return z;
}
```

Inner functions are great because they keep everything encapsulated and you can pass in only the variables needed for the calculation.
This makes it immediately clear which data the code is operating on and allows the code to be broken out later if ever need be.
The only downside (depending on if the language has closures) would be that the inner functions can still access the outer functions variables.

## Conclusion
Functions are an integral unit of abstraction but they shouldn't be used when simple comments will do or when an existing function has gotten a little long.
They should be used to encapsulate a reusable piece of logic that needs to be referenced in many places.

Brian Will talks about similar ideas in [this](https://youtu.be/QM1iUe6IofM?t=2235) video.

# Addendum
Ideally, languages should provide a construct for creating private scopes within functions.
In JavaScript, it could look something like this:

```javascript
function myFunction() {
	const a = 'a';
	const b = 'c';
	const c = 'c';

	const x = scope (a, b) {
		return a + b;
	}

	return c + x;
}
```

Where the `scope` block would create a private scope that captures `a` and `b`.
This would allow grouping logic together in private scopes and prevent the need for having lots of variables local to the function.