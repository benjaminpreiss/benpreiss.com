import Link from "next/link";
import { MouseEventHandler } from "react";

type ButtonProps = {
    type: "button";
    children: React.ReactNode;
    href?: never;
    onClick: MouseEventHandler<HTMLButtonElement>;
    color: "dark" | "white";
    target?: never;
    additionalClasses?: string;
}

type AnchorProps = {
    type: "anchor";
    href: string;
    children: React.ReactNode;
    onClick?: never;
    color: "dark" | "white";
    target: string;
    additionalClasses?: string;
}

type NextLinkProps = {
    type: "next-link";
    href: string;
    children: React.ReactNode;
    onClick?: never;
    color: "dark" | "white";
    target?: never;
    additionalClasses?: string;
}

type ClickableProps = ButtonProps | AnchorProps | NextLinkProps;

export default function Clickable({type, children, color,  ...all}: ClickableProps) {
    const rest: Partial<ClickableProps> = all
    const classes = color === "white" ? 
        "block rounded-lg border-[1px] border-transparent hover:bg-ben-black hover:bg-opacity-5 focus:border-ben-black outline outline-transparent focus:outline-ben-black/20 focus:outline-[3px] active:scale-90 transition-transform active:bg-ben-black active:bg-opacity-10" :
        "block rounded-lg border-[1px] border-transparent hover:bg-white hover:bg-opacity-20 focus:border-white outline outline-transparent focus:outline-white/40 focus:outline-[3px] active:scale-90 transition-transform active:bg-white active:bg-opacity-30"
    return type === "button" ? (
        <button className={classes + " " + rest.additionalClasses} onClick={rest.onClick}>
            {children}
        </button>
    ) : type === "anchor" ? (
        <a className={classes + " " + rest.additionalClasses} href={rest.href} target={rest.target}>
            {children}
        </a>
    ) : (
        <Link href={rest.href ? rest.href : ""}>
            <a className={classes + " " + rest.additionalClasses}>
                {children}
            </a>
        </Link>
    )
}