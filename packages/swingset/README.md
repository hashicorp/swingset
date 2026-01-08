# ⚠️ Archived Repository

This repository is archived and no longer maintained.

The project has been **deprecated** and will not receive any further updates, bug fixes, or support. Please refer to alternative solutions or successor projects if available.


# swingset

Welcome to Swingset. Swingset is a drop-in component documentation system built for Next.js's App Router and React Server Components.

> **Note**
> Swingset is currently under active development. We're actively iterating on the core features and APIs, and some things may change.

## Installation

Install `swingset` with your package manager of choice:

```
npm install swingset
```

Import the plugin in your `next.config.mjs` file:

```js
// next.config.mjs
import withSwingset from 'swingset'

export default withSwingset({
  componentRoot: './components',
  theme: 'swingset-theme-custom',
})()
```

## Features

### App Router native

Swingset is built for the new App Router and React Server Components. Running the bootstrap command will generate a route group for swingset:

```
$ swingset bootstrap

Generating swingset route group...

Success! Route group created:

(swingset)
  ├ /layout.tsx
  └ /swingset
    ├ /page.tsx
    └ /[...path]
      └ /page.tsx
```

### Component documentation

Document your components with MDX by placing a `docs.mdx` file next to your component source:

```
components/
  button/
    docs.mdx
    index.tsx
```

#### Component prop extraction

Swingset automatically exposes prop metadata for components imported into your documentation.

```typescript
<PropsTable component={Button} />
```

### Custom documentation

Swingset also supports standalone documentation pages. By default, `.mdx` files in `/app/(swingset)/swingset/docs/` are rendered.

### Custom themes

By default, Swingset only exposes the data necessary to fully render your documentation content. Swingset can be configured with a custom `theme` to control rendering.

```js
// next.config.mjs
import withSwingset from 'swingset'

export default withSwingset({
  componentRoot: './components',
  theme: 'swingset-theme-custom',
})()
```

### Custom remark and rehype plugins

Want to add support for GitHub Flavored Markdown? Swingset accepts `remark` and `rehype` plugins.

- [x] Add `remarkGfm`
- [x] Restart your server
- [ ] Render task lists!

```js
// next.config.mjs
import withSwingset from 'swingset'
import remarkGfm from 'remark-gfm'

export default withSwingset({
  componentRoot: './components',
  remarkPlugins: [remarkGfm],
})()
```

### Integrates with `@next/mdx`

Swingset integrates with `@next/mdx` by supporting the same `mdx-components.ts` file at the root of your application. Swingset will make the custom components declared there available.

### Use with Storybook

Documentation pages within Swingset are treated as modules. This means that you can import other modules into your `.mdx` files as you would any other JavaScript file. This works great if you leverage Storybook for component development, as stories are directly consumable from your documentation:

```tsx
import * as stories from './Button.stories'

# This is the Primary story

<stories.Primary />
```

## Contributing

See [CONTRIBUTING.md](/CONTRIBUTING.md).
