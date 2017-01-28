const Metalsmith = require('metalsmith'),
      markdown = require('metalsmith-markdown'),
      layouts = require('metalsmith-layouts'),
      permalinks = require('metalsmith-permalinks'),
      ignore = require('metalsmith-ignore'),
      metallic = require('metalsmith-metallic'),
      fileMetadata = require('metalsmith-filemetadata'),
      dateFormatter = require('metalsmith-date-formatter'),
      collections = require('metalsmith-collections'),
      drafts = require('metalsmith-drafts'),
      nunjucks = require('nunjucks');

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
            {title: 'Projects', path: '/projects/'},
            {title: 'Archive', path: '/archive/'},
            {title: 'Contact', path: '/contact/'}
        ]
    })
    .source('src')
    .destination('build')
    .clean(true)
    .use(drafts())
    .use(fileMetadata([
        {pattern: 'blog/*', metadata: {layout: 'post.html'}},
        {pattern: 'projects/*', metadata: {layout: 'project.html'}}
    ]))
    .use(collections({
        blog: {
            pattern: 'blog/*',
            sortBy: 'date',
            reverse: true
        },
        projects: {
            pattern: 'projects/*',
            sortBy: 'title'
        }
    }))
    .use(metallic())
    .use(markdown())
    .use(ignore('projects/*')) //don't generate separate project pages
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
