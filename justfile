# needs some things
# csv toolkit https://csvkit.readthedocs.io/en/latest/index.html
# install via
# `brew install csvkit`
default:
	just --list --verbose

json-to-geojson:
	npx tsx scripts/json-to-geojson-stops.ts > data/stops.geo.json

filter-railway-data:
	npx tsx scripts/filter-railway-data.ts

filter-bahnhoefe-data:
	npx tsx scripts/filter-bahnhoefe-data.ts

csv-to-json:
	csvjson data/GTFS/stops.txt > data/stops.json

csv-clean:
	in2csv  --delimiter ';' data/Bahnhöfe_mit_Zugangskoordinaten_GK4_lon-lat_Auswahl.csv | csvformat -D ',' -Q '"' > data/bahnhoefe-cleaned.csv
