import React, { useState } from 'react';
import { actualizarAvatar } from '../../services/usuarioService';
import { toast } from 'react-hot-toast';

const AvatarUpload = ({ onAvatarUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await actualizarAvatar(formData);
      onAvatarUpdate(response.avatarPath);
      toast.success('Avatar actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar avatar:', error);
      toast.error(error.message || 'Error al actualizar el avatar');
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