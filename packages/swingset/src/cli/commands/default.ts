import { Command } from '../types'
import { Logs } from '../utils/logs'

export const defaultCMD: Command = {
  name: '$0',
  description: 'The default "swingset" command, currently unused',
  builder: {},
  handler: () => Logs.default(),
}
