---
title: Return Early From Functions
date: "2020-07-16"
draft: true
---

In general I find it preferable to return early from functions whenever possible.
What I mean by this is that the code in a function should try to fail as soon as possible and exit the function.
The code should check first thing whether or not its possible to continue.

An example of this could be something like handling an http request meant to update some resource on the server.

```python
def update_foo(foo_id):
	foo_from_db = FooModel.query.get(foo_id)

	if foo_from_db is None:
		raise NotFound('foo not found')
```
