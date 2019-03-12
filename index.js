const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const highlight = require('highlight.js');
const fileMetadata = require('metalsmith-filemetadata');
const dateFormatter = require('metalsmith-date-formatter');
const collections = require('metalsmith-collections');
const drafts = require('metalsmith-drafts');
const excerpts = require('metalsmith-excerpts');
const fingerprint = require('metalsmith-fingerprint-ignore');
const watch = require('metalsmith-watch');

function skip(opts) {
	if (!opts.test()) {
		return opts.plugin(opts.opts);
	}
	return (files, metalsmith, done) => {
		setImmediate(done);
	};
}

Metalsmith(__dirname)
.metadata({
	liveReloadEnabled: process.env.NODE_ENV === 'development',
	site: {
		author: 'Derek Morey',
		author_email: 'derek.o.morey@gmail.com',
		url: 'https://oisota.github.io/'
	},
	links: {
		nav: [
			{title: 'Home', path: '/'},
			{title: 'About', path: '/about/'},
			{title: 'Archive', path: '/archive/'},
			{title: 'Contact', path: '/contact/'}
		],
		social: [
			{title: 'Github', url: 'https://github.com/Oisota'},
			{title: 'LinkedIn', url: 'https://linkedin.com/in/derek-o-morey'},
		]
	}
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
.use(inPlace({
	engineOptions: {
		langPrefix: 'hljs ',
		highlight: (code, lang) => highlight.highlight(lang, code).value,
	},
}))
.use(excerpts())
.use(collections({
	blog: {
		pattern: 'blog/*',
		sortBy: 'date',
		reverse: true
	}
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
.use(fingerprint({
	pattern: 'css/*.css',
}))
.use(layouts())
.build((err, files) => {
	if (err) { throw err; } 
	else { console.log('W00T, it WORKED!'); }
});
