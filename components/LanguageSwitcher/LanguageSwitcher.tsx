import { useRouter } from "next/router";
import NavLanguage from "../NavLanguage/NavLanguage"

type LanguageSwitcherProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LanguageSwitcher({setIsOpen}: LanguageSwitcherProps){
    const router = useRouter()
    const { locale, locales } = router
    const fallBackLocales = ["en", "de"]
    return (
        <div className='flex group overflow-visible relative h-10 w-10 items-center justify-center md:mb-0' >
            <div className="absolute hidden md:block inset-0 z-10 md:group-hover:-translate-x-2/3 peer"></div>
            {(locales || fallBackLocales).map((lang, index, array) => {
                return (
                    <div key={index} className={`p-0.5 absolute inset-0 flex justify-center items-center 
                        ${locale === lang ? `z-20`:`z-10  `} 
                        ${array[0] === lang ? ` hover:translate-x-2/3 group-hover:translate-x-2/3 md:hover:-translate-x-[133%] md:group-hover:-translate-x-[133%] md:peer-hover:-translate-x-[133%] `:`hover:-translate-x-2/3 group-hover:-translate-x-2/3 md:hover:translate-x-0 md:group-hover:translate-x-0 `}`} 
                    >    
                        <NavLanguage message={lang} setIsOpen={setIsOpen}/>    
                    </div>
                )
            })}  
        </div>     
    )     
}