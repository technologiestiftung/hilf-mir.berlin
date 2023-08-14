# needs some things
# csv toolkit https://csvkit.readthedocs.io/en/latest/index.html
# install via
# `brew install csvkit`
default:
	just --list --verbose

json-to-geojson:
	npx tsx scripts/json-to-geojson-stops.ts

csv-to-json:
	csvjson data/GTFS/stops.txt > data/stops.json
