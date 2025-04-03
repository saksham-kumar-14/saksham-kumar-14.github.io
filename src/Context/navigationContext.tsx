import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

const NavigationContext = createContext<NavigationContextType | null>(null);

interface NavigationContextType{
    darkMode: boolean;
    changeDarkMode: (mode: boolean) => void;
}

interface NavProviderProps{
    children: ReactNode
}

export const NavProvider: React.FC<NavProviderProps> = (props) => {
    const [darkMode, setDarkMode] = useState(true)

    useEffect(() => {
        const mode = localStorage.getItem('darkMode');
        if(mode == 'true'){
            setDarkMode(true);
            document.body.className = 'dark'
        }
        else{
            setDarkMode(false);
            document.body.className = 'light'
        }
    }, []);

    function changeDarkMode(mode: boolean){
        setDarkMode(mode)
        localStorage.setItem('darkMode', String(mode));
        if(mode) document.body.className = 'dark'
        else document.body.className = 'light'
    }

    return(
        <NavigationContext.Provider value={{ darkMode, changeDarkMode }}>
            {props.children}
        </NavigationContext.Provider>
    )
}

export function useNav() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNav must be used within a NavProvider");
    }
    return context;
}