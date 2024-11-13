import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    Modal,
    TouchableOpacity,
    Switch,
    TextInput,
    ScrollView, Dimensions
} from 'react-native';
import { Button } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { ProgressStep, ProgressSteps } from "@ouedraogof/react-native-progress-steps";
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Region } from 'react-native-maps';
import Header from "../../layout/Header";
import Input from "../../components/Input/Input";
import useLocation from "../../Hook/useLocation";
import { Feather } from "@expo/vector-icons";
import {COLORS, FONTS} from "../../constants/theme";
import {GlobalStyleSheet} from "../../constants/StyleSheet";
import { FlashList } from "@shopify/flash-list";
import {FlatList} from "react-native-gesture-handler";
import FeatherIcon from 'react-native-vector-icons/Feather';

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
        post_type: '',
        chapa_code: '',
        breed_M: '',
        breed_P: '',
        health_status: '',
        comments: '',
        birth_date: new Date(),
        last_calving: new Date(),
        breeding_date: new Date(),
        last_heat_date: new Date(),
        days_pregnant: '',
        expected_calving_date: new Date(),
        milk_production_in_liters: '',
        daily_milk_production_in_liters: '',
        days_in_milk: '',
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
                `https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&limit=5&countrycodes=NI`,
                {
                    headers: {
                        'User-Agent': 'YourAppName/1.0 (contact@yourdomain.com)'
                    }
                }
            );

            const responseData: LocationDataItem[] = await response.text();
            console.log(responseData);

            const searchResults: LocationDataItem[] = responseData.map((location: any) => ({
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
                        <ScrollView>
                            <View style={GlobalStyleSheet.container}>
                                <View style={[GlobalStyleSheet.card,{backgroundColor:colors.card}]}>
                                    <View style={[GlobalStyleSheet.cardHeader,{borderBottomColor:COLORS.inputborder}]}>
                                        <Text style={{...FONTS.fontMedium,fontSize:14,color:colors.title}}>Informacion Basica</Text>
                                    </View>
                                    <View style={GlobalStyleSheet.cardBody}>
                                        <View style={{marginBottom:10}}>
                                            <Input placeholder="Título"
                                                   value={formData.titulo}
                                                   onChangeText={(text) => handleInputChange('titulo', text)} />
                                        </View>
                                        <View style={{marginBottom:10}}>
                                            <Input placeholder="Descripción"
                                                   value={formData.descripcion}
                                                   onChangeText={(text) => handleInputChange('descripcion', text)} />
                                        </View>
                                        <View style={{marginBottom:10}}>
                                            <Input placeholder="Precio"
                                                   value={formData.precio}
                                                   onChangeText={(text) => handleInputChange('precio', text)} />
                                        </View>
                                        <View style={[GlobalStyleSheet.cardHeader,{borderBottomColor:COLORS.inputborder}]}>
                                            <Text style={{...FONTS.fontMedium,fontSize:14,color:colors.title}}>Sexo</Text>
                                        </View>
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
                                        <View style={[GlobalStyleSheet.cardHeader,{borderBottomColor:COLORS.inputborder}]}>
                                            <Text style={{...FONTS.fontMedium,fontSize:14,color:colors.title}}>Raza</Text>
                                        </View>
                                        <View style={{marginBottom:10}}>
                                            <Input placeholder="Raza"
                                                   value={formData.raza}
                                                   onChangeText={(text) => handleInputChange('raza', text)} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </ProgressStep>

                    <ProgressStep label="Configuración Adicional" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                            <ScrollView>
                                <View style={GlobalStyleSheet.container}>
                                    <View style={[GlobalStyleSheet.card,{backgroundColor:colors.card}]}>
                                        {/*Configuracion*/}
                                        <View style={[GlobalStyleSheet.cardHeader,{borderBottomColor:COLORS.inputborder}]}>
                                            <Text style={{...FONTS.fontMedium,fontSize:14,color:colors.title}}>Configuracion</Text>
                                        </View>
                                        <View style={GlobalStyleSheet.cardBody}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10,}}>
                                                <Text style={{ flex: 1, fontSize: 16,}}>Trazabilidad</Text>
                                                <Switch
                                                    value={formData.trazabilidad}
                                                    onValueChange={(value) => handleInputChange('trazabilidad', value)}
                                                />
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10,}}>
                                                <Text style={{ flex: 1, fontSize: 16,}}>Usar Coordenadas del Usuario</Text>
                                                <Switch
                                                    value={formData.usar_ubicacion_usuario}
                                                    onValueChange={(value) => handleInputChange('usar_ubicacion_usuario', value)} />
                                            </View>
                                        </View>
                                            {/*Imagenes*/}
                                            <View style={[GlobalStyleSheet.cardHeader,{borderBottomColor:COLORS.inputborder, marginBottom: 10}]}>
                                                <Text style={{...FONTS.fontMedium,fontSize:14,color:colors.title}}>Videos y Imagenes</Text>
                                            </View>
                                        <View style={GlobalStyleSheet.cardBody}>
                                            <View style={{marginBottom:10}}>
                                                <Input placeholder="URL video de Youtube"
                                                       value={formData.video_url}
                                                       onChangeText={(text) => handleInputChange('video_url', text)} />
                                            </View>
                                            <View style={{ marginBottom:10 }}>
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
                                        {/*Trazabilidad*/}
                                        {formData.trazabilidad && (
                                            <>
                                                {/* Traceability Header */}
                                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: COLORS.inputborder, marginBottom: 10 }]}>
                                                    <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title }}>Configuracion de Trazabilidad</Text>
                                                </View>

                                                {/* Traceability Body */}
                                                <View style={GlobalStyleSheet.cardBody}>
                                                    <View style={{ marginBottom: 10 }}>
                                                        <Input
                                                            placeholder="Código de Chapa"
                                                            value={formData.chapa_code}
                                                            onChangeText={(text) => handleInputChange('chapa_code', text)}
                                                        />
                                                    </View>

                                                    <View style={{ marginBottom: 10 }}>
                                                        <Input
                                                            placeholder="Raza Madre"
                                                            value={formData.breed_M}
                                                            onChangeText={(text) => handleInputChange('breed_M', text)}
                                                        />
                                                    </View>

                                                    <View style={{ marginBottom: 10 }}>
                                                        <Input
                                                            placeholder="Raza Padre"
                                                            value={formData.breed_P}
                                                            onChangeText={(text) => handleInputChange('breed_P', text)}
                                                        />
                                                    </View>

                                                    <View style={{ marginBottom: 10 }}>
                                                        <Input
                                                            placeholder="Estado de Salud"
                                                            value={formData.health_status}
                                                            onChangeText={(text) => handleInputChange('health_status', text)}
                                                        />
                                                    </View>

                                                    <View style={{ marginBottom: 10 }}>
                                                        <Input
                                                            placeholder="Comentarios"
                                                            value={formData.comments}
                                                            onChangeText={(text) => handleInputChange('comments', text)}
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </ScrollView>
                    </ProgressStep>

                    <ProgressStep label="Mapa" nextBtnTextStyle={buttonTextStyle} previousBtnTextStyle={buttonTextStyle}>
                        <View style={GlobalStyleSheet.container}>
                            <View style={[GlobalStyleSheet.card,{backgroundColor:colors.card}]}>
                                {/*Mapa*/}
                                <View style={GlobalStyleSheet.cardBody}>
                                    <View style={[GlobalStyleSheet.row,{alignItems:'center',gap:10}]}>
                                        <TouchableOpacity
                                            // onPress={() => navigation.goBack()}
                                            style={{   height:45,
                                                width:45,
                                                borderRadius:45,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                backgroundColor:COLORS.background}}
                                        >
                                            <FeatherIcon size={24} color={COLORS.title} name={'search'} />
                                        </TouchableOpacity>
                                        <View style={{flex:1}}>
                                            <TextInput
                                                placeholder="Buscar ubicación..."
                                                value={searchText}
                                                onChangeText={setSearchText}
                                                placeholderTextColor={COLORS.text}
                                                style={{
                                                    ...FONTS.fontRegular,
                                                    height:48,
                                                    width:'100%',
                                                    borderRadius:30,
                                                    paddingHorizontal:20,
                                                    color:COLORS.title,
                                                    fontSize:14,
                                                    backgroundColor:COLORS.background
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ height: 200, width: Dimensions.get("screen").width }}>
                                        <FlashList
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
                                            estimatedItemSize={200}
                                        />
                                        <View style={{padding: 16}}>
                                            <View style={styles.mapPlaceholder}>
                                                <MapView style={StyleSheet.absoluteFillObject} region={mapRegion}>
                                                    <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
                                                </MapView>
                                            </View>
                                        </View>
                                    </View>
                                </View>
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
        marginBottom:10,
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