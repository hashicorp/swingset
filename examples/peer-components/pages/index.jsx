import createPage from 'swingset/page'
import { createStaticProps } from 'swingset/server'

const swingsetConfig = {
  components: { Tester: () => <p>testing 123</p> },
}

export default createPage(swingsetConfig)
export const getStaticProps = createStaticProps(swingsetConfig)
