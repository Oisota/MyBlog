const Metalsmith = require('metalsmith');
const layouts = require('@metalsmith/layouts');
const collections = require('@metalsmith/collections');
const drafts = require('@metalsmith/drafts');
const excerpts = require('@metalsmith/excerpts');
const inPlace = require('metalsmith-in-place');
const permalinks = require('@metalsmith/permalinks');
const highlight = require('highlight.js');
const fileMetadata = require('metalsmith-filemetadata');
const dateFormatter = require('metalsmith-date-formatter');
const fingerprint = require('metalsmith-fingerprint-ignore');
const watch = require('metalsmith-watch');
const feed = require('metalsmith-feed');
const metafiles = require('metalsmith-metafiles');
const tags = require('metalsmith-tags');
const { skip, tagPercents } = require('./plugins');

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
		nav: [
			{name: 'home', title: 'Home', path: '/'},
			{name: 'about', title: 'About', path: '/about/'},
			{name: 'projects', title: 'Projects', path: '/projects/'},
			{name: 'topics', title: 'Topics', path: '/topics/'},
			{name: 'archive', title: 'Archive', path: '/archive/'},
			{name: 'contact', title: 'Contact', path: '/contact/'}
		],
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
	engineOptions: {
		langPrefix: 'hljs ',
		highlight: (code, lang) => highlight.highlight(code, {language: lang}).value,
	},
}))
.use(fingerprint({
	pattern: 'css/*.css',
}))
.use(excerpts())
.use(collections({
	blog: {
		pattern: 'blog/*',
		sortBy: 'date',
		reverse: true
	},
	projects: {
		pattern: 'projects/*',
		sortBy: 'index',
	},
}))
.use(permalinks({
	relative: false,
	linksets: [{
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
.use(layouts())
.build((err, files) => {
	if (err) { throw err; } 
	else { console.log('W00T, it WORKED!'); }
});