import { createContext } from "react";
import { PublicInfo } from "../interfaces";

export const InfosContext = createContext<PublicInfo>(null as unknown as PublicInfo);

export const Infos = ({ children, infos }:{ children:any, infos:PublicInfo }) => (
    <InfosContext.Provider value={infos}>
        {children}
    </InfosContext.Provider>
)
