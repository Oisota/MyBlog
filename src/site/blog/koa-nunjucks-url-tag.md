---
title: "Nunjucks Custom URL Tag"
date: "2026-04-15"
tags: koa, nunjucks, javascript
---

Recently I started building a side project using [Koa](https://koajs.com/) on the backend and [Nunjucks](https://mozilla.github.io/nunjucks/) for my template engine.
I use [Django](https://www.djangoproject.com/) at work and I wanted an equivalent to the django template `url` tag.
Nunjucks provides the ability to write custom tags, so I took a stab at implementing something analogous to what I've seen in Django.

Here it is:
```javascript
export function URLExtension(router) {
	this.router = router // koa router instance
	this.tags = ['url']

	this.parse = function(parser, nodes, lexer) {
		const tok = parser.nextToken()

		const args = parser.parseSignature(null, true)
		parser.advanceAfterBlockEnd(tok.value)
		return new nodes.CallExtension(this, 'run', args)
	}

	this.run = function(context, ...args) {
		// handle different params passing (just url, args/kwargs, query params)
		if (args.length === 0) { // no params, throw error
			throw new Error('Not enough args: tag requires at least the route name to be passed in')
		} else if (args.length === 1) {
			return this.router.url(args[0]) // single arg, just route name
		} else if (typeof args[1] === 'object' && !Array.isArray(args[1]) && args[1] !== null) { // params passed as kwargs
			const params = args[1]
			if (params.hasOwnProperty('query')) {
				const query = params.query
				delete params.query
				return this.router.url(args[0], params, {query: query}) // route name, kwargs, and query
			}
			return this.router.url(args[0], args.slice(1)) // route name and kwargs
		} else {
			return this.router.url(...args) // just args so simply foward args array to router
		}

	}
}
```
The bulk of the structure is copied from the Nunjucks [custom tags](https://mozilla.github.io/nunjucks/api.html#custom-tags) docs.
The important part is the `run` function which handles parsing the arguments passed to the tag.
It supports multiple different calling conventions as seen below.
It requires a router object to be passed in which it uses to get the url path from the passed in name.

It is configured like so:
```javascript
nunjucksEnvironment.addExtension('URLExtension', new URLExtension(router))
```
Where `router` is an instance of [@koa/router](https://www.npmjs.com/package/@koa/router).

It's then used in templates like so:
```html
<a class="navbar-brand" href="{% url 'home' %}">{{ site.title }}</a>
```
The benefit here is that we no longer have to hardcode urls in the template.
As long as the name stays the same, url paths can be changed in the code and all templates will update as well. 

The arg parsing supports named/unamed arguments as well as a query param for custom url query strings:
```html
 {% url 'users', id=5, query={active=true} %}
 {% url 'users', 5 %}
 {% url 'users', query={sort=id} %}
 {% url 'home' %}
 ```

 The tag was not hard to implement with the most complex thing being the argument parsing.
 This made writing templates feel a little more familiar to what I was used to.
 Adapting this to other backend JavaScript frameworks should be straightforward as well.
 I hope this article was helpful in some way.
 Happy coding!
