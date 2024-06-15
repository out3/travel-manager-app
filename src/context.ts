import {createContext, useContext} from "react";
import { Travel } from "@/types.ts";

// Data which will be shared across the app
type AppContextType = {
    currentTravel: Travel | undefined,
    updateCurrentTravel: (travel?: Travel) => void,
}

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the context
export function useAppContext() {
    const appContext = useContext(AppContext);

    if (!appContext) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }

    return appContext;
}
