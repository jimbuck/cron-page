#!/usr/bin/env node

import prompts from 'prompts';
import cron from 'node-cron';

import yargs, { command } from 'yargs';
import { hideBin } from 'yargs/helpers';
import startup from 'user-startup';
import { cronToHumanString } from './utils.js';
import { MONDAY_TO_FRIDAY_9TO5, CronPage } from './index.js';

const COMMAND = 'cron-page';

// Required to make this file an ES Module.
export { };

console.log(); // Write a newline to separate from command.
yargs(hideBin(process.argv))
	.scriptName(COMMAND)
	.command(['setup', 'install'], 'Configure the scheduler.', setup)
	.command(['remove', 'uninstall'], 'Disables the scheduler and removes it from startup.', remove)
	.command({
		command: 'run <url>',
		describe: 'Starts the scheduler service.',
		builder: yargs => yargs.positional('url', {
			describe: 'The URL to open.',
			demandOption: true,
			type: 'string',
		}).option('schedule', {
			alias: ['cron'],
			describe: 'The cron schedule to use.',
			default: MONDAY_TO_FRIDAY_9TO5,
			defaultDescription: `${MONDAY_TO_FRIDAY_9TO5} (every hour 9:55AM to 4:55PM on Monday through Friday)`,
			coerce(value: string) {
				if (!cron.validate(value)) throw new Error('Invalid cron schedule!');
				return value;
			}
		}),
		handler: run,
	})
	.help()
	.showHelpOnFail(true)
	.demandCommand(1)
	.argv;

async function setup() {
	const sudoBlock = (await import('sudo-block')).default;
	sudoBlock();

	const { url }: { url: string } = await prompts([
		{
			type: 'text',
			name: 'url',
			message: 'Which URL do you want to open?',
			initial: 'https://',
		}]);
	
	let schedule: string = MONDAY_TO_FRIDAY_9TO5;
	let confirmed: boolean = false;
	
	do {
		const answers = await prompts([
			{
				type: 'text',
				name: 'schedule',
				message: 'How often should it open (cron)?',
				initial: schedule || MONDAY_TO_FRIDAY_9TO5,
				validate: (value: string) => cron.validate(value) || 'Invalid cron schedule!',
			},
			{
				type: 'confirm',
				name: 'confirmed',
				message(schedule) {
					const cron = cronToHumanString(schedule);
	
					return `You've entered '${cron}', is this correct?`;
				}
			}
		]);

		schedule = answers.schedule;
		confirmed = answers.confirmed;

	} while (confirmed === false); // Check for "equals to false" since trying to exit the prompt will be "undefined".

	try {
		startup.remove(COMMAND);
	} catch { }

	startup.create(COMMAND, COMMAND, ['run', url, ...toArgs({ schedule })]);
}

async function remove() {
	try {
		startup.remove(COMMAND);
	} catch { }
	console.log(`CronPage successfully removed!`);
}

async function run({ url, schedule }: { url: string, schedule: string }) {
	const description = `Open ${url} every ${cronToHumanString(schedule)}`;
	const reminder = new CronPage({ url, schedule, description });
	reminder.start();
}

/**
 * Converts an object into a command line argument array.
 *
 * @param {(Record<string, string | number | boolean>)} params
 * @return {string[]} {string[]}
 */
function toArgs(params: Record<string, any>): string[] {
	return Object.entries(params).reduce((args, [key, value]) => [...args, ...(typeof value === 'boolean' ? (value ? [`--${key}`] : []) : [`--${key}`, `${value}`])], [] as string[]);
}