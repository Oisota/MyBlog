import path from 'node:path'
import Metalsmith from 'metalsmith'
import layouts from '@metalsmith/layouts'
import collections from '@metalsmith/collections'
import drafts from '@metalsmith/drafts'
import excerpts from '@metalsmith/excerpts'
import inPlace from '@metalsmith/in-place'
import permalinks from '@metalsmith/permalinks'
import highlight from 'highlight.js'
import fileMetadata from 'metalsmith-filemetadata'
import feed from 'metalsmith-feed'
import metafiles from 'metalsmith-metafiles'
import tags from 'metalsmith-tags'
import remove from '@metalsmith/remove'
import { tagPercents, fingerprint } from './plugins.js'

const parentDir = path.resolve(import.meta.dirname, '..')
const buildDir = process.env.BUILD_DIR

const engineOptions = {
	langPrefix: 'hljs ',
	highlight: (code, lang) => highlight.highlight(code, {language: lang}).value,
}

Metalsmith(parentDir)
.metadata({
	site: {
		author: 'Derek Morey',
		url: 'https://derekmorey.me/',
		rssUrl: '/rss.xml',
	},
	links: {
		social: [
			{title: 'GitHub', url: 'https://github.com/Oisota', icon: 'lab la-github'},
			{title: 'LinkedIn', url: 'https://www.linkedin.com/in/derek-o-morey/', icon: 'la la-linkedin'},
			{title: 'Instagram', url: 'https://www.instagram.com/oisota/', icon: 'lab la-instagram'},
			{title: 'RSS', url: '/rss.xml', icon: 'las la-rss'},
		]
	},
})
.source('./src/site')
.destination(buildDir)
.clean(true)
.use(drafts())
.use(fileMetadata([
	{pattern: 'blog/*', metadata: {layout: 'post.njk'}}
]))
.use(metafiles())
.use(tags({
	handle: 'tags',
	path: 'topics/:tag.html',
	layout: 'tag.njk',
	normalize: true,
	sortBy: 'date',
	reverse: true,
	skipMetaData: false,
	metadataKey: 'category',
	slug: {mode: 'rfc3986'},
}))
.use(tagPercents({
	tagsKey: 'category',
	metaKey: 'topics'
}))
.use(inPlace({
	transform: 'marked',
	extname: '.html',
	engineOptions: engineOptions,
}))
.use(inPlace({
	transform: 'scss',
	extname: '.css',
}))
.use(fingerprint({
	pattern: 'assets/**/*.*',
}))
.use(excerpts())
.use(collections({
	blog: { pattern: 'blog/*', sort: 'date:desc', limit: 10 }, // only show most recent 10 articles on home page
	archive: { pattern: 'blog/*', sort: 'date:desc' }, // same as blog, but with no limit
	projects: { pattern: 'projects/*', sort: 'index:asc' },
	navlinks: { sort: 'index:asc' },
}))
.use(permalinks({
	trailingSlash: true,
	linksets: [{
		match: { collection: 'blog' },
		pattern: 'blog/:date/:title',
		date: 'YYYY-MM-DD'
	}]
}))
.use(feed({
	collection: 'blog'
}))
.use(layouts({
	directory: 'src/layouts',
	transform: 'nunjucks',
	pattern: '**/*.html',
	engineOptions: engineOptions,
}))
.use(remove('projects/*/index.html'))
.build((err, files) => {
	if (err) { throw err; } 
	else { console.log('W00T, it WORKED!'); }
});
