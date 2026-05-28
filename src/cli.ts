#!/usr/bin/env node
import { render } from 'ink'
import { Command } from 'commander'
import { createElement } from 'react'
import { App } from './app/App.js'

const program = new Command()

program
  .name('claude-watch')
  .description('Real-time terminal dashboard for Claude Code token usage and cost')
  .version('0.1.0')

program
  .command('watch', { isDefault: true })
  .description('Watch Claude Code usage in real time (default command)')
  .option('-P, --project <path>', 'Filter to a specific project directory')
  .option('-s, --small', 'Compact widget mode')
  .action((opts: { project?: string; small?: boolean }) => {
    if (!process.stdout.isTTY) {
      console.error('claude-watch requires a TTY terminal')
      process.exit(1)
    }
    render(createElement(App, { projectFilter: opts.project, small: opts.small }))
  })

program.parse()
