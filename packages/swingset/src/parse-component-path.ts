export function parseComponentPath(rawPath: string) {

  const rawPathArr = rawPath.split('/')
  const [categoryOrPage, folderOrPage, page] = rawPathArr

  if (rawPathArr.length === 3) {
    return {
      category: categoryOrPage,
      folder: folderOrPage,
      page: page,
    }
  }

  if (rawPathArr.length === 2) {
    return {
      category: categoryOrPage,
      page: page,
    }
  }

  if (rawPathArr.length === 1) {
    return {
      page: page,
    }
  }
}
