import { fileURLToPath } from 'node:url'
import { dirname } from 'path'
import Metalsmith from 'metalsmith'
import layouts from '@metalsmith/layouts'
import collections from '@metalsmith/collections'
import drafts from '@metalsmith/drafts'
import excerpts from '@metalsmith/excerpts'
import inPlace from '@metalsmith/in-place'
import permalinks from '@metalsmith/permalinks'
import highlight from 'highlight.js'
import fileMetadata from 'metalsmith-filemetadata'
import dateFormatter from 'metalsmith-date-formatter'
import fingerprint from 'metalsmith-fingerprint-ignore'
import watch from 'metalsmith-watch'
import feed from 'metalsmith-feed'
import metafiles from 'metalsmith-metafiles'
import tags from 'metalsmith-tags'
import { skip, tagPercents } from './plugins.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const engineOptions = {
	langPrefix: 'hljs ',
	highlight: (code, lang) => highlight.highlight(code, {language: lang}).value,
}

Metalsmith(__dirname)
.metadata({
	liveReloadEnabled: process.env.NODE_ENV === 'development',
	commentsEnabled: process.env.NODE_ENV === 'production',
	site: {
		title: 'Derek Morey',
		author: 'Derek Morey',
		author_email: 'derek.o.morey@gmail.com',
		url: 'https://derekmorey.me/',
		rssUrl: '/rss.xml',
	},
	links: {
		social: [
			{title: 'GitHub', url: 'https://github.com/Oisota', icon: 'lab la-github'},
			{title: 'LinkedIn', url: 'https://linkedin.com/in/derek-o-morey', icon: 'la la-linkedin'},
			{title: 'Instagram', url: 'https://www.instagram.com/oisota/', icon: 'lab la-instagram'},
			{title: 'RSS', url: '/rss.xml', icon: 'las la-rss'},
		]
	},
})
.source('src')
.destination('dist')
.clean(true)
.use(skip({
	test: () => process.env.NODE_ENV === 'production',
	plugin: watch,
	opts: {
		paths: {
			'${source}/**/*': '**/*',
			'layouts/**/*': '**/*',
		},
		livereload: 8081,
	}
}))
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
	pattern: 'css/*.css',
}))
.use(excerpts())
.use(collections({
	blog: {
		pattern: 'blog/*',
		sort: 'date:desc',
	},
	projects: {
		pattern: 'projects/*',
		sort: 'index:asc',
	},
	navlinks: {
		sort: 'index:asc',
	},
}))
.use(permalinks({
	match: '**/*.html',
	trailingSlash: true,
	directoryIndex: 'index.html',
	linksets: [{
		trailingSlash: true,
		match: { collection: 'blog' },
		pattern: 'blog/:date/:title'
	}]
}))
.use(dateFormatter({
	dates: [{
		key: 'date',
		format: 'YYYY-MM-DD'
	}]
}))
.use(feed({
	collection: 'blog'
}))
.use(layouts({
	transform: 'nunjucks',
	pattern: '**/*.html',
	engineOptions: engineOptions,
}))
.build((err, files) => {
	if (err) { throw err; } 
	else { console.log('W00T, it WORKED!'); }
});
