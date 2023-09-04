import { print } from 'lib/util/logger';

import Event from 'src/classes/Event';

export default {
	name: 'error',
	async run(err: Error) {
		print.fatal(err.message);
		console.log(err.stack);
	},
} as Event;
