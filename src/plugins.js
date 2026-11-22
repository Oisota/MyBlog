/*
 * Misc Custom Plugins
 */

import path from 'node:path'
import crypto from 'node:crypto'


/*
 * Replacement for metalsmith-fingerprint-ignore, generates file content hashes
 * and adds them to the metadata for use in templates. The original files are
 * removed from files being processed.
 */
export function fingerprint(opts) {
	opts = opts || {}
	opts.algo = opts.algo || 'md5' // hash to use
	opts.key = opts.key || 'fingerprint' // metadata key hashes are stored under
	opts.keep = opts.keep || false // whether to keep original files, default false

	if (!opts.pattern) {
		throw new Error('A pattern must be specified in order to match files')
	}

	return (files, metalsmith, done) => {
		const metadata = metalsmith.metadata();
		metadata[opts.key] = (metadata[opts.key] || {})

		Object.keys(files)
			.filter(p => path.matchesGlob(p, opts.pattern))
			.forEach(p => {
				const file = files[p]
				const hash = crypto.createHash(opts.algo).update(file.contents).digest('hex')
				const dir = path.dirname(p)
				const ext = path.extname(p)
				const base = path.basename(p, ext)
				const newPath = path.join(dir, `${base}.${hash}${ext}`)

				files[newPath] = file
				metadata[opts.key][p] = newPath

				if (!opts.keep) {
					delete files[p]
				}
			})

		setImmediate(done)
	}
}

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
