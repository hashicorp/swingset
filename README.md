![Swingset](https://p176.p0.n0.cdn.getcloudapp.com/items/NQu14DNO/swingset-light-github.svg)

An opinionated, drop-in component library for next.js apps.

> **NOTE**: This project is in early alpha stages, and the readme is still not accurate. It is not recommended for use currently. If you really want to use it still, reach out to the author.

### Installation

Install via npm with `npm i swingset`, then add the plugin to your `next.config.js` as such:

```js
const withSwingset = require('swingset')

module.exports =
  withSwingset(/* swingset options */)(/* normal nextjs config */)
```

You then need to create a page in your nextjs app where swingset will live. You can "inject" swingset on to any page of your choosing. Something like `/components` might be a nice choice. When you have decided on a page, swingset can be injected as follows:

> **Note:** `createStaticProps` accepts `mdxOptions`, which allow you to customize how your markup is rendered. For details, see [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote/blob/main/render-to-string.d.ts#L36-L42)

```jsx
import createPage from 'swingset/page'
import { createStaticProps, createStaticPath } from 'swingset/server'

export default createPage()
export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps({
  /* mdxOptions = {} */
})
```

With this in place, if you go to the page you injected it on, it should work, although it will be empty. Next, let's talk about how to get some components loaded in there.

### Usage

Swingset points to `components/*` as its default location for components, in line with next.js convention. This is configurable if needed though, see [the options section, below](#options). It expects your components to live in folders, perhaps they contain an index where the components lives, and some other stuff like css. It doesn't matter what else is in the folder, as long as it has an index. To start writing docs for a specific component, add a `docs.mdx` file to the component's folder, and make sure that this file has a front matter block containing a key/value pair for `componentName`. Let's look at an example. Here's how your folder structure might look:

```
.
├── pages
│   ├── index.jsx
│   └── [[...swingset]].jsx <- here's where you injected swingset
└── components
    └── button
        ├── index.jsx <- this is what's returned when you import `components/button`
        ├── style.module.css
        └── docs.mdx <- here's the docs file you created for swingset
```

So, you have only now added two things to your app -- a file in `pages` called `[[...swingset]].jsx` where you injected the component library itself, and a `docs.mdx` file in one of your components. And remember, the `docs.mdx` file needs frontmatter, or you will get an error. Here's how a minimal `docs.mdx` file might look:

```
---
componentName: 'Button'
peerComponents:
  - 'ArrowIcon'
---

Hi there, welcome to the button docs!

Here's an example with an arrow:

<Button cta="Click the arrow!">
  <ArrowIcon />
</Button>
```

With this in place, you should see your component's name render in the sidebar and show the contents of your markdown file. Not so bad! You are of course welcome to add docs files to multiple components, we're just starting with one.

Now let's actually make these docs useful. There are a few components that are made available within `docs.mdx` files that will help you to showcase your components.

1. Your actual component. So in the example above, you can use `<Button />` right in that mdx file, and it will render an example however you please.
1. Any components you list in the `peerComponents` frontmatter key.
   1. In the example above, `<ArrowIcon />` is added to scope.
   1. **Note:** `peerComponents` must also be present in Swingset (i.e., they must have a `docs.mdx` file). A warning will be emitted if any unknown components are passed here.
1. `<LiveComponent>` - a component that can be used to render a live code editor that will display and update your component
1. `<KnobsComponent>` - a component that can be used to render a set of UI controls that will live update a rendered version of your component
1. `<PropsTable>` - a component that will render a full or partial list of your component's props.
1. Any of your own components you specified in the [swingset options](#options)

We'll dig into how each of these work in the following sections, and give plenty of examples.

#### `<LiveComponent>`

Let's look at an example of this component first:

```jsx
<LiveComponent>{`<Button
  url='http://example.com'
  theme='primary'
/>`}</LiveComponent>
```

Assuming that you're in a `docs.mdx` file with a `componentName` of `Button`, this example would render a live code editor containing the string specified, in addition to a preview pane which contains the rendered component. As the code editor is adjusted, the component would be re-rendered accordingly.

This is a very simple component - it just expects a single child, as a string, which it renders into the code editor.

If you have a need for components other than the component being documented in your example, these can be provided through a `components` prop, as such:

```jsx
<LiveComponent
  components={{
    SomeContent: () => <p>content yay</p>,
  }}
>{`<Button url='http://example.com'><SomeContent /></Button>`}</LiveComponent>
```

This is best used when you want to represent another component in your example, but the actual implementation of that component would distract from the point trying to be made in the example.

There's one more useful prop to `LiveComponent` -- `collapsed`. If this prop is set to `true`, the code editor will be collapsed by default - when clicked it will expand. This is useful for examples that contain a lot of code - you can collapse the editor by default to make it easier for users to scroll through examples, then expand the code editor only when they want to see/edit the source code. It is `true` by default.

TODO: screenshot here

#### `<KnobsComponent>`

As usual, a usage example upfront:

```jsx
<KnobsComponent
  knobs={{
    text: {
      control: {
        type: 'text',
        value: 'http://example.com',
      },
      required: true,
    },
    disabled: {
      control: { type: 'checkbox' },
    },
    theme: {
      control: { type: 'select' },
      options: ['foo', 'bar'],
    },
  }}
/>
```

This would render your component, like `<LiveComponent>`, but rather than a code editor, a set of UI controls. These UI controls follow the [props spec](#props), and using a props file with this component is strongly recommended.

TODO: screenshot here

Nested props are supported as well, to infinite depth. For example, a nested `theme` prop might look like this:

```jsx
<KnobsComponent
  knobs={{
    theme: {
      color: {
        control: { type: 'select' },
        options: ['red', 'blue'],
      },
      style: {
        control: { type: 'select' },
        options: ['primary', 'secondary', 'tertiary'],
      },
    },
  }}
/>
```

Control types currently available are:

- `text`
- `select` -- requires `options` to be set
- `checkbox`
- `json` - freeform input for any js object, not recommended

TODO: screenshot here

#### `<PropsTable>`

Example as always:

```jsx
<PropsTable
  props={{
    text: {
      type: 'string',
      description: 'text displayed in the button',
      required: true,
    },
    theme: {
      color: {
        type: 'string',
        description: "sets the button's color",
        options: ['red', 'blue'],
      },
    },
  }}
/>
```

This component is quite straightforward as well, given an object containing data about props, it displays a nicely formatted table that shows the component's props. This component pairs particularly well with the [props file](#props), which we will discuss below, as its objects can be piped in directly.

TODO: screenshot here

### Props

An additional, optional convention is to define your component's props in a separate file. You may ask yourself, "but why can't I use typescript, or jsdocs in my component, or PropTypes?!" The answer in this case is because swingset does not want to impose anything upon the way that you choose to build your components, so instead it offers an optional manner of detailing your props outside of your actual component.

If you include a `props.js` file in the folder with your component, it will be picked up, parsed, and injected into your `docs.mdx` file as `componentProps`. You can then pass it into the `<PropsTable>` and/or `<KnobsComponent>` components, either fully, or splitting out individual props or sets of props, to save yourself lots of repetition and make your docs file much more terse.

The `props.js` file does have an expected object structure, which is detailed below in psuedo-typescript style:

```typescript
interface Properties = {
  propName: {
    type?: string, // write out the type you expect however you please
    description?: string, // a short description of your prop
    required?: boolean, // is it a required prop?
    control?: {, // for knobs, see <KnobsComponent> docs above
      type: string, // type of control
      value?: any // starting value for the control
    },
    options?: []string, // if there are only a specific set of values allowed, detail them here
    default?: string, // if there is a default value to this prop
    testValue?: any, // value to be used as a test fixture, pairs with `fixtureFromProps`
    properties: Properties | []Properties // if the prop is an array or object with nested items
  }
}
```

As with other components, props can be nested here as well. There are a few specific caveats with the `control` value in nested properties though:

-

Let's lock this all in with a real example of a simple `props.js` file:

```js
module.exports = {
  headline: {
    type: 'string',
    description: 'The headline displayed above the content',
    required: true,
    testValue: 'Test Headline',
    control: { type: 'text' },
  },
  data: {
    type: 'object',
    description: 'data that the component will render',
    properties: {
      theme: {
        type: 'string',
        description: 'color theme of the rendered data',
        options: ['dark', 'light'],
        control: { type: 'text' },
        default: 'light',
      },
      logos: {
        type: 'array',
        description:
          'company logos to be displayed and show how cool your product is',
        control: { type: 'json' },
        properties: [
          {
            type: 'string',
            description:
              'a string specifying a known company slug for which the logo will be displayed',
          },
          {
            type: 'object',
            description:
              'if its not a known company, a custom object containing the necessary info to render',
            properties: {
              name: {
                type: 'string',
                description: 'the company name',
              },
              logo: {
                type: 'string',
                description: 'url of the company logo to be displayed',
              },
            },
          },
        ],
      },
    },
  },
}
```

### Options

When initializing swingset in `next.config.js`, there are a few options you can pass it to customize its behavior. The example below shows how that might be done. None of the options are required, they all have defaults.

```jsx
const withSwingset = require('swingset')

module.exports = withSwingset({
  // Where your components live. "components/*" is the default.
  componentsRoot: 'components/*',
  // Where your generic docs pages live. No default
  docsRoot: 'docs/*',
  // Extra logging. Default is false
  verbose: false,
})(/* normal nextjs config */)
```

There are some additional options that can be passed in to the page configuration for customization, example below:

```js
import createPage from 'swingset/page'
import createStaticProps from 'swingset/getStaticProps'

const swingsetOptions = {
  // if you have custom components you'd like to have available for use across all docs pages,
  // the can be added here. No default.
  components: { Tester: () => <p>testing 123</p> },
  // Any React element
  logo: <MyLogo />,
}

export default createPage(swingsetOptions)
export const getStaticProps = createStaticProps(swingsetOptions)
```

### Test Utilities

Swingset currently ships with a single test utility that can be used to extract deep-nested `testValue` data from props for use as test fixtures. Lets go through an example, starting with a sample `props.js` file:

```js
module.exports = {
  foo: {
    type: 'string',
    description: '...',
    testValue: 'value',
  },
  bar: {
    type: 'object',
    description: '...',
    properties: {
      baz: {
        type: 'string',
        testValue: 'value',
      },
    },
    testValue: {},
  },
}
```

Now let's look at how this could be used in some tests:

```js
const props = require('./props')
const { getTestValues } = require('swingset/testing')

getTestValues(props) // => { foo: 'value', bar: { baz: 'value' } }
```

This set of props can now be used as a fixture for component tests, perhaps like this with `jest`:

```js
const props = require('./props')
const Component = require('./')
const { render } = require('@testing-library/react')
const { getTestValues } = require('swingset/testing')

const defaultProps = getTestValues(props)

test('default props renders without error', () => {
  const render(<Component {...defaultProps} />)
  // ....
})
```

It's worth noting that for nested props, the root and children can both have `testValue`s, and they will be merged together. For example, the following `props.js` file:

```js
module.exports = {
  foo: {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
        testValue: 'value',
      },
      baz: {
        type: 'string',
      },
    },
    testValue: { bar: 'root value', baz: 'root value' },
  },
}
```

...would produce `{ foo: { bar: 'value', baz: 'root value' } }`. If the root does not have a `testValue`, however, none of its children will be reflected in the output at all. So the following `props.js` file:

```js
module.exports = {
  foo: {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
        testValue: 'value',
      },
    },
  },
}
```

Would produce `{}` as its output, since `foo` does not have a `testValue`. There are two options if this is not your desired output. First, supply parent values with an empty object/array default, depending on the property type, as such:

```js
module.exports = {
  foo: {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
        testValue: 'value',
      },
    },
    testValue: {},
  },
}
```

Second, supply your entire fixture at the root level, rather than breaking it apart and distributing it to sub-properties, as such:

```js
module.exports = {
  foo: {
    type: 'object',
    properties: {
      bar: {
        type: 'string',
      },
    },
    testValue: { bar: 'value' },
  },
}
```

Choose whichever option feels more clear for your use!

### Notes

Any global styles that you specify by importing to `_app.jsx` will be reflected in your component library. Normally, this is a good thing, as your components will be showcased as they normally would within your app, but if any styles are not rendering as expected in the component library, it may be due to global overrides.
