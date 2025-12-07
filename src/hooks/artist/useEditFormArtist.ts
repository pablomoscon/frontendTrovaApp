import { useEffect, useState } from 'react';
import { useDetailsArtist } from './useDetailsArtist';

export const useArtistEditForm = (artistId: number) => {
    const { artist, loading, error } = useDetailsArtist(artistId);

    const [formState, setFormState] = useState({
        name: '',
        nationality: '',
        details: '',
        photoFile: null as File | null,
        photoPreview: null as string | null,
        selectedFileName: '',
        localError: null as string | null,
    });

    useEffect(() => {
        if (!artist) return;
        queueMicrotask(() => {
            setFormState({
                name: artist.name,
                nationality: artist.nationality,
                details: artist.details ?? '',
                photoFile: null,
                photoPreview: artist.photo ?? null,
                selectedFileName: '',
                localError: null,
            });
        });
    }, [artist]);

    return { formState, setFormState, loading, error, artist };
};
