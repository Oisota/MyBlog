---
title: Return Early From Functions
date: "2021-05-22"
---

In general, I find it preferable to return early from functions whenever possible.
What I mean by this is that the code in a function should try to fail as soon as possible and exit the function.
The first thing the code should do is check whether or not its possible to continue.

Here is an example of some python code that handles an http request.
It does some validation and updates an object from the database.
I would rework this as I don't find it very readable.
```python
def update_foo(foo_id):

	data = request.json()
	if data and data['value'] > 0 and data['value'] < 100:

		foo_from_db = FooModel.query.get(foo_id)
		if foo_from_db:
			foo_from_db.property = "Updated Value"
			# possibly more complex app logic would follow here
			return 200
		else:
			raise NotFound('foo not found')

	else:
		raise BadRequest('Bad Value')

```
We can see that the logic of validating the request data and updating the database object are entwined.
There are also several levels of nesting.
Its not super hard to figure out whats going on but it could be clearer.

Here's how I would rewrite the above code:
```python
def update_foo(foo_id):

	data = request.json()
	if not (data and data['value'] > 0 and data['value'] < 100):
		raise BadRequest('Bad Value')

	foo_from_db = FooModel.query.get(foo_id)
	if foo_from_db is None:
		raise NotFound('foo not found')

	foo_from_db.property = "Updated Value"
	# possibly more complex app logic would follow here

	return 200
```

Here the error handling code is now separate from the app logic.
It is obvious what each piece of code does and it reads linearly rather than having to jump between nested `if`/`else` branches.
All it took was flipping the conditional logic so that the error cases are handled first, rather than in the `else` blocks.

Structuring functions this way makes the code much more readable and easy to follow.
It allows better refactoring in the future as logic is not coupled together and can easily be moved around if need be.