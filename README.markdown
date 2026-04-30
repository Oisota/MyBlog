# My Blog ![Build Status](https://github.com/Oisota/MyBlog/actions/workflows/build.yml/badge.svg?branch=master)
This is the source code for my website.
I write my content in markdown and use [metalsmith](http://www.metalsmith.io) to generate the site.
You can visit the site at: [derekmorey.me](https://derekmorey.me).

# Development
The site can worked on locally by running:
```
docker compose up
```
The containers will build the site, rebuild on file changes, and serve the files at `localhost:8080`.