import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

const NavigationContext = createContext<NavigationContextType | null>(null);

interface NavigationContextType{
    darkMode: boolean
    changeDarkMode: Function
}

interface NavProviderProps{
    children: ReactNode
}

export function useNav(){
    return useContext(NavigationContext)
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

    const value = {
        darkMode,
        changeDarkMode,
    }

    return(
        <NavigationContext.Provider value={value}>
            {props.children}
        </NavigationContext.Provider>
    )
}