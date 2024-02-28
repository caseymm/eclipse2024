import json
import requests

eclipse_data = {"type":"FeatureCollection","features":[]}

# Function to process each item
def process_item(item):
  print(item)
  print('')
  coordinates = item['geometry']['coordinates']
    # Assuming each item contains latitude and longitude information
  latitude = coordinates[1]
  longitude = coordinates[0]
    
  api_url = f'https://aa.usno.navy.mil/api/eclipses/solar/date?date=2024-4-08&coords={latitude},{longitude}&height=15'
  print(api_url)
    
  # Make the HTTP GET request
  response = requests.get(api_url)
  
  # Check if request was successful (status code 200)
  if response.status_code == 200:
      # Print the response data
      # print("Response for item:")
      # print(response.json())
      
      item['eclipse'] = response.json()
      eclipse_data['features'].append(item)
  else:
      # Print an error message if the request failed
      print(f"Error processing item: {response.status_code}")

# Open the JSON file
with open('src/app/state_centroids.json') as file:
    # Load JSON data
    data = json.load(file)
    
    # Iterate over each item in the JSON
    for state in data['features']:
        # Process each item
        process_item(state)
      
    # Path to the file where you want to save the JSON data
    file_path = "src/app/states_data.json"

    # Write the JSON data to the file
    with open(file_path, "w") as json_file:
        json.dump(data, json_file, indent=4)
