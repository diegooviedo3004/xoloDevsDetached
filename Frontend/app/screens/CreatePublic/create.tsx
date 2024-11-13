import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image, Modal, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Button } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { ProgressStep, ProgressSteps } from "@ouedraogof/react-native-progress-steps";
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Region } from 'react-native-maps';
import Header from "../../layout/Header";
import Input from "../../components/Input/Input";
import useLocation from "../../Hook/useLocation";
import { Feather } from "@expo/vector-icons";
import { FONTS } from "../../constants/theme";

interface LocationDataItem {
    key: string;
    value: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

const CreatePublication: React.FC = () => {
    const theme = useTheme();
    const { colors } = theme;

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        sexo: '',
        raza: '',
        trazabilidad: false,
        video_url: '',
        usar_ubicacion_usuario: false,
    });

    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number>(12.8654);
    const [longitude, setLongitude] = useState<number>(-85.2072);
    const [locationData, setLocationData] = useState<LocationDataItem[]>([]);
    const [searchText, setSearchText] = useState<string>('');

    const { location } = useLocation();

    useEffect(() => {
        console.log("==> location", location);
        if (formData.usar_ubicacion_usuario && location) {
            setLatitude(location.latitude);
            setLongitude(location.longitude);
        }
    }, [formData.usar_ubicacion_usuario, location]);

    const mapRegion: Region = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    useEffect(() => {
        if (searchText.length >= 3) {
            searchLocation(searchText);
        }
    }, [searchText]);

    const searchLocation = async (input: string) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&limit=5&countrycodes=NI`
            );
            const locations = await response.json();

            const searchResults: LocationDataItem[] = locations.map((location: any) => ({
                key: location.place_id.toString(),
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

    const handleInputChange = (name: keyof typeof formData, value: string | boolean) => {
        setFormData({ ...formData, [name]: value });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map((asset: any) => asset.uri);
            const totalImages = [...images, ...selectedImages].slice(0, 9);
            setImages(totalImages);

            if (totalImages.length > 9) {
                Alert.alert("Límite de imágenes", "Puedes seleccionar un máximo de 9 imágenes.");
            }
        }
    };

    const submitForm = () => {
        Alert.alert("Publicación creada", "Tu publicación ha sido creada exitosamente.");
    };

    const buttonTextStyle = {
        color: '#4CAF50',
        fontWeight: 'bold' as const,
    };

    const activeStepStyles = {
        activeStepIconBorderColor: '#4CAF50',
        activeLabelColor: '#4CAF50',
        activeStepNumColor: 'white',
        activeStepIconColor: '#4CAF50',
        completedStepIconColor: '#4CAF50',
        completedProgressBarColor: '#4CAF50',
        completedCheckColor: '#fff',
    };

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header title='Crear Venta' leftIcon='back' rightIcon1={'home'} />
            <View style={{ flex: 1 }}>
                <ProgressSteps {...activeStepStyles}>
                    <ProgressStep label="Detalles Generales" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                        <View style={{ padding: 16 }}>
                            <Text>Título</Text>
                            <Input placeholder="Título" value={formData.titulo} onChangeText={(text) => handleInputChange('titulo', text)} />
                            <Text>Descripción</Text>
                            <Input placeholder="Descripción" value={formData.descripcion} onChangeText={(text) => handleInputChange('descripcion', text)} />
                            <Text>Precio</Text>
                            <Input placeholder="Precio" value={formData.precio} onChangeText={(text) => handleInputChange('precio', text)} />
                            <Text>Sexo</Text>
                            <View style={styles.optionContainer}>
                                {['Hembra', 'Macho'].map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.optionButton, formData.sexo === option && styles.optionButtonSelected]}
                                        onPress={() => handleInputChange('sexo', option)}
                                    >
                                        <Text style={formData.sexo === option ? styles.optionTextSelected : styles.optionText}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text>Raza</Text>
                            <Input placeholder="Raza" value={formData.raza} onChangeText={(text) => handleInputChange('raza', text)} />
                        </View>
                    </ProgressStep>

                    <ProgressStep label="Configuración Adicional" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                        <View style={{ padding: 16 }}>
                            <View>
                                <Text>Configurar Trazabilidad</Text>
                                <Switch value={formData.trazabilidad} onValueChange={(value) => handleInputChange('trazabilidad', value)} />
                            </View>
                            <View>
                                <Text>Usar Coordenadas del Usuario</Text>
                                <Switch value={formData.usar_ubicacion_usuario} onValueChange={(value) => handleInputChange('usar_ubicacion_usuario', value)} />
                            </View>
                            <View>
                                <Text>URL del Video</Text>
                                <Input placeholder="Enlace del video" value={formData.video_url} onChangeText={(text) => handleInputChange('video_url', text)} />
                            </View>
                            <View>
                                <Text style={{ marginTop: 20 }}>Imágenes</Text>
                                <Button onPress={pickImage} mode="contained" style={{ marginVertical: 10, backgroundColor: '#4CAF50'}}>
                                    Seleccionar imágenes
                                </Button>
                                <FlatList
                                    horizontal
                                    data={images}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity onPress={() => setSelectedImage(item)}>
                                            <Image source={{ uri: item }} style={styles.selectedImage} />
                                            <TouchableOpacity style={styles.deleteButton} onPress={() => setImages(images.filter((_, i) => i !== index))}>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </ProgressStep>

                    <ProgressStep label="Mapa" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                        <View style={{ padding: 16 }}>
                            <View style={styles.searchContainer}>
                                <Feather name="search" size={20} color={colors.title} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Buscar ubicación..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>
                            <FlatList
                                data={locationData}
                                keyExtractor={(item) => item.key.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => {
                                        setSearchText(item.value);
                                        setLatitude(item.coordinates.latitude);
                                        setLongitude(item.coordinates.longitude);
                                    }}>
                                        <Text style={styles.listItem}>{item.value}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <View style={styles.mapPlaceholder}>
                                <MapView style={StyleSheet.absoluteFillObject} region={mapRegion}>
                                    <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
                                </MapView>
                            </View>
                        </View>
                    </ProgressStep>

                    <ProgressStep label="Confirmación" onSubmit={submitForm} nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                        <View style={{ alignItems: 'center', padding: 16 }}>
                            <Text>Revisa tus datos y envía la publicación</Text>
                        </View>
                    </ProgressStep>
                </ProgressSteps>
            </View>

            <Modal visible={!!selectedImage} transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedImage(null)}>
                        <Text style={styles.modalCloseText}>Cerrar</Text>
                    </TouchableOpacity>
                    {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />}
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    optionButton: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 5,
    },
    optionButtonSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    optionText: {
        color: '#333',
    },
    optionTextSelected: {
        color: '#fff',
    },
    selectedImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 8,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 12,
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 8,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        padding: 8,
    },
    listItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    mapPlaceholder: {
        height: 400,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 15,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    modalCloseText: {
        color: 'white',
        fontSize: 16,
    },
    fullScreenImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
});

export default CreatePublication;
