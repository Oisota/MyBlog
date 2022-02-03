// custom plugins
exports.skip = function skip(opts) {
	if (!opts.test()) {
		return opts.plugin(opts.opts);
	}
	return (files, metalsmith, done) => {
		setImmediate(done);
	};
}

exports.tagPercents = function tagPercents(opts) {
	const tagsKey = opts.tagsKey || 'tags';
	const metaKey = opts.metaKey || 'topics';

	return (files, metalsmith, done) => {
		const metadata = metalsmith.metadata();
		const tags = metadata[tagsKey];

		const tagSum = Object
			.values(tags)
			.reduce((acc, item) => acc + item.length, 0);

		const topics = Object.entries(tags)
			.map((entry) => {
				const [tag, posts] = entry;
				return {
					name: tag,
					slug: tag.slug,
					percent: Math.floor((posts.length / tagSum) * 100),
					count: posts.length,
				}
			});

		metadata[metaKey] = topics;
		setImmediate(done);
	};
}