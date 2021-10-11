#!/usr/bin/env node

import prompts from 'prompts';
import cron from 'node-cron';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import startup from 'user-startup';
import { cronToHumanString } from './utils.js';
import { MONDAY_TO_FRIDAY_9TO5, RecordReminder } from './index.js';

const STARTUP_SCRIPT = 'RecordReminder';


console.log(); // Write a newline to separate from command.
yargs(hideBin(process.argv))
	.scriptName('record-reminder')
	.command(['setup', 'install'], 'Configure the reminder.', setup)
	.command(['remove', 'uninstall'], 'Disables the reminder and removes it from startup.', remove)
	.command({
		command: 'run <url>',
		describe: 'Starts the reminder service.',
		builder: yargs => yargs.positional('url', {
			describe: 'The URL to open.',
			demandOption: true,
			type: 'string',
		}).option('schedule', {
			alias: ['cron'],
			describe: 'The cron schedule to use.',
			default: MONDAY_TO_FRIDAY_9TO5,
			defaultDescription: `${MONDAY_TO_FRIDAY_9TO5} (9AM to 5PM on Monday through Friday)`,
			coerce(value: string) {
				if (!cron.validate(value)) throw new Error('Invalid cron schedule!');
				return value;
			}
		}),
		handler: run,
	})
	.help()
	.showHelpOnFail(true)
	.demandCommand(1, '')
	.argv;



async function setup() {
	const sudoBlock = (await import('sudo-block')).default;
	sudoBlock();

	const config = await prompts([
		{
			type: 'text',
			name: 'url',
			message: 'Which URL do you want to open?',
			initial: 'https://',
		},
		{
			type: 'text',
			name: 'schedule',
			message: 'How often should it open (cron)?',
			initial: '0 9-17 * * 1-5',
			validate: (value: string) => cron.validate(value) || 'Invalid cron schedule!',
		},
		{
			type: 'toggle',
			name: 'runAtStartup',
			message: 'Run at startup?',
			initial: true,
		}
	]);

	console.log(toArgs(config));
	try {
		startup.remove(STARTUP_SCRIPT);
	} catch { }
	startup.create(STARTUP_SCRIPT, 'record-reminder', ['run', ...toArgs(config)]);
}

async function remove() {
	try {
		startup.remove(STARTUP_SCRIPT);
	} catch { }
	console.log(`Reminder successfully removed!`);
}

async function run({ url, schedule }: { url: string, schedule: string }) {
	const description = `Open ${url} every ${cronToHumanString(schedule)}`;
	const reminder = new RecordReminder({ url, schedule, description });
	reminder.start();
}

/**
 * Converts an object into a command line argument array.
 *
 * @param {(Record<string, string | number | boolean>)} params
 * @return {string[]} {string[]}
 */
function toArgs(params: Record<string, string | number | boolean>): string[] {
	return Object.entries(params).reduce((args, [key, value]) => [...args, ...(typeof value === 'boolean' ? (value ? [`--${key}`] : []) : [`--${key}`, `${value}`])], [] as string[]);
}

