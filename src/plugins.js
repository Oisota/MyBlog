// custom plugins

// skip loading a given plugin based on a test function
export function skip(opts) {
	if (!opts.test()) {
		return opts.plugin(opts.opts);
	}
	return (files, metalsmith, done) => {
		setImmediate(done);
	};
};

// calculate tag counts as a percentage of total amount of tags
export function tagPercents(opts) {
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
					slug: posts.urlSafe,
					percent: Math.floor((posts.length / tagSum) * 100),
					count: posts.length,
				}
			});

		metadata[metaKey] = topics;
		setImmediate(done);
	};
};

// helper for debugging other plugins
export function log() {
	return (files, metalsmith, done) => {
		console.log(metalsmith);
		setImmediate(done);
	};
};
