# DATA

The files following files are created by the npm script `downloadCacheData`

```plain
labels.json
records.json
texts.json
```

--- 

To create the public transport data set used in this project you need the [csvkit][csvkit] software, the [GTFS][gtfs] data set for the public transport system you want to use. The full GTFS data is **NOT** provided in this repository. You will only find the `stops.txt` under the `data/GTFS` directory. You can obtain the whole dataset from the [Berlin Open Data portal][opendata]. The only edit we did was renaming the header `stops_lon` to `lon` and `stops_lat` to `lat`. To clean this data and only get the stops within Berlins borders we used the area of Berlin as GeoJSON. This is also provided in `data/bezirksgrenzen.geojson` or you can obtain it from [daten.odis-berlin.de][odis].


These files:


```plain
stops.json
stops.geo.json
stops.location_type_0.geo.json
stops.location_type_1.geo.json
```
are created by running the following scripts.

```bash
brew install csvkit
npm ci
csvjson data/GTFS/stops.txt > data/stops.json
npx tsx scripts/json-to-geojson-stops.ts
```

This will produce several files:

```plain
stops.json
stops.geo.json
stops.location_type_0.geo.json
stops.location_type_1.geo.json

```


The file `stops.location_type_1.geo.json` contains all stops we need for our data layer in maptiler.

---

[gtfs]: https://developers.google.com/transit/gtfs/
[opendata]: https://daten.berlin.de/datensaetze/vbb-fahrplandaten-gtfs
[csvkit]: https://csvkit.readthedocs.io/en/latest/index.html
[odis]: https://daten.odis-berlin.de/de/dataset/bezirksgrenzen/