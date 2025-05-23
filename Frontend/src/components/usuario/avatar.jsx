import React, { useState } from 'react';
import { actualizarAvatar } from '../../services/usuarioService';

const AvatarUpload = ({ onAvatarUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede ser mayor a 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Formato no válido. Use JPG, PNG o WEBP');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await actualizarAvatar(file);
      onAvatarUpdate(response.avatarPath);
    } catch (error) {
      setError(error.message || 'Error al actualizar el avatar');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative">
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" id="avatar-upload"/>
      <label htmlFor="avatar-upload" className="cursor-pointer bg-[#FF4C1A] text-white px-4 py-2 rounded-lg">
        {loading ? 'Subiendo...' : 'Cambiar Avatar'}
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default AvatarUpload;