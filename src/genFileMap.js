import { parseArgs } from 'node:util'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import slug from 'slug'
import matter from 'gray-matter'

/*
 * Wite a file path map to stdout for files that need special path mapping
 *    src/site/blog/foo.md:src/site/blog/<date-slug>/<title-slug>/index.html
 */

// parse cli args
// genContext.js foo.md bar.md bat.md
const { values, positionals } = parseArgs({
	allowPositionals: true
})

// map glob to function that determines path
const pathRules = {
	'**/blog/*.md': (filePath, data) => {
		const title = slug(data.title)
		return `/blog/${data.date}/${title}/index.html`
	},
}

positionals.forEach((filePath) => {
	const { data, content } = matter.read(filePath)
	for (const [rule, calcPath] of Object.entries(pathRules)) {
		if (path.matchesGlob(filePath, rule)) {
			const dst = calcPath(filePath, data)
			console.log(`${filePath}:${dst}`)
			break
		}
	}
})
