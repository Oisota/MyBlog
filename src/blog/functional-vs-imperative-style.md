---
title: Functional vs Imperative Programming
date: 2017-04-06
---

A while back I wrote a small JavaScript program that compared the difference between functional and imperative programming styles.
I figured it might make an interesting blog post so here it is.

I wanted to see how each approach would go about solving the same problem and how each solution compared in terms of readability and performance.
The problem I chose to solve is somewhat contrived, but I think it illustrates some key differences in each approach.
The problem being: remove all elements from an array that are less than 100, square every element, and then sum the array.

In order to properly compare the different styles, I ended up splitting the code into four JavaScript files.
One file contains an array generation function and the other three contain the solutions to the problem.

Here is the script used to generate the array:

```javascript
const gen = require('random-seed');

const seed = 'Go Go Power Rangers';
const rand = gen.create(seed);
const len = 10000000;
const n = 10000;

module.exports = () => {
	return Array.from(Array(len)).map(_ => rand(n));
}
```

I used [random-seed](https://www.npmjs.com/package/random-seed) as the random number generator.
Using this module and seeding the generator with the same value ensures that each example operates on the exact same array.

The first script is a naive imperative implementation.
Its what you would write if you thought about doing each task sequentially without giving much thought to performance.
It uses three `for` loops to accomplish each task and ends up being 13 lines of code not counting the array generation and the console statement.

```javascript
const gen_array = require('./array_gen');
const x = gen_array();

const l1 = [];
let sum = 0;
for (let i=0; i<x.length; i++) {
	if (x[i] < 100) {
		l1.push(x[i]);
	}
}
for (let i=0; i<l1.length; i++) {
	l1[i] = Math.pow(l1[i], 2);
}
for (let i=0; i<l1.length; i++) {
	sum += l1[i];
}

console.log(sum);
```

This approach loses out on some performance by iterating through the array three times.
Although, by having separate loops, it is more clear what the code is actually doing as the steps to solve the problem are clearly illustrated by the code.

The next script is a somewhat optimized version of the above example using only a single `for` loop.
This reduces the line count to only 7 lines.

```javascript
const gen_array = require('./array_gen');
const x = gen_array();

let sum = 0;
for (let i=0; i<x.length; i++) {
	if (x[i] < 100) {
		sum += Math.pow(x[i], 2)
	}
}

console.log(sum);
```

This example yields better performance but it comes at the cost of readability and maintainability as all the operations are jumbled together in the single loop.

The final script solves the problem in a functional style and makes use of the array prototype functions `map`, `reduce`, and `filter`.
It is the smallest and most readable at only 4 lines of code.
This approach also suffers a performance loss due to iterating through the array 3 times like the first example.

```javascript
const gen_array = require('./array_gen');
const x = gen_array();

const sum = x
	.filter(a => a < 100)
	.map(a => Math.pow(a, 2))
	.reduce(((a, b) => a + b), 0);

console.log(sum);
```

### Readability
In my opinion, the functional approach is many times more readable than the imperative approach.
This is because the imperative examples have explicit iteration using `for` loops while the functional example has implicit iteration using higher order functions.
The extraneous noise of the `for` loop syntax obscures the meaning of the code and makes it less readable.
At first glance, it isn't immediately obvious what a `for` loop is doing. 
The problem being solved isn't about setting up a counter variable and then indexing off of it.
It is about filtering some data, then transforming it, and then reducing it to a single value.
Contrast `for` loops with `map`, `filter`, and `reduce` where the meaning of the code is much clearer due to the semantic meaning associated with these functions.
`map` transforms lists, `filter` filters elements out of a list based upon a condition, and `reduce` reduces lists to a single value.
The semantic meaning behind these functions allow the code to express its intent much more clearly than with `for` loops.

### Performance
I used the `time` command to time the exeuction of each script.
This gives a rough idea of the performance of each style.
Each script uses the same array generated with the script from above.

```plaintext
$ time node imperative_naive.js
328070766

real0m2.823s
user0m2.788s
sys0m0.036s

$ time node imperative_optimized.js
328070766

real0m2.744s
user0m2.720s
sys0m0.024s

$ time node functional.js
328070766

real0m3.370s
user0m3.356s
sys0m0.016s
			
```

As expected, the second imperative example was the most efficient while the other two examples were less so.
It is interesting to note that even though the first imperative examle and the functional example both iterate over the array three times, the imperative example performs slightly better.
I'm not sure as to why this is.
It could have something to do with the overhead of calling functions on every element in the functional example.
Also keep in mind that the array used in the tests contained 10 million elements, and even then the speed differences are under a second.
When operating on much smaller arrays these differences are likely to be negligible.

### Conclusion
Although each approach solves the problem, they differ in terms of both readability and performance.
The imperative style yielded code that was less readable but more performant while the functional style yielded the oppisite, more readable, less performant.
Taking into account the size of the array used, I would argue that in most situations, the functional style should be preferred over the imperative.
The functional approach requires less lines of code and is more readable.
It also is more maintainable due to the composability of the array methods.
Methods can be easily chained together to further manipulate the array.
Changing the behaviour of the imperative examples requires more consideration, especially for the second example.
That being said, if you have to operate an exceptionally large piece of data and performance is a concern, an imperative style may be a better choice.
