import { ArgumentsCamelCase, InferredOptionTypes } from 'yargs'

export type CommandHandler = (
  args: ArgumentsCamelCase<InferredOptionTypes<{}>>
) => void | Promise<void>

interface Command {
  name: string
  description: string
  builder: {} | (() => {})
  handler: CommandHandler
}

export interface Bootstrap extends Command {
  name: 'bootstrap'
  description: 'Creates a swingset template in the `app` or `pages` directory'
  builder: {}
}

export interface Default extends Command {
  name: '$0'
  description: 'The default "swingset" command, currently unused'
  builder: {}
}
