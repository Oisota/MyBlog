# TO DO
- generate global context file from all blog files (collections, url paths, etc)
- might need a custom script that properly generates the blog post paths since make has no way of knowing how to take a post and add the date and title-slug
    - `$(shell gen_blog_posts.js $(SITE)/posts/*.md)` or something similar
    - may need some sort of mapping between the src file and the built file so make can work properly
