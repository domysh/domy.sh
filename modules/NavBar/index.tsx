import Link from "next/link";
import React, { useContext, useEffect, useState } from "react"
import { Container, Nav, Navbar } from "react-bootstrap";
import style from "./style.module.scss"
import { useRouter } from 'next/router';
import { InfosContext } from "../Context/Infos";
import Image from "next/image";


export function NavLink({ href, children, className, ...props }:{ href:string, children:any, className?:string}) {
    const { asPath } = useRouter();
    if (asPath === href) {
        if (className) className += ' active'
        else className = "active"
    }

    return (
        <Link href={href}>
            <a className={className} {...props}>
                {children}
            </a>
        </Link>
    );
}

export const NavBar = () => {
    const infos = useContext(InfosContext)
    const [onTop, setOnTop] = useState(true);
    const [collapsed, setCollapsed] = useState(true)
    const [toggleVisible, setToggleVisible] = useState(true)

    const nav_collapse_btn = React.createRef<HTMLButtonElement>()
    
    useEffect(()=>{
      const collapse_btn = nav_collapse_btn.current
      const updateStatus = () => {
        setOnTop(window.pageYOffset <= 100)
      }
      const closeOnResize = () => {
        setToggleVisible(collapse_btn?getComputedStyle(collapse_btn).display !== "none":false)        
      }
      window.addEventListener("resize",closeOnResize)
      window.addEventListener("scroll",updateStatus)
      return () => {
        window.removeEventListener("resize",closeOnResize)
        window.removeEventListener("scroll",updateStatus)
      }
    },[])
    
  const NavBtn = ({ to, children }:{ to:string, children?:any }) => {
    return (<Nav.Link as={NavLink} onClick={
      () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!collapsed) nav_collapse_btn.current?.click()
      }
    } href={to}>{children}</Nav.Link>)
  }

  return (
    <Navbar 
      className={onTop && (collapsed || !toggleVisible)?style.onTop:style.onBottom}
      collapseOnSelect fixed="top"
      expand="lg" bg="dark" variant="dark"
      style={{transition:"background-color .8s"}} >
      
    <Container fluid className={style.navbar}>
    <Navbar.Brand as={NavLink} href="/">
        <Image
            src="/favicon.ico"
            width="30"
            height="30"
            objectFit="contain"
            className="d-inline-block align-top"
            alt="Page Logo"
        />
    </Navbar.Brand>
    <Navbar.Toggle ref={nav_collapse_btn} onClick={()=>setCollapsed(!collapsed)} />
    <Navbar.Collapse>
        <Nav className="me-auto" />
        <Nav>
          <NavBtn to="/">Home</NavBtn>
          {infos.pages.map((o,k) => {
            if (o.highlighted)
              return <NavBtn to={o.path} key={k}>{o.name}</NavBtn>
          })}
        </Nav>
    </Navbar.Collapse>
    </Container>
    </Navbar>
  );
}



