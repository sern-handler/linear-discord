import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish.js';
import { ActionRowBuilder, ModalBuilder, TextInputStyle } from 'discord.js';
import { ModalActionRowComponentBuilder, TextInputBuilder } from '@discordjs/builders';

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'Sends a new password to the channel.',
    options: [],
    execute: async (ctx, options) => {
        const modal = new ModalBuilder()
            .setCustomId('password-create')
            .setTitle('Create Password')
        const title = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Service title')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Automata Github')
                .setRequired(true)
        )
        const serviceurl = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId('url')
                .setLabel('Service URL')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('https://github.com/login')
                .setRequired(true)
        )
        const username = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId('username')
                .setLabel('Username')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('username')
                .setRequired(true)
        )
        const password = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId('password')
                .setLabel('Password')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('password')
                .setRequired(true)
        )
        modal.addComponents(title, serviceurl, username, password)
        ctx.interaction.showModal(modal)
    },
});