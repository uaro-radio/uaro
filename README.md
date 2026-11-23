# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Every push to `main` is deployed automatically. GitHub Actions
(`.github/workflows/deploy-build.yml`) builds the site and pushes the finished
`build/` as a single commit to the `deploy` branch (force-pushed, so its history
does not grow). On the server a cron job runs `~/bin/prebuilt-deploy.sh` every
two minutes: when `deploy` has a new commit, it unpacks it with `git archive`
into `build.new` and swaps it in for `build`. The server builds nothing.

To rebuild without a new commit:

```
$ gh workflow run deploy-build.yml
```
