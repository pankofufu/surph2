import * as chrono from 'chrono-node';

export const r2s = (num: number) => Math.floor(num / 1000); // ms timestamp -> s timestamp
export const now = () =>
	r2s(Math.floor(performance.timeOrigin + performance.now()));
export const inPast = (timestamp: number) => timestamp < now();

const cleanText = (input: string, remove: string) =>
	input.replace(remove, '').trim();
// This function isn't recursive and only picks up one duration from a string
export const parse = (text: string) => {
	let _parsed = chrono.parse(text);
	let parsed = _parsed[0];
	if (!parsed) return null;
	let date = parsed.start.date();
	if (!date) return null;
	const _now = new Date(now() * 1000);
	if (
		date.getHours() == 0 &&
		date.getMinutes() == 0 &&
		date.getSeconds() == 0 &&
		date.getMilliseconds() == 0
	)
		date.setHours(_now.getHours(), _now.getMinutes(), _now.getSeconds());

	return {
		clean: cleanText(text, parsed.text),
		timestamp: r2s(date.getTime()),
	};
};
