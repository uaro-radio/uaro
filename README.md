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
(`.github/workflows/deploy-build.yml`) builds the site with `npm run build:prod`
and pushes the finished `build/` as a single commit to the `deploy` branch
(force-pushed, so its history does not grow; only changed files are sent). On
the server a cron job runs `~/bin/prebuilt-deploy.sh` every minute: when
`deploy` has a new commit, it unpacks it with `git archive` into `build.new` and
swaps it in for `build`. The server builds nothing.

`npm run build:prod` (`tools/build.js`) builds each locale in its own process,
all at once, each with its own `.docusaurus-<locale>` directory, and assembles
them into `build/`. The site is the same as with `npm run build`, which stays a
plain `docusaurus build` for local use.

To rebuild without a new commit:

```
$ gh workflow run deploy-build.yml
```
