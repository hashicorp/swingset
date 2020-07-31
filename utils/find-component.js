// This function can track down a component itself based on its name from the
// docs frontmatter, given `docsSrcs`, `allComponent`, `_importMeta`, and `octavoOptions` to search.
export default function findComponent(
  name,
  { docsSrcs, allComponents, _importMeta }
) {
  const srcObject = docsSrcs.find((src) => src.data.componentName === name);
  const componentIdx = _importMeta.findIndex(
    (i) => i.absolutePath === srcObject.path.replace(/docs\.mdx$/, "")
  );

  if (!allComponents[componentIdx]) {
    throw new Error(
      `No corresponding component found for the docs page ${srcObject.path}. Make sure that there is an "index" file exporting a react component in the folder.`
    );
  }

  return allComponents[componentIdx];
}
