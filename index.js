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
const feed = require('metalsmith-feed');

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
			{title: 'Home', path: '/'},
			{title: 'About', path: '/about/'},
			{title: 'Projects', path: '/projects/'},
			{title: 'Archive', path: '/archive/'},
			{title: 'Contact', path: '/contact/'}
		],
		social: [
			{title: 'GitHub', url: 'https://github.com/Oisota'},
			{title: 'LinkedIn', url: 'https://linkedin.com/in/derek-o-morey'},
			{title: 'RSS', url: '/rss.xml'},
		]
	},
	"skills": [
		{
			"title": "Languages",
			"items": [
				"Python",
				"JavaScript/Node.js",
				"TypeScript",
				"SQL",
				"Shell Scripting/Bash",
				"HTML",
				"CSS",
				"SASS/SCSS",
				"C",
				"LaTex"
			]
		},
		{
			"title": "Libraries/Frameworks",
			"items": [
				"Flask",
				"SQLAlchemy",
				"Tornado",
				"Vue.js",
				"Axios.js",
				"Chart.js",
				"Lodash",
				"Bootstrap",
				"Bulma",
				"jQuery",
				"Metalsmith",
				"webpack"
			]
		},
		{
			"title": "Tools",
			"items": [
				"MySQL",
				"SQLite",
				"Redis",
				"Nginx",
				"webpack",
				"uWSGI",
				"Linux",
				"git",
				"vim",
				"tmux",
				"ssh"
			]
		}
	]
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
.use(feed({
	collection: 'blog'
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
.use(layouts())
.build((err, files) => {
	if (err) { throw err; } 
	else { console.log('W00T, it WORKED!'); }
});
