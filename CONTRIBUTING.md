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
