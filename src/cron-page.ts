import SysTray from 'systray';
import open from 'open';
import cron from 'node-cron';
import { cronToHumanString } from './utils.js';

import { defaultIcon } from './icon.js';

export interface Config {
	title?: string,
	description?: string,
	schedule?: string;
	url: string;
	app?: 'chrome' | 'edge' | 'firefox',
	icon?: string;
}

export const MONDAY_TO_FRIDAY_9TO5 = '55 9-17 * * 1-5';

const TOGGLE_TITLE = 'Active';
let OPEN_TITLE = 'Open Page';
const EXIT_TITLE = 'Exit';


export class CronPage {

	private tray: SysTray;
	private cron: cron.ScheduledTask;

	constructor(private config: Config) {
		this.config.title ??= 'Record Reminder';
		this.config.icon ??= defaultIcon;
		this.config.schedule ??= MONDAY_TO_FRIDAY_9TO5;
		this.config.description ??= `Opens ${this.config.url} ${cronToHumanString(this.config.schedule)}`;

		// Weird constructor since import doesn't appear to be working correctly.
		this.tray = new (SysTray as any).default({
			menu: {
				// you should using .png icon in macOS/Linux, but .ico format in windows
				icon: this.config.icon,
				title: this.config.title,
				tooltip: this.config.description,
				items: [
					{
						title: TOGGLE_TITLE,
						tooltip: "Toggles the timer.",
						checked: true,
						enabled: true
					},
					{
						title: OPEN_TITLE = `Open ${this.config.url}`,
						tooltip: "Opens the specified link.",
						checked: false,
						enabled: true
					},
					{
						title: EXIT_TITLE,
						tooltip: "Shutdown the timer.",
						checked: false,
						enabled: true
					},
				]
			},
			debug: false,
			copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
		});
		
		this.tray.onClick(action => {
			if (action.item.title === TOGGLE_TITLE) {
				const checked = !action.item.checked;
				this.tray.sendAction({
					type: 'update-item',
					item: {
						...action.item,
						checked,
					},
					seq_id: action.seq_id,
				});
				checked ? this.start() : this.stop();
			}
			else if(action.item.title === OPEN_TITLE) {
				this.open();
			}
			else if (action.item.title === EXIT_TITLE) {
				this.stop();
				this.tray.kill(true);
			} else {
				console.log(`Unknown item selected!`, action);
			}
		});

		this.cron = cron.schedule(this.config.schedule ?? MONDAY_TO_FRIDAY_9TO5, async () => {
			await this.open();
		}, { scheduled: false });
	}

	public start() {
		this.cron.start();
	}

	public async open() {
		await open(this.config.url, { app: { name: open.apps[this.config.app ?? 'chrome'], arguments: ['--new-window', `--app=${this.config.url}`] } });
	}

	public stop() {
		this.cron.stop();
	}
}
