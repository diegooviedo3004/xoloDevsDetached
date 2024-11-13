import requests
import os
import zipfile

# Configura tu clave API de Unsplash

ACCESS_KEY = "62AXJZyB_H05AN6nboNdZwrS4dZx_FqWkWI26BsJpPM"

# Carpeta donde se guardarán las imágenes
folder_name = "cow_images"
if not os.path.exists(folder_name):
    os.makedirs(folder_name)

# Descargar imágenes

images = []

for _ in range(1,11):
    URL = f"https://api.unsplash.com/collections/yR_pw6o8VIo/photos?page={_}&client_id=" + ACCESS_KEY
    response = requests.get(URL)
    result = response.json()
    images.extend(result)

image_urls = [image['urls']['regular'] for image in images]

# Descargar las imágenes y guardarlas
for i, url in enumerate(image_urls, 1):
    img_data = requests.get(url).content
    with open(f"{folder_name}/cow_{i}.jpg", "wb") as img_file:
        img_file.write(img_data)

# Crear un archivo .zip con las imágenes
with zipfile.ZipFile(f"{folder_name}.zip", 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(folder_name):
        for file in files:
            zipf.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), folder_name))

print("¡Imágenes descargadas y comprimidas correctamente!")
