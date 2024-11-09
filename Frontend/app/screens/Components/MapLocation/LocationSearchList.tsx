import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

interface LocationSearchListProps {
    setLatitude: (latitude: number) => void;
    setLongitude: (longitude: number) => void;
}

interface LocationOption {
    key: string;
    value: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

const LocationSearchList: React.FC<LocationSearchListProps> = ({ setLatitude, setLongitude }) => {
    const [locationData, setLocationData] = useState<LocationOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    // Realiza la búsqueda en Nominatim cada vez que cambia el valor de búsqueda
    const searchLocation = async (input: string) => {
        if (input.length < 3) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&limit=5&countrycodes=NI`
            );
            const locations = await response.json();

            // Transformar los resultados en el formato que acepta SelectList
            const searchResults = locations.map((location: any) => ({
                key: location.place_id,
                value: location.display_name,
                coordinates: {
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lon),
                },
            }));
            setLocationData(searchResults);
        } catch (error) {
            console.error('Error fetching location data:', error);
            Alert.alert('Error', 'No se pudo obtener datos de la ubicación.');
        }
    };

    // Observa cambios en selectedValue y actualiza las coordenadas
    useEffect(() => {
        if (selectedValue) {
            const selectedLocation = locationData.find(item => item.value === selectedValue);
            if (selectedLocation) {
                setLatitude(selectedLocation.coordinates.latitude);
                setLongitude(selectedLocation.coordinates.longitude);
            }
        }
    }, [selectedValue, locationData, setLatitude, setLongitude]);

    return (
        <SelectList
            data={locationData}
            setSelected={(value) => {
                console.log("===> value", value)
                setSelectedValue(value);
            }}
            placeholder="Buscar ubicación..."
            search={true}
            onSelect={(text) => searchLocation(text)}
            boxStyles={{ marginBottom: 10 }}
        />
    );
};

export default LocationSearchList;
