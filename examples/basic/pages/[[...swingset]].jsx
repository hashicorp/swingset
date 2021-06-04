import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'

const swingsetConfig = {
  components: { Tester: () => <p>testing 123</p> },
  customMeta({ slug }) {
    return {
      github: `https://github.com/hashicorp/react-components/tree/main/packages/${slug}`,
      npm: `https://npmjs.com/package/@hashicorp/react-${slug}`,
    }
  },
}

export default createPage(swingsetConfig)
export const getStaticPaths = createStaticPaths(swingsetConfig)
export const getStaticProps = createStaticProps(swingsetConfig)
