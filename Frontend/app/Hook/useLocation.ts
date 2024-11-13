// src/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

const useLocation = () => {
    const [location, setLocation] = useState<LocationCoordinates | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permiso para acceder a la ubicación denegado');
                    return;
                }

                let position = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            } catch (error) {
                setErrorMsg('Error al obtener la ubicación');
            }
        };

        requestLocationPermission();
    }, []);

    return { location, errorMsg };
};

export default useLocation;
