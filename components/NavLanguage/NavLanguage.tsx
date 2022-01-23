import { useRouter } from 'next/router'

type AppProps = {
    message: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; 
};
export default function NavLanguage({message, setIsOpen} :AppProps): JSX.Element {
    const router = useRouter()
    const { pathname, asPath, query, locale } = router
    return (
        <button className={`
            rounded-full justify-center items-center border-transparent border-[1px] p-1 px-2 h-10 w-10 hover:border-ben-black hover:bg-ben-black hover:bg-opacity-10 transition-transform duration-500 focus:border-[1px] focus:border-ben-black focus:outline focus:outline-[4px] focus:outline-ben-black/20 active:scale-90 active:bg-ben-black active:bg-opacity-20  ${locale === message ? `flex` : ` hidden hover:flex group-hover:flex` }`}
            onClick={() => {
                setIsOpen(false)
                router.push({ pathname, query }, asPath, { locale: message })
            }}    
        >
            <span className={`transform -translate-y-1 leading-none disabled active on state active border-b-[1px] border-b-transparent border-ben-black text-xl font-light font-fgt 
                ${locale === message ? `border-b-ben-black`:``}`}
            >
                {message}
            </span>
        </button>     
    )
}