import { Default } from '../types'
import { LOGS } from '../logs'

export const defaultCMD: Default = {
  name: '$0',
  description: 'The default "swingset" command, currently unused',
  builder: {},
  handler: () => LOGS.default(),
}
