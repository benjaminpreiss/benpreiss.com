import NavLink from '../NavLink/NavLink';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Clickable from "../Clickable/Clickable"
import {fetchMenu} from "../../util/backendFetching"
import { useRouter } from "next/router";

type AppProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Menu({ setIsOpen}: AppProps)  {
    const router = useRouter()
    const { locale } = router
    return (
        <div className="flex flex-col items-center w-full h-screen justify-between text-center text-ben-black fixed inset-0 bg-white z-[100] p-8">
            <Clickable type="button" color="white" onClick={() => setIsOpen(false)}  > 
                <div className="p-2 w-9 h-9" >
                    <div className="bg-cross-x bg-no-repeat bg-center bg-contain w-full h-full"></div>  
                </div>
            </Clickable>
            <div className="flex flex-col margin-auto justify-between h-32 font-fg">
                {fetchMenu(locale).map((menuEntry, key) => <NavLink key={key} message={menuEntry.message} href={menuEntry.href} />)}
            </div>
            <LanguageSwitcher setIsOpen={setIsOpen} />
        </div> 
    ) 
}