import { createContext, useContext, useEffect, useState } from "react";
import style from "./style.module.scss"

export const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
    const [content, setContent] = useState(null)

    let pageClasses = []
    let overlayClasses = []

    if (content != null){
        pageClasses.push(style.fullscreen_hide)
        overlayClasses.push(style.overlay)
        if (content.center){
            overlayClasses.push(style.center)
        }
        if (content.transparent){
            pageClasses.push(style.blur_effect)
        }else{
            pageClasses.push(style.no_visible)
        }
    }else{
        overlayClasses.push(style.no_visible)
    }

    return <OverlayContext.Provider value={[content, setContent]}>
        <div className={pageClasses.join(" ")}>
          {children}
        </div>
        {content?<div className={overlayClasses.join(" ")} >
            {content.children}
        </div>:null}
    </OverlayContext.Provider>
}

export const FullScreen = ({ children, center=false, transparent=false }) => {
    
    const [,setOverlay] = useContext(OverlayContext)

    useEffect(() => {
        setOverlay({children,center,transparent})
        return () => {setOverlay(null)}
    },[])

    return <></>
}