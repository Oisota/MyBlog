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
//const sass = require('metalsmith-sass');
//const nunjucks = require('nunjucks');

Metalsmith(__dirname)
.metadata({
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
			{title: 'Gab', url: 'https://gab.ai/DerekMorey'}
		]
	}
})
.source('src')
.destination('dist')
.clean(true)
.use(drafts())
.use(fileMetadata([
	{pattern: 'blog/*', metadata: {layout: 'post.njk'}}
]))
.use(inPlace({
	engineOptions: {
		highlight: code => highlight.highlightAuto(code).value,
		languages: [],
	},
}))
.use(collections({
	blog: {
		pattern: 'blog/*',
		sortBy: 'date',
		reverse: true
	}
}))
.use(excerpts())
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
