import json
from shapely.geometry import geo, shape, mapping
from shapely.ops import unary_union

# Load GeoJSON file
with open('raw/mexico.geojson', 'r') as file:
    geojson = json.load(file)

# Convert GeoJSON features to Shapely geometries
geometries1 = [shape(feature['geometry']) for feature in geojson['features']]
for g, idx in geometries1:
  if not g.is_valid:
    clean_geometry = g.buffer(0)
    geometries1[idx] = clean_geometry

with open('raw/us.json', 'r') as file:
    us = json.load(file)

geometries2 = [shape(feature['geometry']) for feature in geojson['features']]

geometries = geometries1 + geometries2

# Join the geometries
joined_geometry = unary_union(geometries)

# Convert back to GeoJSON
joined_feature = {
    "type": "Feature",
    "geometry": mapping(joined_geometry),
    "properties": {}  # Add properties as needed
}

# Write the output to a new GeoJSON file
with open('joined_output.geojson', 'w') as file:
    json.dump({"type": "FeatureCollection", "features": [joined_feature]}, file)
