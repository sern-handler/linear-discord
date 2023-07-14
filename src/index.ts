import { Client, GatewayIntentBits } from 'discord.js';
import { Sern, makeDependencies, single } from '@sern/handler';
import { LinearClient } from '@linear/sdk'
import 'dotenv/config'

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
});

/**
 * Where all of your dependencies are composed.
 * '@sern/client' is usually your Discord Client.
 * View documentation for pluggable dependencies
 * Configure your dependency root to your liking.
 * It follows the npm package iti https://itijs.org/.
 * Use this function to access all of your dependencies.
 * This is used for external event modules as well
 */
await makeDependencies({
	build: (root) => 
		root
			.add({ '@sern/client': single(() => client) })
});

export const linear = new LinearClient({
  apiKey: process.env.LINEAR_API
})

//View docs for all options
Sern.init({
	commands: 'dist/commands',
	// events: 'dist/events', //(optional)
});

client.on('ready', () => console.log('Client ready!'))

client.login();
