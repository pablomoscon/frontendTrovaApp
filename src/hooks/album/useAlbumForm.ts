import { useState, useEffect, useMemo } from "react";
import { AlbumFormData } from "../../Interfaces/AlbumInterface";
import { Song } from "../../Interfaces/SongInterface";
import { MultiSelectEvent } from "../../types/MultiSelectEvent";

export const useAlbumForm = () => {
    const [formData, setFormData] = useState<AlbumFormData>({
        title: '',
        artistId: 0,
        listOfSongs: [{ name: '', duration: '', id: 0 }],
        details: '',
        genres: [],
        cdNumber: '',
        year: undefined,
        photo: undefined,
        displayArtistName: '',
        appleMusicLink: '',
        spotifyLink: '',
        amazonMusicLink: '',
    });

    const [songsInput, setSongsInput] = useState<string>('');

    // imagePreview se calcula derivado de formData.photo
    const imagePreview = useMemo(() => {
        if (formData.photo instanceof File) {
            return URL.createObjectURL(formData.photo);
        } else if (typeof formData.photo === 'string') {
            return formData.photo;
        } else {
            return null;
        }
    }, [formData.photo]);

    // Liberar URL cuando cambie la foto o el componente se desmonte
    useEffect(() => {
        if (formData.photo instanceof File) {
            const url = URL.createObjectURL(formData.photo);
            return () => URL.revokeObjectURL(url);
        }
    }, [formData.photo]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | MultiSelectEvent
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSongChange = (e: { target: { name: "listOfSongs"; value: Song[] } }) => {
        setFormData(prev => ({
            ...prev,
            listOfSongs: e.target.value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            artistId: 0,
            genres: [],
            details: '',
            cdNumber: '',
            year: undefined,
            photo: undefined,
            listOfSongs: [{ name: '', duration: '', id: 0 }],
            displayArtistName: '',
            appleMusicLink: '',
            spotifyLink: '',
            amazonMusicLink: '',
        });
        setSongsInput('');
    };

    return {
        formData,
        handleChange,
        songsInput,
        setSongsInput,
        resetForm,
        setFormData,
        handleFileChange,
        handleSongChange,
        imagePreview,
    };
};
