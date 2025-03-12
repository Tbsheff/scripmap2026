import { createContext } from "react";
import { ScripturesContextType } from "../Types";

export const ScripturesDataContext = createContext<ScripturesContextType | null>(null);
