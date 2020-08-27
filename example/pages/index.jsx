import createPage from 'octavo/page'
import createStaticProps from 'octavo/getStaticProps'

const octavoConfig = {
  components: { Tester: () => <p>testing 123</p> },
}

export default createPage(octavoConfig)
export const getStaticProps = createStaticProps(octavoConfig)
