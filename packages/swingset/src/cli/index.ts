#!/usr/bin/env node
import yargs from 'yargs'
import { bootstrap } from './commands/bootstrap'
import { defaultCMD } from './commands/default'

//next config goes outside of app root
// remember new lines
// check for src
// content.mdx
// refactor app/(swingset) to a app/src/(swingset)

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
