#!/usr/bin/env node
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import yargs from 'yargs'
import { bootstrap } from './commands/bootstrap'
import { defaultCMD } from './commands/default'

const { argv } = yargs(process.argv.slice(2))
  .command(
    defaultCMD.name,
    defaultCMD.description,
    defaultCMD.builder,
    defaultCMD.handler
  )
  .command(
    bootstrap.name,
    bootstrap.description,
    bootstrap.builder,
    bootstrap.handler
  )
