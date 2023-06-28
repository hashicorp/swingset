import { ArgumentsCamelCase, InferredOptionTypes } from 'yargs'

type CommandHandler = (
  args: ArgumentsCamelCase<InferredOptionTypes<{}>>
) => void | Promise<void>

export type Command = {
  name: string
  description: string
  builder: {}
  handler: CommandHandler
}
