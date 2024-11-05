import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, Switch, ScrollViewProps  } from 'react-native';
import {RootStackParamList} from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import Input from "../../components/Input/Input";
import {Button} from "react-native-paper";
import {useAuthStore} from "../../store/useAuthStore";
import {useTheme} from "@react-navigation/native";
import {ProgressStep, ProgressSteps} from "@ouedraogof/react-native-progress-steps";

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

    // <Text style={styles.headerText}>Crear Publicación</Text>
    //
    // {/* Sección de Imágenes */}
    // <View style={styles.imageSection}>
    //     <Text style={styles.subHeaderText}>Imagen de publicación</Text>
    //     <View style={styles.imageUpload}>
    //         <Button onPress={pickImage} >Seleccionar imágenes</Button>
    //     </View>
    //     <ScrollView horizontal>
    //         {images.map((imageUri, index) => (
    //             <Image key={index} source={{ uri: imageUri }} style={styles.selectedImage} />
    //         ))}
    //     </ScrollView>
    // </View>
    //

    const theme = useTheme();
    const { colors }: { colors: any; } = theme;

    const defaultScrollViewProps: ScrollViewProps = {
        keyboardShouldPersistTaps: 'handled',
        contentContainerStyle: {
            flex: 1,
            justifyContent: 'center',
        },
    };
    const onNextStep = () => {
        console.log('called next step');
    };

    const onPaymentStepComplete = () => {
        alert('Payment step completed!');
    };

    const onPrevStep = () => {
        console.log('called previous step');
    };

    const onSubmitSteps = () => {
        console.log('called on submit step.');
    };


    return (
      <View style={{backgroundColor: colors.card, flex: 1 }}>
          <Header
              title='Crear Publicacion'
              leftIcon={'back'}
              rightIcon2={'home'}
          />
          <View style={{ flex: 1, marginTop: 50 }}>
              <ProgressSteps>
                  <ProgressStep
                      label="Payment"
                      onNext={onPaymentStepComplete}
                      onPrevious={onPrevStep}
                      scrollViewProps={defaultScrollViewProps}
                  >
                      <View style={{ alignItems: 'center' }}>
                          <Text>Payment step content</Text>
                      </View>
                  </ProgressStep>
                  <ProgressStep
                      label="Shipping Address"
                      onNext={onNextStep}
                      onPrevious={onPrevStep}
                      scrollViewProps={defaultScrollViewProps}
                  >
                      <View style={{ alignItems: 'center' }}>
                          <Text>Shipping address step content</Text>
                      </View>
                  </ProgressStep>
                  <ProgressStep
                      label="Billing Address"
                      onNext={onNextStep}
                      onPrevious={onPrevStep}
                      scrollViewProps={defaultScrollViewProps}
                  >
                      <View style={{ alignItems: 'center' }}>
                          <Text>Billing address step content</Text>
                      </View>
                  </ProgressStep>
                  <ProgressStep
                      label="Confirm Order"
                      onPrevious={onPrevStep}
                      onSubmit={onSubmitSteps}
                      scrollViewProps={defaultScrollViewProps}
                  >
                      <View style={{ alignItems: 'center' }}>
                          <Text>Confirm order step content</Text>
                      </View>
                  </ProgressStep>
              </ProgressSteps>
          </View>
      </View>
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