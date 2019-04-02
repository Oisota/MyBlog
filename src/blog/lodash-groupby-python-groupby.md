---
title: "Emulating Python's groupby with Lodash"
date: "2019-04-01"
---

I recently had to move a calculation I was doing on the back-end in Python to the front-end in JavaScript.
The calculation involved grouping a list of items based on a property of each item.
I needed to iterate over a list, creating a new group of items whenever a specific property on the item changed.
The `itertools.groupby` function in Python's standard library behaved pretty much like I expected it to and gave me the result I needed.
After some messing around, I was able get the result I wanted by manipulating the output of `groupby` with the list comprehension below.

```python
import itertools

a = [1,1,1,2,2,2,3,3,3,2,2,1,1]
result = [list(x[1]) for x in itertools.groupby(a)]

print(result)
```

Running the above prints `[[1, 1, 1], [2, 2, 2], [3, 3, 3], [2, 2], [1, 1]]` to the screen.
This is exactly what I needed, a list of lists, grouped together sequentially.
The important thing to note is that the repeated values of 1 and 2 that happen at the end of the list are put into separate groups.
In my case I also had to provide a key function as I was manipulating a list of dictionaries.
My code looked more like `groupby(a, key=lambda x: x['property'])`.
This grouped the dictionaries based on the value of a specific key in the dictionary.

Issues arose when I had to move this code to the front-end in JavaScript.
I was already using Lodash for a few things and I figured it probably had something similar to Python's `groupby`.
Lodash has a function with the same name that behaves similarly, but not exactly the same as Python's.

I started with a fairly direct translation of the Python code to JavaScript/Lodash:

```javascript
import groupBy from 'lodash/groupBy';

const a = [1,1,1,2,2,2,3,3,3,2,2,1,1];
const groups = groupBy(a);
const result = Object.keys(groups).map(k => groups[k]);

console.log(result);
```

This prints the result: `[ [ 1, 1, 1, 1, 1 ], [ 2, 2, 2, 2, 2 ], [ 3, 3, 3 ] ]`.
This result confused me as I assumed the two functions would be equivalent as they had the same name.
Lodash groups all the same values together regardless of where they occur in the array whereas Python will create separate groups for the same values if they occur at different locations in the array.

In order to fix this, I had to write a custom key function to pass in that would account for the same values happening in different locations in the array and treat them as a separate group.
Here is what I came up with:

```javascript
import groupBy from 'lodash/groupBy';

function keyFunc(initialValue) {
	let latch = 0;
	let previous = initialValue;
	return current => {
		if (previous !== current) {
			latch += 1;
		}
		previous = current;
		return [current, latch];
	}
}

const a = [1,1,1,2,2,2,3,3,3,2,2,1,1];
const groups = groupBy(a, keyFunc(a[0]));
const result = Object.keys(groups).map(k => groups[k]);

console.log(result);
```

`keyFunc` is a function that takes the first element of the array as a parameter and returns a function which acts as the actual key function.
Doing it this way creates a closure where the state of the latch and previous element could be saved.
The returned key function increments the `latch` variable whenever a new value is encountered.
The current value and latch are returned as a 2 element array which serves as the actual key value.
This ensures that even if the same values occur in the array in different locations, the latch value, and thus the key value, will be different and the values will be in separate groups.

The updated code gives the expected result: `[ [ 1, 1, 1 ], [ 2, 2, 2 ], [ 3, 3, 3 ], [ 2, 2 ], [ 1, 1 ] ]`, which matches the behavior Python version.