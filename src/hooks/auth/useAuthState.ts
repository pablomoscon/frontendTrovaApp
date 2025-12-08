import { useState, useCallback, useEffect } from "react";
import { User } from "../../Interfaces/UserInterface";
import { getValidUserOrNull } from "../../utils/validateUserTokenUtils";
import { clearUser, loadStoredUser, saveUser } from "../../services/authService";
import { isTokenExpired } from "../../utils/tokenUtils";

export const useAuthState = () => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = loadStoredUser();
        return getValidUserOrNull(stored);
    });

    const login = useCallback((userData: User) => {
        saveUser(userData);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        clearUser();
        setUser(null);
    }, []);

    useEffect(() => {
        if (user && isTokenExpired(user.token)) {
            queueMicrotask(() => logout());
        }
    }, [user, logout]);
    
    return { user, login, logout, setUser };
};
