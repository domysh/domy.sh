import Link from "next/link";
import React, { useEffect, useState } from "react"
import { Container, Nav, Navbar } from "react-bootstrap";
import { PublicInfo } from "../interfaces";
import style from "./style.module.scss"
import { useRouter } from 'next/router';


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

export const NavBar = ({ infos, id }:{ infos:PublicInfo, id:string }) => {

    const [onTop, setOnTop] = useState(true);
    
    useEffect(()=>{ 
      const updateStatus = () => {
        setOnTop(window.pageYOffset <= 100)
      }
      window.addEventListener("scroll",updateStatus)
      return () => {
        window.removeEventListener("scroll",updateStatus)
      }
  },[])
    
  const NavBtn = ({ to, children }:{ to:string, children?:any }) => {
    return (<Nav.Link as={NavLink} onClick={
      () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const collapse = document.querySelector(`#${id} .navbar-collapse.show`)
        if(collapse){
          const navbtn:HTMLElement|null = document.querySelector(`#${id} .navbar-toggler`)
          navbtn!.click()
        }
      
      }
    } href={to}>{children}</Nav.Link>)
  }

  return (
    <Navbar id={id} className={onTop?style.onTop:style.onBottom} collapseOnSelect fixed="top" expand="lg" bg="dark" variant="dark" style={{transition:"background-color .8s"}} >
    <Container fluid className={style.navbar}>
    <Navbar.Brand as={NavLink} href="/">
        <img
            src="/favicon.ico"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Page Logo"
            style={{marginRight:"10px"}}
        />
    </Navbar.Brand>
    <Navbar.Toggle/>
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



