# `swingset-theme-hashicorp`

A Swingset theme build for HashiCorp.

## Usage

First, install the theme package:

```
npm install swingset-theme-hashicorp
```

Then update your swingset configuration to specify `swingset-theme-hashicorp`:

```js
import withSwingset from 'swingset'

export default withSwingset({
  theme: 'swingset-theme-hashicorp',
})()
```

## Developing

This theme uses [tailwind](https://tailwindcss.com/) for styling. The tailwind classes are prefixed with `ss-` to ensure there are no collisions.
