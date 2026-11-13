/*
 * Generate a global context we can pass to all the templates
 * should:
 *  - read in all markdown files
 *  - create collections
 *  - handle file url mapping (fingerprinting, blog url mapping, etc)
 *  - create tag list I think
 */
import parseArgs from 'node:util'
import matter from 'gray-matter'

// parse cli args
// genContext.js <md-file> <md-file> ...
const { values, positionals } = parseArgs({
	allowPositionals: true
})

const context = {
	meta: {
	},
	collections: {
	},
	tags: {
	}
};

positionals.forEach((filePath) => {
	const { data, content } = matter(filePath)

	if (data.collection && Array.isArray(data.collection)) {
		data.collection.forEach(c => {
			context.collections[c].push(data)
		})
	}

	if (data.tags && Array.isArray(data.tags)) {
		data.tags.forEach(t => {
			if (!Object.hasOwnProperty(context.tags, t) {
				context.tags[t] = []
			}
			context.tags[t].push(data)
		})
	}
})

console.log(JSON.stringify(context))
