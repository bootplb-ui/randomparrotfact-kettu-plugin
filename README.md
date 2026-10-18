# ParrotFact Kettu Plugin

A Kettu mobile-client plugin that adds a client-side `/parrotfact` command. Selecting the command sends one random parrot fact in the current channel.

## Important limitation

This is a **Kettu mobile client plugin**, not a Discord bot extension. It adds the command to your Kettu client; it does not register a public Discord application command with Discord's servers, and other users will not see it unless they also use the plugin.

## Build

Requirements: Node.js 18+.

```sh
npm install
npm run build
```

The build creates the files Kettu expects:

```text
builds/parrotfact/index.js
builds/parrotfact/manifest.json
```

## Install from a hosted repository

Host this repository at a URL that serves the repository root, then add the repository URL to Kettu's plugin repositories. Kettu will look for:

```text
<repository-url>/builds/parrotfact/manifest.json
<repository-url>/builds/parrotfact/index.js
```

For GitHub Pages, the repository root URL can be used after enabling Pages. Do not use the normal `github.com/...` HTML URL as the plugin repository URL unless your setup rewrites it to raw/Pages files.

After adding the repository, install and enable **ParrotFact**, then open Kettu's command picker and choose `/parrotfact`.
