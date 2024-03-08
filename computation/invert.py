import geopandas as gpd
from shapely.geometry import box, Polygon
from shapely.ops import unary_union

# Load the GeoJSON file
gdf = gpd.read_file('raw/cg.geojson')

# Create a large rectangle (covering the entire area of interest)
# Adjust the coordinates as needed to cover your specific area of interest
world_box = box(-180, -90, 180, 90)

# Subtract the original shapes from the rectangle
# unary_union creates a single merged shape from all geometries in the GeoDataFrame
inverted_shape = world_box.difference(unary_union(gdf.geometry))

# Create a new GeoDataFrame with the inverted shape
inverted_gdf = gpd.GeoDataFrame(geometry=[inverted_shape], crs=gdf.crs)

# Save to a new GeoJSON file
inverted_gdf.to_file('raw/inverted_shape2.geo.json', driver='GeoJSON')
