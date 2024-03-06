import requests
import json
import time

# Replace with your Mapbox access token
MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w'

def reverse_geocode(lon, lat):
    """
    Function to reverse geocode a single latitude and longitude
    """
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{lat},{lon}.json?types=place&access_token={MAPBOX_ACCESS_TOKEN}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Dictionary to hold geocoding results
results = {}
ct = 0
with open('./src/app/data/totality-better.json', 'r') as file:
    data = json.load(file)
    coordinates = data['features'][0]['geometry']['coordinates'][0][0]
    print(len(coordinates))
    for c in coordinates:
      ct += 1
      if ct % 300 == 0:
        print('sleep')
        time.sleep(60)
      try:
        resp = reverse_geocode(c[1], c[0])
        results[f'{c[0]},{c[1]}'] = resp['features'][0]['place_name']
      except Exception:
        results[f'{c[0]},{c[1]}'] = 'fail'

# print(results)
# File path where you want to store the JSON data
file_path = './src/app/data/totality-locations.json'

# Writing the dictionary to a JSON file
with open(file_path, 'w') as json_file:
    json.dump(results, json_file)