import { useState, useEffect, useCallback } from 'react';
import { Artist, ArtistsData } from '../../Interfaces/ArtistInterface';
import { fetchArtists } from '../../services/artistService';

export const useFetchArtists = (page: number, size: number, status?: string) => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadArtists = useCallback(async () => {
        setIsLoading(true);
        try {
            const res: ArtistsData = await fetchArtists(page, size, status); // 👈 pasamos status si existe
            const artistList = res.content || [];

         // Show artists immediately
            setArtists(artistList);
            setTotalPages(Math.max(1, res.totalPages));
            setCurrentPage(res.number ?? 0);
            setError(null);

            // Preload images in the background (non-blocking)
            artistList.forEach((artist) => {
                if (artist.photo) {
                    const img = new Image();
                    img.src = artist.photo;
                }
            });

        } catch (e) {
            console.error(e);
            const msg = e instanceof Error ? e.message : 'Failed to load artists';
            setError(msg);
            setArtists([]);
            setTotalPages(1);
            setCurrentPage(0);
        } finally {
            setIsLoading(false);
        }
    }, [page, size, status]);

    useEffect(() => {
        loadArtists();
    }, [loadArtists]);

    return {
        artists,
        totalPages,
        isLoading,
        error,
        reloadArtists: loadArtists,
        currentPage,
        setArtists
    };
};
