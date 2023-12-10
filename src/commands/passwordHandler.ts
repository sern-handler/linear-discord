import { commandModule, CommandType } from '@sern/handler';
import { stripIndents } from 'common-tags';
import type { BaseGuildTextChannel } from 'discord.js';

export default commandModule({
    name: 'password-create',
    type: CommandType.Modal,
    plugins: [],
    execute: async (ctx) => {
        const title = ctx.fields.getTextInputValue('title');
        const url = ctx.fields.getTextInputValue('url');
        const username = ctx.fields.getTextInputValue('username');
        const password = ctx.fields.getTextInputValue('password');

        const channel = await ctx.guild?.channels.fetch(process.env.PASSWORD_CHANNEL!) as BaseGuildTextChannel;
        if (!channel) return ctx.reply({ content: 'Password channel not found', ephemeral: true });

        const messageContent = stripIndents`
            ## ${title}
            **Service URL:** <${url}>
            **Username:** ||\`${username}\`||
            **Password:** ||\`${password}\`||
        `
        await channel.send({ content: messageContent });
        await ctx.reply({ content: 'Password sent!', ephemeral: true });
    },
});