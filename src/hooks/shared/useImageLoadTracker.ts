import { useEffect, useState } from 'react';

export function useImageLoadTracker(totalImages: number) {
    const [handled, setHandled] = useState(0);

    useEffect(() => {
        queueMicrotask(() => setHandled(0));
    }, [totalImages]);

    const handleImageLoad = () => {
        setHandled((prev) => prev + 1);
    };

    const allHandled = totalImages > 0 && handled >= totalImages;

    return { allHandled, handleImageLoad };
}
