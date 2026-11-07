import parseArgs from 'node:util'
import * as fs from 'node:fs/promises'

import nunjucks from 'nunjucks'
import matter from 'gray-matter'
import { marked } from 'marked'


// parse cli args
// markdown.js --context <ctx.json> foo.md
const { values, positionals } = parseArgs({
	options: {
		context: { type: 'string', short: 'x' },
	},
	allowPositionals: true
})

//read context data file
const data = fs.readFileSync(context)
const ctx = JSON.parse(data)

// parse frontmatter
const context = values.context
const markdownFile = positionals[0]
const { data, content } = matter(markdownFile)

//render markdown
data.content = marked(content)

// render layout
const nj = nunjucks.configure('src/layouts')
Object.entries(ctx).forEach(([key, value]) => {
	nj.addGlobal(key, value)
})
const result = nj.render(data.layout, data)
console.log(result)
