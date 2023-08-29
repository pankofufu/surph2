import { ComponentInteraction, AnyInteraction } from 'eris';

import { Modals } from 'lib/message';

import { client } from 'src';
import Event from 'src/classes/Event';

interface InteractionData {
	custom_id: string;
	component_type: number;
}

export default {
	name: 'interactionCreate',
	async run(interaction: AnyInteraction) {
		if (interaction.type !== 3) return;
		const _data = interaction.data;
		if (!_data) return;
		const data = _data as InteractionData;

		client.carousels
			.filter(
				(carousel) =>
					carousel.message.author.id ===
					(interaction.member?.id || interaction.user?.id),
			)
			.every(async (carousel) => {
				await interaction.deferUpdate();
				if (data.custom_id === 'right') carousel.index++;
				else carousel.index--;

				let isFirst = false;
				if (carousel.index === 0) isFirst = true;
				let isLast = false;
				if (carousel.index + 1 === carousel.embeds.length)
					isLast = true;

				await interaction.editOriginalMessage({
					embeds: [carousel.embeds[carousel.index]],
					components: [Modals.CarouselComponents(isFirst, isLast)],
				});
			});

		client.dialogs
			.filter(
				(dialog) =>
					dialog.message.author.id ===
					(interaction.member?.id || interaction.user?.id),
			)
			.every(async (dialog) => {
				await interaction.deferUpdate();

				clearTimeout(dialog.timeout);

				await interaction.editOriginalMessage({
					components: [], // remove them
				});

				if (data.custom_id === 'yes')
					await dialog.onConfirm(interaction as ComponentInteraction);
				else await dialog.onCancel(interaction as ComponentInteraction);
			});
	},
} as Event;
