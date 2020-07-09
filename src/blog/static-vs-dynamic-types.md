---
title: "On static vs dynamic type systems"
date: 2019-12-12
drafts: true
---

In statically typed languages, new types get created for no reason other than for type checking rather than using a built in container type like list/tuple/dictionary.
This leads to lots of opaque types that require the programmer to inspect them instead of dealing with a simple object with properties.
The programmer already knows how the basic container types work, but must now learn a unique API for each opaque type.

Consider the JavaScript below:
```javascript
const p = {
	x: 4,
	y: 10
};
```
It is immediately obvious that `p` is a plain JavaScript object with 2 properties.
There is almost no cognitive load for the programmer to understand what it is.

Compare that to a java example:
```java
Point p = new Point(5, 10)
```
Its still obvious that `p` is a point, but now the programmer has zero understanding of the internal data representation and external API that is available on `p`.
Is `p.x` a valid property access?
Or is it `p.getX()`?
Or (depending on language) even `p['x']`?

The above examples are simple enough that its not hard to understand both but the cognitive load increases greatly in static languages when there are large nested data structures composed of many opaque types.
A more real world example could be a configuration object for sending an HTTP request.

In a dynamic language like JavaScript it could be:
```javascript
const request = {
	url: 'https://foo-bar.com/api/widgets',
	method: 'GET',
	auth: {
		username: 'User1',
		password: 'secret',
	}
}
```

Something roughly equivalent in Java or any other STL might be:
```java
RequestConfig request = RequestConfigBuilder()
	.url(new URL('https://foo-bar.com/api/widgets'))
	.method(HTTPMethod.GET)
	.auth(new Auth('User1', 'secret'))
	.build();
```
