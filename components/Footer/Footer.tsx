import Clickable from "../Clickable/Clickable"
import TextLink from "../TextLink/TextLink"
import {fetchFooter} from '../../util/backendFetching'
import { useRouter } from 'next/router'
import { Fragment } from "react"
import parse from 'html-react-parser';
export default function Footer() {
    const router = useRouter()
    const { locale } = router
    const footerContent = fetchFooter(locale)
    return (
        <div className="bg-ben-black text-white mt-20 md:mt-40 w-full bottom-0 flex flex-col items-center md:flex-row md:items-center md:justify-center md:pt-2 md:pb-12">
            <div className="  md:flex md:flex-col md:items-start md:mr-24">
                <div className="align-middle text-center mt-6 mb-6  md:align-baseline md:text-left  ">
                    <h2 className="font-fg text-lg p-1 md:text-2xl md:ml-2   ">
                    {footerContent.social.title}
                    </h2>
                    <button className="p-1 outline outline-transparent focus:outline focus:outline-transparent">
                        <div className="flex space-x-5 ">
                            <Clickable type="anchor" color="dark" href="https://twitter.com/preiss_benjamin" target="_blank"  >
                                <div className="h-9 w-9 p-1.5">
                                    <div className="h-full w-full bg-twitter-white bg-no-repeat bg-contain bg-center">
                                    </div>
                                </div>
                            </Clickable>
                            <Clickable type="anchor" color="dark" href="https://github.com/benjaminpreiss" target="_blank"  > 
                                <div className="h-9 w-9 p-1.5">
                                    <div className="h-full w-full bg-github-white bg-no-repeat bg-contain bg-center">

                                    </div>
                                </div>
                            </Clickable>
                            <Clickable type="anchor" color="dark" href="https://gitlab.com/benjaminpreiss" target="_blank"   >
                                <div className="h-9 w-9 p-1.5">
                                    <div className="h-full w-full bg-gitlab-white bg-no-repeat bg-contain bg-center">
                                    </div>
                                </div>
                            </Clickable>
                            <Clickable type="anchor" color="dark" href="https://bitbucket.org/benjmanable/" target="_blank"   >
                                <div className="h-9 w-9 p-1.5">
                                    <div className="h-full w-full bg-bitbucket-white bg-no-repeat bg-contain bg-center">
                                    </div>
                                </div>
                            </Clickable>
                        </div>
                    </button>
                </div>
                <div className=" align-middle text-center md:text-left  mt-6 mb-4 md:items-start  ">
                    <h2 className="font-fg text-lg md:text-2xl md:p-1.5 md:ml-2 md:mt-8   "> 
                    {footerContent.privacy.title}
                    </h2>
                    <div className="md:ml-3.5 ">
                    <TextLink type="next-link" color="dark" href="/privacy" >
                        <span className="font-fgt text-white text-sm font-light " >{footerContent.privacy.linkText}</span>
                    </TextLink>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-6 mb-4 md:mt-0 md:items-start">
                <h2 className="font-fg text-lg md:mt-6 md:text-2xl  ">
                {footerContent.imprint.title}
                </h2>
                <div className="grid grid-cols-2 w-full font-fg font-medium max-w-sm md:max-w-[22rem] text-sm text-right md:text-sm md:text-left gap-x-7 gap-y-3 mt-3">
                    {footerContent.imprint.content.map((imprintEntry, key) => {
                        return (
                            <Fragment key={key}>
                                <div>{imprintEntry.title}</div>
                                <div className="font-fgt font-light text-left space-y-1">{parse(imprintEntry.html)}</div>
                            </Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}