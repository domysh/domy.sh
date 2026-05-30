import Link from "next/link";
import React, { useContext, useEffect, useState, useRef } from "react"
import { Container, Nav, Navbar } from "react-bootstrap";
import style from "./style.module.scss"
import { useRouter } from 'next/router';
import { InfosContext } from "../Context/Infos";
import Image from "next/image";

export function NavLink({ href, children, className, ...props }:{ href:string, children:any, className?:string}) {
    const { asPath } = useRouter();
    if (asPath.split("?")[0] === href) {
        if (className) className += ' ' + style.active
        else className = style.active
    }

    return (
        <Link href={href} className={className} {...props}>
            {children}
        </Link>
    );
}

export const NavBar = () => {
    const infos = useContext(InfosContext)
    const [onTop, setOnTop] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true); // default true, checkScroll will correct it

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Math.ceil deals with fractional pixel scrolls
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [infos]);

    useEffect(()=>{
      const updateStatus = () => {
        setOnTop(window.scrollY <= 100)
      }
      window.addEventListener("scroll",updateStatus)
      return () => {
        window.removeEventListener("scroll",updateStatus)
      }
    },[])
    
  const NavBtn = ({ to, children }:{ to:string, children?:any }) => {
    return (<NavLink href={to} className={style.nav_link}>{children}</NavLink>)
  }

  const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
          const amount = 200;
          scrollRef.current.scrollBy({
              left: direction === 'left' ? -amount : amount,
              behavior: 'smooth'
          });
      }
  };

  return (
    <nav className={`${onTop ? style.onTop : style.onBottom} ${style.floating_nav}`}>
        <div className={style.scroll_wrapper}>
            {canScrollLeft && (
                <div className={style.scroll_fade_left}>
                    <button className={style.scroll_btn} onClick={() => scroll('left')}>
                        <i className="fa-solid fa-chevron-left" />
                    </button>
                </div>
            )}
            
            <div 
                className={style.nav_scroll_container} 
                ref={scrollRef} 
                onScroll={checkScroll}
            >
              <NavBtn to="/">Home</NavBtn>
              {infos.pages.map((o,k) => {
                if (o.highlighted)
                  return <NavBtn to={o.path} key={k}>{o.name}</NavBtn>
              })}
            </div>

            {canScrollRight && (
                <div className={style.scroll_fade_right}>
                    <button className={style.scroll_btn} onClick={() => scroll('right')}>
                        <i className="fa-solid fa-chevron-right" />
                    </button>
                </div>
            )}
        </div>
    </nav>
  );
}



