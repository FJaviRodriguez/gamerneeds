import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FiltradoGenero = ({ isOpen, onClose, onFilterSelect }) => {
    const [generos, setGeneros] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(new Set());

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/generos`);
                setGeneros(response.data);
            } catch (error) {
                console.error('Hubo un error al cargar los generos:', error);
            }
        };
        fetchGeneros();
    }, []);
    const handleGenreToggle = (genero) => {
        const newSelected = new Set(selectedGenres);
        if (newSelected.has(genero.idgenero)) {
            newSelected.delete(genero.idgenero);
        } else {
            newSelected.add(genero.idgenero);
        }
        setSelectedGenres(newSelected);
        const selectedGenresList = Array.from(newSelected);
        onFilterSelect(selectedGenresList.length > 0 ? selectedGenresList : null);
    };
    if (!isOpen) return null;
    return (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5" onClick={(e) => e.stopPropagation()}>
            <div className="py-1" role="menu" aria-orientation="vertical">
                {generos.map((genero) => (
                    <label key={genero.idgenero} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 cursor-pointer">
                        <input type="checkbox" className="rounded bg-zinc-600 border-zinc-500 text-orange-500 focus:ring-orange-500 mr-2" checked={selectedGenres.has(genero.idgenero)} onChange={() => handleGenreToggle(genero)}/>
                        {genero.nombre}
                    </label>
                ))}
                {selectedGenres.size > 0 && (
                    <button className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-zinc-700 border-t border-zinc-700" onClick={() => {setSelectedGenres(new Set()); onFilterSelect(null);}}>Limpiar filtros</button>
                )}
            </div>
        </div>
    );
};

export default FiltradoGenero;