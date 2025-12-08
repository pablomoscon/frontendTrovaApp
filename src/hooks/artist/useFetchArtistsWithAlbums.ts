import { useState, useEffect } from 'react';
import { Artist } from '../../Interfaces/ArtistInterface';
import { fetchArtistsWithAlbums } from '../../services/artistService';

export const useFetchArtistsWithAlbums = (page: number, size: number) => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        queueMicrotask(() => {
            setIsLoading(true);
            setError(null);
        });

        fetchArtistsWithAlbums(page, size)
            .then(data => {
                queueMicrotask(() => {
                    setArtists(data.content);
                    setTotalPages(data.totalPages);
                });
            })
            .catch(err =>
                queueMicrotask(() =>
                    setError(err.message || 'Error al cargar artistas')
                )
            )
            .finally(() =>
                queueMicrotask(() => setIsLoading(false))
            );
    }, [page, size]);

    return { artists, totalPages, isLoading, error };
};
