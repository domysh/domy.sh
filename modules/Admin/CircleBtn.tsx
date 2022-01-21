import React from "react"
import { Button } from "react-bootstrap"
import currentStyle from "./style.module.scss"

export const CircleBtn = React.forwardRef<HTMLButtonElement,{ icon:string, onClick?: (p:any) => any, className?:string|null, variant:string}>(
    ({icon, className, onClick, variant, ...props}, ref)=> {
    return <Button
               ref={ref}
               onClick={onClick}
               className={`${currentStyle.btn} ${className?className:""}`}
               variant={variant}
               {...props}>
            <i className={icon} />
        </Button>
})