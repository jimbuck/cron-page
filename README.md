# cron-page

Simple CLI tool & library that opens a webpage on a cron schedule.

| Tray | Menu |
|-|-|
| ![Screenshot of tray icon.](/.readme/cron-page_icon.png) | ![Screenshot of tray menu.](/.readme/cron-page_menu.png)

## Installation

Run the following command to quickly get started:

```sh
npx cron-page setup
```

## CLI

### `setup` (`install`)

```sh
cron-page setup
```

This will register the app to run when the current user logs in. It can also validate the cron schedule and shows the schedule explained so you can rest assured it's correct.

### `run`

```sh
cron-page run <url> [--schedule=<cron schedule>]
```

The default cron schedule is every hour from 9:55AM-4:55PM on Monday through Friday (`55 9-17 * * 1-5`).

### `remove` (`uninstall`)

```sh
cron-page remove
```

This unregisters the app from the user startup process.

## Library

cron-tab is written in TypeScript, so all types are available via intellisense. See `src/bin.ts` for an example of working with the `CronPage` class.

## License

GPLv3