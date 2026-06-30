# HILF-MIR Berlin

This repo hosts the code for the [hilf-mir.berlin](https://www.hilf-mir.berlin/) - a website for finding psychological and health-related facilities in Berlin.


<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [HILF-MIR Berlin](#hilf-mir-berlin)
  - [Tech stack](#tech-stack)
    - [Setup](#setup)
  - [Development](#development)
  - [Data](#data)
  - [Contributors](#contributors)
  - [Credits](#credits)

<!-- /code_chunk_output -->


## Tech stack

The project is built using the React framework [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/).
The data of the facilities, labels and texts is stored as CSV files in this repository under [`./data/csv/`](./data/csv/) (see [Data](#data)).
The frontend is deployed to [Vercel](https://vercel.com/).
The map is provided by [maptiler.com](https://www.maptiler.com/)



### Setup

- Copy `.env.example` to `.env` and fill in the required environment variables as per `.env.example` (only the MapTiler keys are needed to render the map locally).
- Install your dependencies via `npm ci`


## Development

- Install dependencies via `npm ci`
- Copy `.env.example` to `.env` and fill it according to `.env.example`
- Build the local JSON cache from the committed CSVs: `npm run buildData` (reads `./data/csv/*.csv` and writes `./data/*.json`)
- Run `npm run dev` to get a development server running at [http://localhost:3000](http://localhost:3000)

`npm run build` runs `buildData` automatically before building the site, so the JSON cache is always regenerated from the CSVs.

## Data

All content is kept as CSV files under [`./data/csv/`](./data/csv/) and is the source of truth for the app:

- `records.csv` — the facilities. Only rows with `Anzeigen` set to `1` are shown in the app. The `Schlagworte` column holds a JSON array of label IDs referencing `labels.csv`.
- `labels.csv` — the filter labels (id, text, icon, `group2`, order).
- `texts.csv` — the UI texts as `key`/`de` pairs.

To change the data, edit the CSV files and run `npm run buildData` (or `npm run dev`/`npm run build`, which run it for you). The generated `./data/*.json` files are build artifacts and are git-ignored.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dnsos"><img src="https://avatars.githubusercontent.com/u/15640196?v=4?s=64" width="64px;" alt="Dennis Ostendorf"/><br /><sub><b>Dennis Ostendorf</b></sub></a><br /><a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=dnsos" title="Code">💻</a> <a href="#design-dnsos" title="Design">🎨</a> <a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=dnsos" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://vogelino.com"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt="Lucas Vogel"/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=vogelino" title="Code">💻</a> <a href="#design-vogelino" title="Design">🎨</a> <a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=vogelino" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt="Fabian Morón Zirfas"/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=ff6347" title="Code">💻</a> <a href="#data-ff6347" title="Data">🔣</a> <a href="#infra-ff6347" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.awsm.de/"><img src="https://avatars.githubusercontent.com/u/434355?v=4?s=64" width="64px;" alt="Ingo Hinterding"/><br /><sub><b>Ingo Hinterding</b></sub></a><br /><a href="#content-Esshahn" title="Content">🖋</a> <a href="https://github.com/technologiestiftung/wegweiser-frontend/pulls?q=is%3Apr+reviewed-by%3AEsshahn" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-Esshahn" title="Mentoring">🧑‍🏫</a></td>
    </tr>
  </tbody>
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