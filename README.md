# Wegweiser Berlin - frontend

This repo hosts the code for the Wegweiser Berlin - a website for finding psychological and health-related facilities in Berlin.

## Tech stack

The project is built using the React framework [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/).

The data of the facilities is stored in a [self-hosted Grist instance](https://github.com/technologiestiftung/grist-core).

## Getting started

### Requirements

If you are contributing to this repository, you can simply fill in the required environment variables as per `.env.example` and you are connected to our (development) Grist instance.

If you want to re-deploy the project, you will need an account at [getgrist.com](https://www.getgrist.com/) or your own self-hosted Grist instance. In this case make sure your table schema(s) in Grist and the calls to the Grist API are adjusted to your data.

In addition to Grist you need:

- [Node.js](https://nodejs.org)
- An account at [maptiler.com](https://www.maptiler.com/) along with a personal API key. This is because we display our basemaps using Maptiler. If you are re-deploying this project, you can change your basemap provider according to your preference.

### Developing

1. Install dependencies via `npm install`
2. Create a file `.env.development.local` and `.env` and fill it according to `.env.example`. The environment variables will connect to our development Grist instance which currently contains fake data instead of real facilities data. This is because in development mode we want to have the expected amount of records (~300) while the real dataset is currently being collected.
3. Run `npm run dev` to get a development server running at [http://localhost:3000](http://localhost:3000)

> If you want to start the app with the production table data, please change the values of 
`.env.development.local` to point to the production table.

## Deprecated (but still relevant) README

> This repo started out as a small proof of concept, but is now hosting the code for the actual Wegweiser Berlin project. We are in the process of adjusting the README to this. Below you find the parts that are still referring to the proof of concept and havce not been updated yet.

This project is a small proof-of-concept on how to use a [Grist](https://www.getgrist.com/) table and display its records in an external service, in this case a Next.js app. The table holds information about ~2700 _Kindertagesstätten_ in Berlin and is used an exemplary set of data.

The main goal of this project was to be able to edit the data in the Grist backend and have a separate frontend that displays the Kindertagesstätten on a map.

For rendering the map, a combination of [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/) (for the map, the markers and the interactions) and [maptiler](https://www.maptiler.com/) (for vector tiles) is used.

> Note that you don't need to use maptiler if you prefer to not create an account. Open Street Maps provides free (raster) tiles that can be used instead.

## Notes

### Accessing the Grist API from a Next API route

We need to make use of Next's [API route](https://nextjs.org/docs/api-routes/introduction) feature because we have to ensure that the Grist API key remains secret (it can be used for **posting, updating and deleting data** as well). With the custom API route at `/pages/api/grist.ts` we make sure that the Grist API itself is only accessed on our server side and not exposed to clients. Grist is indicating that they are working on building a more nuanced permissions concept for their API keys, which might make our workaround unnecessary in the future.

### The map cluster view

The code for creating the map clusters is mainly taken and adapted from [MapLibre's examples](https://maplibre.org/maplibre-gl-js-docs/example/cluster/). This is a quick proof-of-concept, so please excuse the `@ts-ignore`'s here and there.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dnsos"><img src="https://avatars.githubusercontent.com/u/15640196?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Dennis Ostendorf</b></sub></a><br /><a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=dnsos" title="Code">💻</a> <a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=dnsos" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

<table>
  <tr>
    <td>
      <a src="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by: <a src="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-de.svg" />
      </a>
    </td>
    <td>
      Supported by: <a src="https://www.berlin.de/">
        <br />
        <br />
        <img width="120" src="https://logos.citylab-berlin.org/logo-berlin.svg" />
      </a>
    </td>
  </tr>
</table>