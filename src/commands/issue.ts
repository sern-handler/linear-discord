import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish.js';
import { ApplicationCommandOptionType, codeBlock, EmbedBuilder } from 'discord.js';
import { linear } from '../index.js';
import dayjs from 'dayjs';

function statusEmojiResolver(type: IssueStateType) {
	switch (type) {
		case 'backlog':
			return '<:linearBacklog:1129435189207113821>'
		case 'unstarted':
			return '<:linearTodo:1129435201647415346>'
		case 'started':
			return '<:linearInProgress:1129435196928835686>'
		case 'completed':
			return '<:linearDone:1129435193820839977>'
		case 'canceled':
			return '<:linearCanceledOrDuplicate:1129435191845335100>'
	}
}

function issuePriorityResolver(priorityNumber: IssuePriorityPossibleNumbers): IssuePriority {
	switch (priorityNumber) {
		case 0:
			return { emoji: '<:linearNoPriority:1129447473400782848>', title: 'No priority' }
		case 1:
			return { emoji: '<:linearUrgent:1129447509270474832>', title: 'Urgent' }
		case 2:
			return { emoji: '<:linearHigh:1129447346514702356>', title: 'High' }
		case 3:
			return { emoji: '<:linearMedium:1129447410322657422>', title: 'Medium' }
		case 4:
			return { emoji: '<:linearLow:1129447378823422062>', title: 'Low' }
	}
}

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Mention a linear issue',
	options: [
		{
			name: 'issue',
			description: 'Look up the issue',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
			command: {
				onEvent: [],
				async execute (ctx) {
					const focusedValue = ctx.options.getFocused();
					const choices = (await linear.issues()).nodes
					const generatedString = choices.map(choice => { return { generatedString: `${choice.identifier} - ${choice.title}`, id: choice.id } as Choice })
					const filtered = generatedString.filter(choice => choice.generatedString.includes(focusedValue)).slice(0, 25)
					await ctx.respond(
						filtered.map(choice => ({ name: choice.generatedString, value: choice.id })),
					);
				},
			}
		}
	],
	execute: async (ctx, [, args]) => {
		try {
			const issueid = args.getString('issue', true)

			const issue = await linear.issue(issueid)
			const issueCreator = await issue.creator!
			const issueState = await issue.state!
			const issuePriority = issue.priority as IssuePriorityPossibleNumbers
			const issueAssignee = await issue.assignee
			const issueProject = await issue.project

			const embed = new EmbedBuilder()
				.setColor('Random')
				.setAuthor({ name: issueCreator.displayName || issueCreator.email!, iconURL: issueCreator.avatarUrl, url: issueCreator.url })
				.setTitle(issue.title)
				.setURL(issue.url)
				.setDescription(`${issue.description ? codeBlock(issue.description) : ''}\nInfo:\n- Status: ${statusEmojiResolver(issueState.type as IssueStateType)} ${issueState.name}\n- Priority: ${issuePriorityResolver(issuePriority).emoji} ${issuePriorityResolver(issuePriority).title}\n- Assignee: ${issueAssignee ? `[${issueAssignee.name}](${issueAssignee.url})` : 'none'}\n- Project: ${issueProject ? `[${issueProject.name}](${issueProject.url})` : 'none'}\n- On project milestone: ${issue.projectMilestone || 'none'}\n- Due date: ${issue.dueDate ? dayjs(issue.dueDate).format('MM/DD/YYYY HH:mm') : 'none'}`)

			ctx.reply({ embeds: [embed] })
		} catch {
			await ctx.reply({ content: `Something went wrong while trying to run the command. Try again.`, ephemeral: true })
		}
	},
});

interface Choice {
	generatedString: string,
	id: string
}

type IssueStateType = 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled'
type IssuePriorityPossibleNumbers = 0 | 1 | 2 | 3 | 4

interface IssuePriority {
	emoji: string
	title: string
}