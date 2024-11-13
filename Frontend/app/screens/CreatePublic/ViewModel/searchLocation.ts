interface LocationDataItem {
    key: string;
    value: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export const searchLocation = async (input: string): Promise<LocationDataItem[]> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&limit=5&countrycodes=NI`
        );

        console.log("==> req", response);

        // Check the response status
        if (!response.ok) {
            console.error('Failed to fetch data:', response.statusText);
            return [];
        }

        const textResponse = await response.text(); // Get raw text first for debugging
        console.log('Raw API Response:', textResponse);

        const locations = JSON.parse(textResponse); // Parse the JSON if the response is correct

        const searchResults: LocationDataItem[] = locations.map((location: any) => ({
            key: location.place_id.toString(),
            value: location.display_name,
            coordinates: {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon),
            },
        }));

        return searchResults;
    } catch (error) {
        console.error('Error fetching location data:', error);
        return [];
    }
};