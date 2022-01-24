import type { NextPage } from 'next'
import Image from 'next/image'
import Clickable from '../components/Clickable/Clickable'
import NavBar from '../components/NavBar/NavBar'
import Footer from '../components/Footer/Footer'
import TextLink from '../components/TextLink/TextLink'
import WorkProject from '../components/WorkProject/WorkProject'
import ContactForm from '../components/ContactForm/ContactForm'
import { fetchIntro, fetchProjectIntro, fetchProjects, fetchFrameWorkButtons } from '../util/backendFetching'
import { useRouter } from 'next/router'
import parse, {Element, domToReact, HTMLReactParserOptions} from 'html-react-parser';

const Home: NextPage = () => {
  const router = useRouter()
  const { locale, locales } = router
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
  const socialWhiteButtons = [
    {href: "https://twitter.com/preiss_benjamin", bg: "bg-twitter-black"},
    {href: "https://github.com/benjaminpreiss", bg: "bg-github-black"},
    {href: "https://gitlab.com/benjaminpreiss", bg: "bg-gitlab-black"},
    {href: "https://bitbucket.org/benjmanable/", bg: "bg-bitbucket-black"},
  ]
  const frameWorkButtons = [
    {name: "figma", href: "https://www.figma.com/", bg: "bg-figma", width: "w-9", isIn: ["3dprima"]},
    {name: "adobe-xd", href: "https://www.adobe.com/products/xd.html", bg: "bg-adobe-xd", width: "w-9", isIn: ["kaleandme", "3dprima"]},
    {name: "adobe-illustrator", href: "https://www.adobe.com/products/illustrator.html", bg: "bg-adobe-illustrator", width: "w-9", isIn: ["kaleandme", "churchill", "3dprima", "susannepreiss"]},
    {name: "nextjs", href: "https://nextjs.org/", bg: "bg-nextjs", width: "w-9", isIn: ["kaleandme", "3dprima"]},
    {name: "formik", href: "https://formik.org/", bg: "bg-formik", width: "w-20", isIn: ["kaleandme", "3dprima"]},
    {name: "react-query", href: "https://react-query.tanstack.com/", bg: "bg-react-query", width: "w-28", isIn: ["kaleandme", "3dprima"]},
    {name: "docker", href: "https://www.docker.com/", bg: "bg-docker", width: "w-9", isIn: ["kaleandme", "3dprima"]},
    {name: "tailwindcss", href: "https://tailwindcss.com/", bg: "bg-tailwindcss", width: "w-28", isIn: ["kaleandme", "3dprima"]},
    {name: "xstate", href: "https://xstate.js.org/", bg: "bg-xstate", width: "w-20", isIn: ["3dprima"]},
    {name: "swiperjs", href: "https://swiperjs.com/", bg: "bg-swiper", width: "w-9", isIn: ["kaleandme", "3dprima"]},
    {name: "javascript", href: "https://javascript.info/", bg: "bg-javascript", width: "w-9", isIn: ["churchill", "susannepreiss"]},
    {name: "webpack", href: "https://webpack.js.org/", bg: "bg-webpack", width: "w-9", isIn: ["churchill", "susannepreiss"]},
    {name: "paperjs", href: "http://paperjs.org/", bg: "bg-paperjs", width: "w-9", isIn: ["churchill"]},
    {name: "sass", href: "https://sass-lang.com/", bg: "bg-sass", width: "w-9", isIn: ["churchill", "susannepreiss"]},
  ]
  return (
    <>
      <NavBar />
      <div className='flex flex-col md:flex-row md:justify-center items-center mt-12 md:mt-0 md:h-[80vh]'>
        <div className='w-full max-w-sm md:max-w-xs px-14'>
          <Image src="/profile-pic.png" alt="Picture of Benjamin Preiss" priority layout="responsive" width={477} height={595} placeholder="blur" blurDataURL='data:image/png;base64,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' />
        </div>
        <div className='flex flex-col items-center md:items-start'>
          <div className='cms-intro-section'>
            {parse(fetchIntro(locale))}
          </div>
          <div className='flex mt-8 space-x-5 px-10 md:mt-6'>
            {socialWhiteButtons.map((button, i) => {
              return (
                <Clickable key={i} type="anchor" href={button.href} color='white' target='_blank'>
                  <div className='w-9 h-9 p-1.5'>
                    <div className={`w-full h-full ${button.bg} bg-no-repeat bg-center bg-contain`}></div>
                  </div>
                </Clickable>
              )
            })}
          </div>
        </div>
      </div>
      <div className='flex flex-col w-full items-center space-y-6 py-40'>
        <div className='cms-project-intro-section'>
          {parse(fetchProjectIntro(locale))}
        </div>
        <div className='bg-thin-long-arrow-down bg-contain bg-no-repeat bg-center w-3 h-6'></div>
      </div>
      <div className='bg-ben-gray-1 w-full pt-36 overflow-hidden space-y-52 pb-4' id="work">
        {fetchProjects(locale).map((projectEntry, key) => {
          return (
            <WorkProject key={key} videoUrlMobile={projectEntry.videoUrlMobile} videoUrlMobileFb={projectEntry.videoUrlMobileFb} frameWorkButtons={fetchFrameWorkButtons(projectEntry.buttons)} videoUrl={projectEntry.videoUrl} videoUrlFb={projectEntry.videoUrlFb} color={projectEntry.colorClass} projectEntry={projectEntry} />
          )
        })}
      </div>
      <ContactForm />
      <Footer />
    </>
  )
}
export default Home