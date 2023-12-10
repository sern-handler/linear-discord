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
