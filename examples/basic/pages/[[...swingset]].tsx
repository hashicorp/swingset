/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'

const swingsetConfig = {
  components: { Tester: () => <p>testing 123</p> },
}

const Page = createPage(swingsetConfig)

export default Page
export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps(swingsetConfig)
