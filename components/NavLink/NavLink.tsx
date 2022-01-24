import Image from 'next/image';
import ReactLogo from '../../public/link-arrow.svg';
import Link from 'next/link';
import { MouseEventHandler } from "react";

type ButtonProps = {
    type: "button";
    message: string;
    href?: never;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

type NextLinkProps = {
    type: "next-link";
    message: string;
    href: string;
    onClick?: never;
}

type NavLinkProps = ButtonProps | NextLinkProps;
export default function NavLink({message, type, ...all} : NavLinkProps): JSX.Element {
    const rest: Partial<NavLinkProps> = all
    return type === "next-link" ? (
        <Link href={rest.href ?? ""} >
            <a className='group px-2 pb-1 pt-0.5 flex items-center justify-center border-transparent border-[1px] focus-within:border-ben-black focus:rounded-md focus:outline-[3px] focus:outline-ben-black/20 focus:outline focus:bg-opacity-5 active:scale-90 transition-transform active:bg-ben-black active:bg-opacity-10 active:rounded-md '>
                <div className='flex text-lg items-center '>
                    <div className=' flex items-center flex-col pl-2'> 
                        <span className=' leading-none focus:outline-none text-2xl font-fg font-medium group-hover:-translate-y-0.5 md:text-lg'
                        >{message}
                        </span>
                        <div className=' w-1/2  min-h-[1px] group-hover:bg-ben-black '>
                        </div>    
                    </div>
                    <div className='relative h-2 w-4 -translate-y-[1px] group-hover:translate-x-1 group-hover:-translate-y-1
                            group-hover:transform group-hover:duration-200 duration-200 transform'>
                        <Image layout='fill' src= {ReactLogo} alt="" objectFit='contain' objectPosition="center"/>
                    </div>
                </div>
            </a>
        </Link>
    ) : (
        <button className='group px-2 pb-1 pt-0.5 flex items-center justify-center border-transparent border-[1px] focus-within:border-ben-black focus:rounded-md focus:outline-[3px] focus:outline-ben-black/20 focus:outline focus:bg-opacity-5 active:scale-90 transition-transform active:bg-ben-black active:bg-opacity-10 active:rounded-md ' onClick={rest.onClick} >
            <div className='flex text-lg items-center '>
                <div className=' flex items-center flex-col pl-2'> 
                    <span className=' leading-none focus:outline-none text-2xl font-fg font-medium group-hover:-translate-y-0.5 md:text-lg'
                    >{message}
                    </span>
                    <div className=' w-1/2  min-h-[1px] group-hover:bg-ben-black '>
                    </div>    
                </div>
                <div className='relative h-2 w-4 -translate-y-[1px] group-hover:translate-x-1 group-hover:-translate-y-1
                        group-hover:transform group-hover:duration-200 duration-200 transform'>
                    <Image layout='fill' src= {ReactLogo} alt="" objectFit='contain' objectPosition="center"/>
                </div>
            </div>
        </button>
    )
}