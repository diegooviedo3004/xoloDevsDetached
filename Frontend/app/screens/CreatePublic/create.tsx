import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Switch, Modal } from 'react-native';
import { Button } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { ProgressStep, ProgressSteps } from "@ouedraogof/react-native-progress-steps";
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePublication() {
    const theme = useTheme();
    const { colors }: { colors: any; } = theme;

    const MAPTILER_API_KEY = "QUXFHoHbpEpQpWh3UBP7";

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

    const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        // Solicitar y obtener coordenadas del usuario si está habilitado
        if (formData.usar_ubicacion_usuario) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserCoordinates([longitude, latitude]);
                },
                (error) => console.error("Error obteniendo ubicación", error),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        }
    }, [formData.usar_ubicacion_usuario]);

    const handleInputChange = (name: string, value: string | boolean) => {
        setFormData({ ...formData, [name]: value });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            const totalImages = [...images, ...selectedImages].slice(0, 9);
            setImages(totalImages);

            if (totalImages.length > 9) {
                Alert.alert("Límite de imágenes", "Puedes seleccionar un máximo de 9 imágenes.");
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const showImage = (uri: string) => {
        setSelectedImage(uri);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const submitForm = () => {
        Alert.alert("Publicación creada", "Tu publicación ha sido creada exitosamente.");
    };

    const centerCoordinates = formData.usar_ubicacion_usuario && userCoordinates
        ? userCoordinates
        : [-122.4194, 37.7749]; // Coordenadas por defecto

    return (
        <View style={{ backgroundColor: colors.card, flex: 1 }}>
            <View style={{ flex: 1, marginTop: 50 }}>
                <ProgressSteps>
                    {/* Paso 1: Detalles Generales */}
                    <ProgressStep label="Detalles Generales">
                        <View style={{ padding: 16 }}>
                            <Text>Título</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Título"
                                value={formData.titulo}
                                onChangeText={(text) => handleInputChange('titulo', text)}
                            />
                            <Text>Descripción</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Descripción"
                                value={formData.descripcion}
                                onChangeText={(text) => handleInputChange('descripcion', text)}
                            />
                            <Text>Precio</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Precio"
                                value={formData.precio}
                                onChangeText={(text) => handleInputChange('precio', text)}
                            />

                            {/* Selector de Sexo */}
                            <Text>Sexo</Text>
                            <View style={styles.optionContainer}>
                                {['Hembra', 'Macho'].map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButton,
                                            formData.sexo === option && styles.optionButtonSelected
                                        ]}
                                        onPress={() => handleInputChange('sexo', option)}
                                    >
                                        <Text style={formData.sexo === option ? styles.optionTextSelected : styles.optionText}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Campo de texto para Raza */}
                            <Text>Raza</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Raza"
                                value={formData.raza}
                                onChangeText={(text) => handleInputChange('raza', text)}
                            />
                        </View>
                    </ProgressStep>

                    {/* Paso 2: Configuración Adicional */}
                    <ProgressStep label="Configuración Adicional">
                        <View style={{ padding: 16 }}>
                            <Text>Configurar Trazabilidad</Text>
                            <Switch
                                value={formData.trazabilidad}
                                onValueChange={(value) => handleInputChange('trazabilidad', value)}
                            />
                            <Text>URL del Video</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enlace del video"
                                value={formData.video_url}
                                onChangeText={(text) => handleInputChange('video_url', text)}
                            />

                            {/* Imágenes */}
                            <Text style={{ marginTop: 20 }}>Imágenes</Text>
                            <Button onPress={pickImage}>Seleccionar imágenes</Button>
                            <ScrollView horizontal style={{ marginTop: 10 }}>
                                {images.map((imageUri, index) => (
                                    <TouchableOpacity key={index} onPress={() => showImage(imageUri)}>
                                        <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {images.length === 0 && <Text style={styles.errorText}>Se requiere al menos una imagen</Text>}
                        </View>
                    </ProgressStep>

                    {/* Paso 3: Mapa */}
                    <ProgressStep label="Mapa">
                        <View style={{ padding: 16 }}>
                            <Text>Usar Coordenadas del Usuario</Text>
                            <Switch
                                value={formData.usar_ubicacion_usuario}
                                onValueChange={(value) => handleInputChange('usar_ubicacion_usuario', value)}
                            />
                            <View style={styles.mapPlaceholder}>
                                {/*<MapLibreGL.MapView*/}
                                {/*    style={styles.map}*/}
                                {/*    styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}*/}
                                {/*    logoEnabled={false}*/}
                                {/*    attributionPosition={{ bottom: 8, right: 8 }}*/}
                                {/*>*/}
                                {/*    <MapLibreGL.Camera*/}
                                {/*        defaultSettings={{ centerCoordinate: centerCoordinates, zoomLevel: 8 }}*/}
                                {/*    />*/}
                                {/*</MapLibreGL.MapView>*/}
                            </View>
                        </View>
                    </ProgressStep>

                    {/* Paso 4: Confirmación y Envío */}
                    <ProgressStep label="Confirmación" onSubmit={submitForm}>
                        <View style={{ alignItems: 'center', padding: 16 }}>
                            <Text>Revisa tus datos y envía la publicación</Text>
                        </View>
                    </ProgressStep>
                </ProgressSteps>
            </View>

            {/* Modal para ver imagen en pantalla completa */}
            <Modal visible={!!selectedImage} transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={closeImage}>
                        <Text style={styles.modalCloseText}>Cerrar</Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 8,
        borderRadius: 4,
    },
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
        backgroundColor: '#007aff',
        borderColor: '#007aff',
    },
    optionText: {
        color: '#333',
    },
    optionTextSelected: {
        color: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
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
    mapPlaceholder: {
        height: 400,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 15,
    },
    map: {
        flex: 1,
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
