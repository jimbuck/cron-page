import cronstrue from 'cronstrue';

export function cronToHumanString(cron: string) {
	const human = cronstrue.toString(cron);
	return human[0].toLowerCase() + human.slice(1);
}