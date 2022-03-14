import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'

const swingsetConfig = {
  components: { Tester: () => <p>testing 123</p> },
}

export default createPage(swingsetConfig)
export const getStaticPaths = createStaticPaths(swingsetConfig)
export const getStaticProps = createStaticProps(swingsetConfig)
