# Proof-of-concept: How to use Grist as a backend for an external service

This project is a small proof-of-concept on how to use a [Grist](https://www.getgrist.com/) table and display its records in an external service, in this case a Next.js app. The table holds information about ~2700 _Kindertagesstätten_ in Berlin and is used an exemplary set of data.

The main goal of this project was to be able to edit the data in the Grist backend and have a separate frontend that displays the Kindertagesstätten on a map.

For rendering the map, a combination of [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/) (for the map, the markers and the interactions) and [maptiler](https://www.maptiler.com/) (for vector tiles) is used.

> Note that you don't need to use maptiler if you prefer to not create an account. Open Street Maps provides free (raster) tiles that can be used instead.

## Getting started

### Requirements

- An account at [getgrist.com](https://www.getgrist.com/) or for your self-hosted Grist instance. In this specific case we use out own hosted instance.
- A Grist table with geo information. In this case we use a table called "Kindertagesstatten" that includes ~2700 Kitas in Berlin.
- An account at [maptiler.com](https://www.maptiler.com/) along with a personal API key.
- [Node.js](https://nodejs.org) installed on your computer.

### Steps

1. Install dependencies via `npm install`
2. Create a file `/.env.development.local` and fill it according to `/.env.example`
3. Run `npm run dev` to get a development server running at [http://localhost:3000](http://localhost:3000)
4. Explore the data on the map or make changes to the code

