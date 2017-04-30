const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const ignore = require('metalsmith-ignore');
const metallic = require('metalsmith-metallic');
const fileMetadata = require('metalsmith-filemetadata');
const dateFormatter = require('metalsmith-date-formatter');
const collections = require('metalsmith-collections');
const drafts = require('metalsmith-drafts');
const nunjucks = require('nunjucks');

nunjucks.configure('./templates', {watch: false});

Metalsmith(__dirname)
.metadata({
	site: {
		author: 'Derek Morey',
		author_email: 'derek.o.morey@gmail.com',
		profile_pic: '/assets/me.jpg',
		url: 'https://oisota.github.io/'
	},
	navlinks: [
		{title: 'Home', path: '/'},
		{title: 'About', path: '/about/'},
		{title: 'Archive', path: '/archive/'},
		{title: 'Contact', path: '/contact/'}
	],
	sociallinks: [
		{title: 'Github', url: 'https://github.com/Oisota'},
		{title: 'LinkedIn', url: 'https://linkedin.com/in/derek-o-morey'},
		{title: 'Gab', url: 'https://gab.ai/DerekMorey'}
	]
})
.source('src')
.destination('build')
.clean(true)
.use(drafts())
.use(fileMetadata([
	{pattern: 'blog/*', metadata: {layout: 'post.html'}},
]))
.use(collections({
	blog: {
		pattern: 'blog/*',
		sortBy: 'date',
		reverse: true
	}
}))
.use(metallic())
.use(markdown())
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
		format: 'dddd, MMMM Do YYYY'
	}]
}))
.use(layouts({
	engine: 'nunjucks',
	directory: 'templates'
}))
.build((err, files) => {
	if (err) { throw err; } 
	else { console.log('W00T, it WORKED!'); }
});
