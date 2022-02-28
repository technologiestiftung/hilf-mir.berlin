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

## Notes

### Accessing the Grist API from a Next API route

We need to make use of Next's [API route](https://nextjs.org/docs/api-routes/introduction) feature because we have to ensure that the Grist API key remains secret (it can be used for **posting, updating and deleting data** as well). With the custom API route at `/pages/api/grist.ts` we make sure that the Grist API itself is only accessed on our server side and not exposed to clients. Grist is indicating that they are working on building a more nuanced permissions concept for their API keys, which might make our workaround unnecessary in the future.

### The map cluster view

The code for creating the map clusters is mainly taken and adapted from [MapLibre's examples](https://maplibre.org/maplibre-gl-js-docs/example/cluster/). This is a quick proof-of-concept, so please excuse the `@ts-ignore`'s here and there.
