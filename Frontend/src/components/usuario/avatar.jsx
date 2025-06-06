import React, { useState } from 'react';
import { actualizarAvatar } from '../../services/usuarioService';
import { toast } from 'react-hot-toast';

const AvatarUpload = ({ onAvatarUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede ser mayor a 5MB');
      return;
    }

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato no válido. Use JPG, PNG o WEBP');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await actualizarAvatar(formData);
      onAvatarUpdate(response.avatarPath);
      toast.success('Avatar actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar avatar:', error);
      toast.error('Error al actualizar el avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-4">
      <input 
        type="file" 
        accept="image/jpeg,image/png,image/webp" 
        onChange={handleFileChange} 
        className="hidden" 
        id="avatar-upload"
      />
      <label 
        htmlFor="avatar-upload" 
        className="cursor-pointer bg-[#FF4C1A] text-white px-4 py-2 rounded-lg inline-block"
      >
        {loading ? 'Subiendo...' : 'Cambiar Avatar'}
      </label>
    </div>
  );
};

export default AvatarUpload;