import { useEffect, useRef } from 'react';

export function useResetStatesOnPageChange(
    page: number,
    resetFns: (() => void)[]
) {
    const stableFns = useRef(resetFns);

    useEffect(() => {
        stableFns.current = resetFns;
    }, [resetFns]);

    useEffect(() => {
        stableFns.current.forEach((fn) => fn());
    }, [page]);
}
