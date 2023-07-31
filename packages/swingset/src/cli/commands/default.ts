/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Logs } from '../utils/logs'

export const defaultCMD = {
  name: '$0',
  description: 'The default "swingset" command, currently unused',
  builder: {},
  handler: () => Logs.default(),
}
