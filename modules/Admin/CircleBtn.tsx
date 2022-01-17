import React, { CSSProperties } from "react"
import { Button } from "react-bootstrap"
import currentStyle from "./style.module.scss"

export const CircleBtn = React.forwardRef(({onClick, icon, variant, style, className}:
    {onClick:()=>any, icon:string, variant:string, style?:CSSProperties, className?:string|null}, ref:any) => {
    return <Button variant={variant} className={`${currentStyle.btn} ${className?className:""}`} onClick={onClick} style={style} ref={ref}>
            <i className={icon} />
        </Button>
})