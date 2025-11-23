// cloudinaryHelper.ts

interface ImageFile {
  uri: string;
  type?: string;
  fileName?: string;
}

interface CloudinaryResponse {
  secure_url?: string;
  [key: string]: any;
}

const CLOUD_NAME = "dkky3jjlo"; // Ganti dengan Cloud Name kamu
const UPLOAD_PRESET = "chat_app_upload"; // Ganti dengan Preset Name kamu

export const uploadToCloudinary = async (imageFile: ImageFile): Promise<string | null> => {
  if (!imageFile || !imageFile.uri) {
    console.error('Invalid image file');
    return null;
  }

  const data = new FormData();
  
  // Masukkan data file dengan format yang benar untuk React Native
  data.append('file', {
    uri: imageFile.uri,
    type: imageFile.type || 'image/jpeg',
    name: imageFile.fileName || 'chat_image.jpg',
  } as any);

  data.append('upload_preset', UPLOAD_PRESET);

  try {
    console.log('Uploading to Cloudinary...', {
      cloud: CLOUD_NAME,
      preset: UPLOAD_PRESET,
      uri: imageFile.uri
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: data,
      }
    );

    const result: CloudinaryResponse = await response.json();
    
    console.log('Cloudinary response:', result);
    
    if (result.secure_url) {
      console.log('Upload success! URL:', result.secure_url);
      return result.secure_url; 
    } else {
      console.error("Cloudinary Error:", result);
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    throw error;
  }
};
