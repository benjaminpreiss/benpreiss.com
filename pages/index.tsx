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
          <Image src="/profile-pic.png" alt="Picture of Benjamin Preiss" priority layout="responsive" width={477} height={595} />
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
            <WorkProject key={key} videoUrlMobile={projectEntry.videoUrlMobile} frameWorkButtons={fetchFrameWorkButtons(projectEntry.buttons)} videoUrl={projectEntry.videoUrl} color={projectEntry.colorClass} projectEntry={projectEntry} />
          )
        })}
      </div>
      <ContactForm />
      <Footer />
    </>
  )
}
export default Home