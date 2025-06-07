import React, { useState, useEffect } from 'react';
import crearInstanciaApi from '../../services/apiConfig';
import { filtrarGenero, filtrarPrecio } from '../../services/busquedaService';

const FiltradoGenero = ({ isOpen, onClose, onFilterSelect }) => {
    const [generos, setGeneros] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [selectedPrice, setSelectedPrice] = useState('');
    const [error, setError] = useState(null);
    const api = crearInstanciaApi();

    const rangosPrecios = [
        { id: 'menos5', nombre: 'Menos de 5€' },
        { id: 'menos15', nombre: 'Menos de 15€' },
        { id: 'menos30', nombre: 'Menos de 30€' },
        { id: 'menos50', nombre: 'Menos de 50€' },
        { id: 'mas50', nombre: 'Más de 50€' }
    ];

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                if (!api) {
                    throw new Error('API client not initialized');
                }
                const response = await api.get('/generos');
                setGeneros(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching genres:', error);
                setError('Error al cargar los géneros');
                setGeneros([]);
            }
        };
        
        if (isOpen) {
            fetchGeneros();
        }
    }, [isOpen]);

    const handleGenreToggle = async (genero) => {
        const newSelected = new Set(selectedGenres);
        if (newSelected.has(genero.idgenero)) {
            newSelected.delete(genero.idgenero);
        } else {
            newSelected.add(genero.idgenero);
        }
        setSelectedGenres(newSelected);
        setSelectedPrice(''); // Limpiar filtro de precio al seleccionar género
        
        const selectedGenresList = Array.from(newSelected);
        if (selectedGenresList.length > 0) {
            const filteredGames = await filtrarGenero(selectedGenresList);
            onFilterSelect(filteredGames);
        } else {
            onFilterSelect(null);
        }
    };

    const handlePriceSelect = async (rango) => {
        setSelectedPrice(rango);
        setSelectedGenres(new Set()); // Limpiar filtros de género al seleccionar precio
        
        if (rango) {
            const filteredGames = await filtrarPrecio(rango);
            onFilterSelect(filteredGames);
        } else {
            onFilterSelect(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5" onClick={(e) => e.stopPropagation()}>
            <div className="py-1" role="menu" aria-orientation="vertical">
                <div className="px-3 py-2 text-sm font-semibold text-gray-300 border-b border-zinc-700">
                    Géneros
                </div>
                {generos.map((genero) => (
                    <label key={genero.idgenero} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 cursor-pointer">
                        <input 
                            type="checkbox"
                            className="rounded bg-zinc-600 border-zinc-500 text-orange-500 focus:ring-orange-500 mr-2"
                            checked={selectedGenres.has(genero.idgenero)}
                            onChange={() => handleGenreToggle(genero)}
                        />
                        {genero.nombre}
                    </label>
                ))}

                <div className="px-3 py-2 text-sm font-semibold text-gray-300 border-b border-zinc-700 mt-2">
                    Precios
                </div>
                {rangosPrecios.map((rango) => (
                    <label key={rango.id} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 cursor-pointer">
                        <input 
                            type="radio"
                            name="precio"
                            className="mr-2 text-orange-500 focus:ring-orange-500"
                            checked={selectedPrice === rango.id}
                            onChange={() => handlePriceSelect(rango.id)}
                        />
                        {rango.nombre}
                    </label>
                ))}

                {(selectedGenres.size > 0 || selectedPrice) && (
                    <button 
                        className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-zinc-700 border-t border-zinc-700"
                        onClick={() => {
                            setSelectedGenres(new Set());
                            setSelectedPrice('');
                            onFilterSelect(null);
                        }}
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
};

export default FiltradoGenero;