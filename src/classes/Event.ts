import Eris from 'eris';

export default interface Event {
	name: keyof Eris.ClientEvents;
	once?: boolean;
	run: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>);
}
