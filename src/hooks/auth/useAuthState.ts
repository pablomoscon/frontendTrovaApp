import { useState, useCallback } from "react";
import { User } from "../../Interfaces/UserInterface";
import { getValidUserOrNull } from "../../utils/validateUserTokenUtils";
import { clearUser, loadStoredUser, saveUser } from "../../services/authService";

export const useAuthState = () => {
    // Inicializar desde localStorage y validar
    const [user, setUser] = useState<User | null>(() => {
        const stored = loadStoredUser();
        return getValidUserOrNull(stored);
    });

    // login y logout memoizados para no romper useMemo del provider
    const login = useCallback((userData: User) => {
        saveUser(userData);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        clearUser();
        setUser(null);
    }, []);

    return { user, login, logout };
};
