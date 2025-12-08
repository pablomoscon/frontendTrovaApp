import { useEffect, useState, useRef } from 'react';
import { useSearchAlbums } from './useSearchAlbums';
import { usePageAndSearch } from '../shared/usePageAndSearch';

export const useSearchAlbumsResults = (
    initialQuery: string,
    pageSize: number,
    pageKey = 'searchResultsPage'
) => {
    const {
        page,
        setPage,
        searchTerm,
        setSearchTerm,
        handleSearchKeyDown,
    } = usePageAndSearch(pageKey, initialQuery);

    const [hasSearched, setHasSearched] = useState(!!initialQuery);
    const prevQueryRef = useRef(initialQuery);

    // Detecta cambios en initialQuery y actualiza searchTerm y page
    useEffect(() => {
        if (prevQueryRef.current !== initialQuery) {
            prevQueryRef.current = initialQuery;
            setSearchTerm(initialQuery);
            setPage(1);
        }
    }, [initialQuery, setPage, setSearchTerm]);

    const { albums, isLoading, error, totalPages } = useSearchAlbums(
        searchTerm,
        page - 1,
        pageSize,
        hasSearched,
        'ACTIVE'
    );

    /**
     * Actualiza hasSearched cuando cambia el término
     */
    useEffect(() => {
        const isValid = searchTerm.trim() !== '';

        queueMicrotask(() => {
            setHasSearched(isValid);
            if (!isValid) setPage(1);
        });
    }, [searchTerm, setPage]);

    /**
     * Ajusta page si excede totalPages
     */
    useEffect(() => {
        if (!isLoading && page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
    }, [isLoading, page, totalPages, setPage]);

    return {
        albums,
        isLoading,
        error,
        totalPages,
        page,
        setPage,
        searchTerm,
        setSearchTerm,
        handleSearchKeyDown,
        hasSearched,
    };
};
