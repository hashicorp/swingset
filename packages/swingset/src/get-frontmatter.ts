import { VFile } from 'vfile'
import { matter } from 'vfile-matter'

export function getFileFrontmatter(source: string) {
  const vfile = new VFile(source)

  matter(vfile)

  return vfile.data.matter as Record<string, unknown>
}
