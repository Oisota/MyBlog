---
title: Assigning Boolean Expressions to Variables
date: "2017-12-19"
tags: code-style
---

This is just a design pattern I wanted to share.
It makes complicated `if/else` blocks more readable in my opinion.
When writing a conditional you can sometimes end up with several expressions that are being tested.
It can look something like this:

```javascript
if (foo > 100 && foo < 200 && bar === 'some value' && boo === 0) {
	//do stuff
} else {
	//do other stuff
}
```

The code can be made more readable by giving descriptive variable names to each expression being tested.
For example:

```javascript
const fooIsValid = foo > 100 && foo < 200;
const barIsSomeValue = bar === 'some value';
const booIsZero = boo === 0;

if (fooIsValid && barIsSomeValue && booIsZero) {
	//do stuff
} else {
	//do other stuff
}
```

By doing so, the code becomes self documenting as to what each expression means.
The expressions can then be reused in subsequent conditions like so:

```javascript
const fooIsValid = foo > 100 && foo < 200;
const barIsSomeValue = bar === 'some value';
const booIsZero = boo === 0;

if (fooIsValid && barIsSomeValue && booIsZero) {
	//do stuff
} else if (fooIsValid || !barIsSomeValue){
	//do other stuff
} else {
	//do other things
}
```

With all the conditions defined in one place, editing them becomes much less error prone.
If they were inline, you might forget to update one of the reused conditions.
Another benefit is that it is trivial to combine and modify the expressions with the boolean operators as shown above.

I find this pattern to be most useful when the boolean expressions become complex enough to warrant needing a comment explaining them but not so complex that they need to be broken out into a separate function.
