import Link from "next/link";

type AnchorProps = {
    type: "anchor";
    href: string;
    color: "dark" | "white";
    target: string;
    children: React.ReactNode;

}

type NextLinkProps = {
    type: "next-link";
    href: string;
    color: "dark" | "white";
    target?: never;
    children: React.ReactNode;
}

type ClickableProps = AnchorProps | NextLinkProps;

export default function TextLink({type, color, children,  ...all}: ClickableProps) {
    const rest: Partial<ClickableProps> = all
    const classParent = color === "white" ? 
        "underline decoration-1 underline-offset-1 align-center hover:no-underline px-[2px] py-[2px] -my-[3px] border-[1px] border-transparent focus:bg-ben-black focus:bg-opacity-5 hover:border-b-ben-black -mx-[3px] hover:bg-ben-black hover:bg-opacity-5 transition-transform active:bg-ben-black active:bg-opacity-10 outline-none focus:after:p-[2px] focus:after:-ml-[3px] focus:after:-mr-[3px] focus:after:border-[1px] focus:after:border-ben-black focus:after:border-l-transparent focus:before:p-[2px] focus:before:-ml-[3px] focus:before:-mr-[3px] focus:before:border-[1px] focus:before:border-ben-black focus:before:border-r-transparent " :
        "underline decoration-1 underline-offset-1 align-center hover:no-underline px-[2px] py-[2px] -my-[3px] border-[1px] border-transparent focus:bg-white     focus:bg-opacity-5 hover:border-b-white     -mx-[3px] hover:bg-white     hover:bg-opacity-5 transition-transform active:bg-white     active:bg-opacity-10 outline-none focus:after:p-[2px] focus:after:-ml-[3px] focus:after:-mr-[3px] focus:after:border-[1px] focus:after:border-white     focus:after:border-l-transparent focus:before:p-[2px] focus:before:-ml-[3px] focus:before:-mr-[3px] focus:before:border-[1px] focus:before:border-white     focus:before:border-r-transparent "
    return type === "anchor" ? (
        <a className={classParent} href={rest.href} target={rest.target}>
            {children}        
        </a>
    ) : (
        <Link href={rest.href ? rest.href : ""}>
             <a className={classParent}>
                {children}        
            </a>
        </Link>
    )
}