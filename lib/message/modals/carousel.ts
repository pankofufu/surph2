import { ActionRow, Embed, Message } from 'eris';
import { reply } from '../index';
import { client } from '@surph/src/index';

export const CarouselComponents = (
	left: boolean,
	right: boolean,
): ActionRow => {
	return {
		type: 1,
		components: [
			{
				custom_id: 'left',
				/* Left arrow */ type: 2,
				style: 2,
				emoji: { name: '⬅' },
				disabled: left,
			},
			{
				custom_id: 'right',
				/* Right arrow */ type: 2,
				style: 2,
				emoji: { name: '➡' },
				disabled: right,
			},
		],
	};
};

export interface ActiveCarousel {
	embeds: Embed[];
	index: number;
	message: Message;
}

export const Carousel = async (message: Message, cycle: Embed[]) => {
	const sentmsg = await reply(message, {
		embed: cycle[0],
		components: [
			CarouselComponents(
				true /* start of list, so it's first item */,
				cycle.length == 1 ? true : false,
			),
		],
	});
	client.carousels.push({
		embeds: cycle,
		index: 0,
		message: message,
	} as ActiveCarousel);
	setTimeout(() => {
		client.carousels.filter((carousel, index) => {
			if (carousel.message.id === message.id) {
				client.carousels.splice(index, 1);
				sentmsg.edit({ components: [] });
				return true;
			} else return false;
		});
	}, 30000);
};
