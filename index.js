const Metalsmith = require('metalsmith'),
      markdown = require('metalsmith-markdown'),
      layouts = require('metalsmith-layouts'),
      permalinks = require('metalsmith-permalinks'),
      ignore = require('metalsmith-ignore'),
      metallic = require('metalsmith-metallic'),
      fileMetadata = require('metalsmith-filemetadata'),
      collections = require('metalsmith-collections');

Metalsmith(__dirname)
    .metadata({
        site: {
            title: 'Derek Morey',
            author: 'Derek Morey',
            author_email: 'derek.o.morey@gmail.com',
            profile_pic: '/assets/me.jpg'
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
    .use(fileMetadata([
        {pattern: 'posts/*', metadata: {layout: 'post.html'}},
        {pattern: 'projects/*', metadata: {layout: 'project.html'}}
    ]))
    .use(collections({
        posts: {
            pattern: 'posts/*',
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
            match: { collection: 'posts' },
            pattern: 'posts/:date/:title',
        }]
    }))
    .use(layouts({
        engine: 'mustache',
        layouts: 'layouts',
        partials: 'partials'
    }))
    .build((err, files) => {
        if (err) {
            throw err;
        } else {
            console.log('W00T, it WORKED!');
        }
    });
