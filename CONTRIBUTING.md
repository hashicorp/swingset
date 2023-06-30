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

If you are iterating on the loader code, it might be helpful to use the Node.js [Debugger](https://nodejs.org/api/debugger.html) instead of relying on `console.log()` statements. To make this easier, we have included a VSCode launch configuration.

First, run the `dev` task for `example-basic`'s dependencies:

```shell-session
npx turbo run dev --filter example-basic^...
```

Next, open the VSCode debug panel (`Ctrl+Shift+D` on Windows/Linux, `⇧+⌘+D` on macOS) and run the `Debug examples/basic app` launch configuration. This will start Next's development process and attach a debugger. Any [`debugger;`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) statements you have added in Swingset's core should be triggered.

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

## Internals

At its core, Swingset's functionality revolves around a custom [Webpack loader](https://webpack.js.org/concepts/loaders). This loader enables Swingset to intercept imports for a number of different modules and inject custom metadata based on the detected component documentation. Swingset favors convention over configuration, and does its best to integrate into an existing Nextjs application without requiring significant structural changes or a ton of boilerplate code.

### `(swingset)` route group

The main "boilerplate" code is the `(swingset)` [route group](https://nextjs.org/docs/app/building-your-application/routing/route-groups). To isolate the Swingset styles and routes from the rest of your application, Swingset generates a route group with the following structure:

```
(swingset)/
  - layout.tsx
  - swingset/
    - page.tsx
    - [...path]/
      - page.tsx
    - docs/ # 👈 standalone documentation pages go here
```

Unless further customization is desired, The files generated here do not needed to be modified. Swingset will handle loading your documentation and the configured theme for rendering.

### Entities

Each detected piece of documentation content is represented within Swingset's core as an "entity." The base entity type contains information necessary to load and render a piece of documentation content. Currently, there are two types of entities: component entities and standalone documentation entities.

### Module rules

There are four distinct types of modules that, when requested, swingset will intercept:

#### Content imports (`.mdx?`)

Swingset will intercept `.mdx` and `.md` imports and compile the source into a render-able component. Internally, swingset dynamically imports each detected documentation file, and so those dynamically generated imports are then picked up by the this module rule.

#### Component imports from content

When importing component modules into documentation content, Swingset will attempt to parse out prop information and make it available for documenting.

#### Meta import (`swingset/meta`)

The main access point for Swingset's data is the `swingset/meta` import. This module will expose data for all of the detected entities, as well as some additional helper utilities for accessing and using this data. The data for each entity is used by a Swingset theme for rendering.

#### Theme import (`swingset/theme`)

Swingset's core on its own does not concern itself with rendering any sort of UI. This is handled by a [theme](#custom-themes). When a custom theme is provided to swingset, it is loaded by way of the `swingset/theme` import. This loader handles wrapping the theme's exposed components and making sure the necessary data is passed in.
