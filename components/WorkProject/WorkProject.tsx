import ReactPlayer from 'react-player/file'
import Clickable from '../Clickable/Clickable'
import { useState, useEffect, useRef } from 'react';
import TextLink from '../TextLink/TextLink'
import parse, {Element, domToReact, HTMLReactParserOptions} from 'html-react-parser';
import {useWindowContext} from '../../context/windowContext'

type frameWorkButtonType = "figma" | "adobe-xd" | "adobe-illustrator" | "nextjs" | "formik" | "react-query" | "docker" | "tailwindcss" | "xstate" | "swiperjs" | "javascript" | "webpack" | "paperjs" | "sass" 

type projectEntry = {
    title: string
    projectLink: {
        href: string
        target: string
        text: string
    },
    videoUrl: string
    colorClass: string
    buttons: frameWorkButtonType[]
    text: string
}

type WorkProjectProps = {
    frameWorkButtons: {
        name: string
        href: string
        bg: string
        width: string
    }[]
    videoUrl: string
    videoUrlMobile: string
    videoUrlFb: string
    videoUrlMobileFb: string
    color: string
    projectEntry: projectEntry
}


export default function WorkProject({frameWorkButtons, videoUrlMobile, color, projectEntry, videoUrl, videoUrlFb, videoUrlMobileFb  }: WorkProjectProps) {
    const dim = useWindowContext()
    const parseOptions: HTMLReactParserOptions = {
        replace: domNode => {
          if(domNode instanceof Element && domNode.name === "a") {
            return (
              <TextLink type="anchor" color="white" href={domNode.attribs.href} target={domNode.attribs.target}>
                {domToReact(domNode.children, parseOptions)}
              </TextLink>
            )
          }
        }
      }
    const [isInView, setIsInView] = useState(false)
    const targetRef = useRef(null)
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }
        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting)
            });
          };
        const observer = new IntersectionObserver(callback, options);
        const target = targetRef.current
        if(target) observer.observe(target);
        return () => {
            if(target) observer.unobserve(target);
        }
    }, [])
    return (
        <div>
            <div className='w-full px-4 max-w-sm mx-auto flex flex-col md:flex-row md:justify-center md:max-w-full'>
                <div className='md:w-52 md:mr-20 md:text-right'>
                    <h2 className='font-fg font-medium text-2xl leading-none'>{projectEntry.title}</h2>
                    <TextLink type="anchor" color="white" href={projectEntry.projectLink.href} target={projectEntry.projectLink.target}>
                        <span className='font-fgt text-lg font-light'>{projectEntry.projectLink.text}</span>
                    </TextLink>
                </div>
                <div className='cms-project md:max-w-sm'>
                    {parse(projectEntry.text, parseOptions)}
                    <div className=' flex flex-wrap mt-6 justify-start after:flex-auto flex-wrap-space-between-equal-distance -mx-3 gap-y-2'>
                        {frameWorkButtons.map((button, i) => {
                        return (
                            <div key={i} className="mx-1.5">
                            <Clickable type="anchor" href={button.href} color='white' target='_blank'>
                                <div className={`${button.width} h-9 p-1.5`}>
                                    <div className={`w-full h-full ${button.bg} bg-no-repeat bg-center bg-contain`}></div>
                                </div>
                            </Clickable>
                            </div>
                        )
                        })}
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: color}} className={`mt-8 w-full py-14`}>
                <div className='flex items-center w-full max-w-sm mx-auto md:max-w-screen-xl' ref={targetRef}>
                    <ReactPlayer url={[videoUrlMobile, videoUrlMobileFb]} muted playing={isInView} playsinline loop width={dim.width > 768 ? "15%" : "65%"} height="100%" className="mx-auto shadow-video-sm overflow-hidden video-container" />
                    {dim.width > 768 ? <ReactPlayer url={[videoUrl, videoUrlFb]} muted playing={isInView} playsinline loop width="65%" height="100%" className="mx-auto shadow-video-sm overflow-hidden video-container" /> : null}
                </div>
            </div>
        </div>
    )
}