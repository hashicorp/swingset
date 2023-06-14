# Developing swingset

## Setup

Install dependencies:

```shell-session
npm install
```

## Running the example app

First, run the `dev` task for `example-basic`'s dependencies:

```shell-session
npx turbo run dev --filter example-basic^...
```

Once the log output stops, we can stop the above process and run all of the dev tasks:

```shell-session
npx turbo run dev --filter example-basic...
```

Finally, visit <http://localhost:3000/swingset> in your browser. Any changes to the core `swingset` package will be rebuilt and reflect in the running example app.

## Debugging the example app

If you are iterating on the loader code, it might be helpful to use the Node debugger instead of relying on `console.log()` statements. To make this easier, we have included a VSCode launch configuration.

First, run the `dev` task for `example-basic`'s dependencies:

```shell-session
npx turbo run dev --filter example-basic^...
```

Next, open the VSCode debug panel (`Ctrl+Shift+D` on Windows/Linux, `⇧+⌘+D` on macOS) and run the `Debug examples/basic app` launch configuration.

## Custom themes

Swingset on its own is an unstyled core, exposing the data and utilities necessary to build your component documentation. To render a UI, swingset relies on themes. A theme exposes a number of components that swingset will use to render its UI. Currently, a theme must expose number of exports to render the full UI:

- `default` - The root swingset layout, used on all pages
- `page` - A named export, used to render documentation pages

The component exported as `page` will receive two props:

- `data` - The resolved `Entity` for the given page. Will be a `ComponentEntity` or a `DocsEntity`. See [the types](./packages/swingset/src/types.ts] for more details.
- `content` - The rendered output for the page.

A simple page implementation might look like this:

```tsx
export const Page = ({ data, content }) => {
  return (
    <h1>{data.frontmatter.title}</h1>
    <section>{content}</section>
  )
}
```
