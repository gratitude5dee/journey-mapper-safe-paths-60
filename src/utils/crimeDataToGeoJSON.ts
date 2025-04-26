
import { parseCSV } from '../utils/csvParser';

type CrimeDataPoint = {
  latitude: number;
  longitude: number;
  frequency: number;
};

// First, declare the CSV data constant
export const crimeCsvData = `latitude,longitude,frequency
37.708,-122.4623,2
37.7082,-122.4523,2
37.7083,-122.4543,2
37.7083,-122.4201,12
37.7085,-122.4617,1
37.7085,-122.4209,1
37.7086,-122.4448,2
37.7086,-122.4013,8
37.7087,-122.4704,3
37.7087,-122.4693,1
37.7087,-122.4423,5
37.7087,-122.415,1
37.7089,-122.426,1
37.7089,-122.4223,3
37.7089,-122.4051,27
37.7089,-122.3944,6
37.709,-122.4582,2
37.709,-122.416,3
37.7091,-122.4477,2
37.7091,-122.406,2
37.7092,-122.4643,1
37.7092,-122.4558,3
37.7092,-122.4532,8
37.7092,-122.4229,5
37.7092,-122.4062,1
37.7093,-122.4427,5
37.7093,-122.4261,1
37.7094,-122.4509,1
37.7094,-122.4467,4
37.7095,-122.4577,3
37.7095,-122.4177,3
37.7095,-122.4129,3
37.7096,-122.4679,2
37.7096,-122.4347,1`;

/**
 * Parses CSV text and converts it to GeoJSON FeatureCollection for crime data.
 * @param csvText The CSV text string.
 * @returns A GeoJSON FeatureCollection object.
 */
export const crimeDataToGeoJSON = (csvText: string = crimeCsvData): GeoJSON.FeatureCollection => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    console.error("CSV data must have at least a header and one data row.");
    return { type: 'FeatureCollection', features: [] };
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const latIndex = headers.indexOf('latitude');
  const lonIndex = headers.indexOf('longitude');
  const freqIndex = headers.indexOf('frequency');

  if (latIndex === -1 || lonIndex === -1 || freqIndex === -1) {
    console.error("CSV headers must include 'latitude', 'longitude', and 'frequency'.");
    return { type: 'FeatureCollection', features: [] };
  }

  const features: GeoJSON.Feature[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= headers.length) {
      const latitude = parseFloat(values[latIndex]?.trim());
      const longitude = parseFloat(values[lonIndex]?.trim());
      const frequency = parseInt(values[freqIndex]?.trim(), 10);

      if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(frequency)) {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          properties: {
            frequency: frequency
          }
        });
      } else {
        console.warn(`Skipping invalid data row ${i + 1}: ${lines[i]}`);
      }
    } else {
      console.warn(`Skipping malformed CSV row ${i + 1}: ${lines[i]}`);
    }
  }

  return {
    type: 'FeatureCollection',
    features
  };
};

// Process the raw CSV data into initial crime data points
export const crimeData = crimeDataToGeoJSON();
