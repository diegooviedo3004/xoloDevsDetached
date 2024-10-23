import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, Switch } from 'react-native';
import {RootStackParamList} from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import Input from "../../components/Input/Input";
import {Button} from "react-native-paper";
import {useAuthStore} from "../../store/useAuthStore";

type CreatePublicationScreenProps = StackScreenProps<RootStackParamList, 'Create'>

const CreatePublication  = ({ navigation }: CreatePublicationScreenProps) => {

    const {
        access
    } = useAuthStore();
    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        age: '',
        weight: '',
        price: '',
        active: false,
        vaccinated: false,
        for_sale: false,
        birth_date: '',
        last_parturition_date: '',
        expected_parturition_date: '',
        last_heat_date: '',
        pregnancy_date: '',
        days_of_pregnancy: '',
        milk_production: '',
        days_of_lactation: '',
        brucellosis_application: false,
        mother: '',
        father: '',
        comments: '',
        breeds: '',
        traits: ''
    });

    React.useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Lo sentimos, necesitamos permisos de acceso a tu galería.');
            }
        })();
    }, []);

    const [images, setImages] = useState<string[]>([]); // Guardar varias imágenes

    // Manejo de cambios en los inputs
    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Selección de imágenes sin `allowsEditing`
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            setImages([...images, ...selectedImages]); // Agregar nuevas imágenes al estado
        }
    };

    const handleSwitchChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Enviar los datos usando fetch
    const submitForm = async () => {
        const token = access; // Reemplaza esto con tu token JWT
        const url = 'http://192.168.1.12:8000/create-cow/'; // URL de tu API
        console.log("==> access", access);
        try {
            var data = new FormData();

            // Añadir los datos del formulario a FormData
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('age', formData.age);
            data.append('weight', formData.weight);
            data.append('price', formData.price);
            data.append('active', formData.active.toString()); // Booleanos como cadenas
            data.append('vaccinated', formData.vaccinated.toString());
            data.append('for_sale', formData.for_sale.toString());
            data.append('birth_date', formData.birth_date);
            data.append('last_parturition_date', formData.last_parturition_date);
            data.append('expected_parturition_date', formData.expected_parturition_date);
            data.append('last_heat_date', formData.last_heat_date);
            data.append('pregnancy_date', formData.pregnancy_date);
            data.append('days_of_pregnancy', formData.days_of_pregnancy);
            data.append('milk_production', formData.milk_production);
            data.append('days_of_lactation', formData.days_of_lactation);
            data.append('brucellosis_application', formData.brucellosis_application.toString());
            data.append('mother', formData.mother);
            data.append('father', formData.father);
            data.append('comments', formData.comments);

            // Añadir las imágenes a FormData
            images.forEach((imageUri, index) => {
                const imageName = `image_${index}`;
                const fileType = imageUri.split('.').pop();
                data.append('images', {
                    uri: imageUri,
                    name: `${imageName}.${fileType}`,
                    type: `image/${fileType}`,
                });
            });

            const req = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                body: data,
            });

            const response = await req.json();

            if (req.ok) {
                console.log('Respuesta del servidor:', response);
            } else {
                console.error('Error al crear la vaca:', response);
            }
        } catch (e) {
            console.error('Error en el envío del formulario:', e);
        }
    };



    return (
        <ScrollView style={styles.container}>
            <Header
                title='Crear Publicacion'
                leftIcon='back'
                //titleLeft
                rightIcon1={'search'}
            />
            <Text style={styles.headerText}>Crear Publicación</Text>

            {/* Sección de Imágenes */}
            <View style={styles.imageSection}>
                <Text style={styles.subHeaderText}>Imagen de publicación</Text>
                <View style={styles.imageUpload}>
                    <Button onPress={pickImage} >Seleccionar imágenes</Button>
                </View>
                <ScrollView horizontal>
                    {images.map((imageUri, index) => (
                        <Image key={index} source={{ uri: imageUri }} style={styles.selectedImage} />
                    ))}
                </ScrollView>
            </View>

            {/* Inputs para los campos del formulario */}
            <Input
                label="Nombre"
                placeholder="Ingresa el nombre"
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
            />

            <Input
                label="Descripción"
                placeholder="Descripción"
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
            />

            <Input
                label="Edad"
                placeholder="Edad"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(text) => handleInputChange('age', text)}
            />

            <Input
                label="Peso"
                placeholder="Peso"
                keyboardType="numeric"
                value={formData.weight}
                onChangeText={(text) => handleInputChange('weight', text)}
            />

            <Input
                label="Precio"
                placeholder="Precio"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(text) => handleInputChange('price', text)}
            />

            {/* Switches para los campos booleanos */}
            <View style={styles.switchContainer}>
                <Text>¿Activo?</Text>
                <Switch
                    value={formData.active}
                    onValueChange={(value) => handleSwitchChange('active', value)}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text>¿Vacunado?</Text>
                <Switch
                    value={formData.vaccinated}
                    onValueChange={(value) => handleSwitchChange('vaccinated', value)}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text>¿En venta?</Text>
                <Switch
                    value={formData.for_sale}
                    onValueChange={(value) => handleSwitchChange('for_sale', value)}
                />
            </View>

            {/* Fechas */}
            <Input
                label="Fecha de nacimiento"
                placeholder="YYYY-MM-DD"
                value={formData.birth_date}
                onChangeText={(text) => handleInputChange('birth_date', text)}
            />

            <Input
                label="Último parto"
                placeholder="YYYY-MM-DD"
                value={formData.last_parturition_date}
                onChangeText={(text) => handleInputChange('last_parturition_date', text)}
            />

            <Input
                label="Fecha esperada de parto"
                placeholder="YYYY-MM-DD"
                value={formData.expected_parturition_date}
                onChangeText={(text) => handleInputChange('expected_parturition_date', text)}
            />

            <Input
                label="Último celo"
                placeholder="YYYY-MM-DD"
                value={formData.last_heat_date}
                onChangeText={(text) => handleInputChange('last_heat_date', text)}
            />

            <Input
                label="Fecha de preñez"
                placeholder="YYYY-MM-DD"
                value={formData.pregnancy_date}
                onChangeText={(text) => handleInputChange('pregnancy_date', text)}
            />

            <Input
                label="Días de preñez"
                placeholder="Días de preñez"
                keyboardType="numeric"
                value={formData.days_of_pregnancy}
                onChangeText={(text) => handleInputChange('days_of_pregnancy', text)}
            />

            <Input
                label="Producción de leche (L)"
                placeholder="Producción de leche"
                keyboardType="numeric"
                value={formData.milk_production}
                onChangeText={(text) => handleInputChange('milk_production', text)}
            />

            <Input
                label="Días de lactancia"
                placeholder="Días de lactancia"
                keyboardType="numeric"
                value={formData.days_of_lactation}
                onChangeText={(text) => handleInputChange('days_of_lactation', text)}
            />

            <View style={styles.switchContainer}>
                <Text>¿Aplicación de brucelosis?</Text>
                <Switch
                    value={formData.brucellosis_application}
                    onValueChange={(value) => handleSwitchChange('brucellosis_application', value)}
                />
            </View>

            <Input
                label="ID de la madre"
                placeholder="ID de la madre"
                value={formData.mother}
                onChangeText={(text) => handleInputChange('mother', text)}
            />

            <Input
                label="Nombre del padre"
                placeholder="Nombre del padre"
                value={formData.father}
                onChangeText={(text) => handleInputChange('father', text)}
            />

            <Input
                label="Comentarios"
                placeholder="Comentarios adicionales"
                value={formData.comments}
                onChangeText={(text) => handleInputChange('comments', text)}
            />

            {/* Botón para enviar el formulario */}
            <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
                <Text style={styles.submitButtonText}>Crear Publicación</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
    },
    imageSection: {
        marginTop: 20,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#62676C',
    },
    imageUpload: {
        marginTop: 10,
        padding: 20,
        borderWidth: 1,
        borderStyle: 'dotted',
        borderColor: '#9C9CA3',
        alignItems: 'center',
    },
    selectedImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CreatePublication;