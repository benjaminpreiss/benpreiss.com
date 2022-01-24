import Link from "next/link";
import { useState, useEffect } from 'react';
import Menu from "../Menu/Menu";
import Clickable from "../Clickable/Clickable";
import NavLink from "../NavLink/NavLink";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import {fetchMenu} from "../../util/backendFetching"
import { useRouter } from "next/router";

export default function NavBar() {
    const router = useRouter()
    const { locale } = router
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }
        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if(entry.target.id === "navbar-area") {
                    setIsScrolled(!entry.isIntersecting)
                }
            });
          };
        const observer = new IntersectionObserver(callback, options);
        const target = document.querySelector('#navbar-area');
        if(target) observer.observe(target);
        return () => {
            if(target) observer.unobserve(target)
        }
    }, [])
    return (
        <>
            {isOpen === true ?<div className="absolute inset-0 bg-white z-10"></div> : null}
            <div id="start">
                {(isOpen === true) ? 
                    <Menu setIsOpen={setIsOpen} /> : (
                    <div id="navbar" className={"fixed inset-x-0 z-10" + (isScrolled ? ' shadow-nav-sm' : '')}>
                        <div className="relative w-full h-full">
                            <div className="w-full h-full pl-4 pr-6 py-2.5 flex justify-between items-center ">
                                <Clickable type="next-link" href="/#start" color="white"  >
                                    <div className="h-10 w-18 px-2.5 group">
                                        <div className="font-fg font-medium text-ben-black text-[1.65rem] leading-[2.3rem] ">benpreiss
                                        </div>
                                    </div>
                                </Clickable>
                                <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                                    <div className="flex space-x-3">
                                        {fetchMenu(locale).map((menuEntry, key) => <NavLink type="next-link" key={key} message={menuEntry.message} href={menuEntry.href} />)}  
                                    </div>
                                </div>
                                <div className="md:hidden">
                                <Clickable type="button" onClick={() => setIsOpen(true)} color="white" >
                                    <div className="h-12 w-12 p-2.5 z-50">
                                        <div className="h-full w-full bg-nav-burger bg-center bg-contain bg-no-repeat"></div>
                                    </div>
                                </Clickable>
                                </div>
                                <div className="hidden md:block">
                                    <LanguageSwitcher setIsOpen={setIsOpen} />
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-white supports-backdrop-blur:bg-opacity-70 backdrop-blur-nav-sm -z-10"></div>
                        </div> 
                    </div>)
                }     
            </div>
            <div id="navbar-area" className="bg-transparent w-full h-[4.25rem]"></div>
        </>
    )
}