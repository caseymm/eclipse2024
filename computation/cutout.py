import json
from shapely.geometry import shape, Polygon, MultiPolygon
input_path = '../src/app/data/ppath.json'
output_path = '../src/app/data/cut2.json'

# Read the GeoJSON file
with open(input_path, 'r') as f:
    data = json.load(f)

# totality = data['features'][0]
# Convert GeoJSON features to shapely geometries along with properties
features = [(shape(feature['geometry']), feature['properties']) for feature in reversed(data['features'])]

# Iterate through each feature and cut out contained features
cut_features = []
for i, (feature1, properties1) in enumerate(features):
    print(1, properties1)
    for j, (feature2, properties2) in enumerate(features):
        print(2, properties2)
        if i != j and feature1.contains(feature2):
            feature1 = feature1.difference(feature2)
            # Merge properties if necessary
            # For example, you might want to keep properties from both features
            # properties1.update(properties2)
    cut_features.append((feature1, properties1))

# Create a new GeoJSON FeatureCollection with retained properties
cut_feature_collection = {
    "type": "FeatureCollection",
    "features": [{"type": "Feature", "geometry": feature.__geo_interface__, "properties": properties} for feature, properties in cut_features]
}
# cut_feature_collection["features"].append(totality)

# Save the cut features to a new GeoJSON file
with open(output_path, 'w') as f:
    json.dump(cut_feature_collection, f)


