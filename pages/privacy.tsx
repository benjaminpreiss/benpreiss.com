import type { NextPage } from 'next'
import Footer from '../components/Footer/Footer';
import NavBar from '../components/NavBar/NavBar';
import { fetchPrivacyPage } from '../util/backendFetching';
import { useRouter } from 'next/router';
import TextLink from '../components/TextLink/TextLink';
import parse, {Element, domToReact, HTMLReactParserOptions} from 'html-react-parser';

const Privacy: NextPage = () => {

    const router = useRouter()
    const { locale } = router
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
    return (
        <>
            <NavBar />
            <div className='cms-privacy-page '>
                {parse(fetchPrivacyPage(locale), parseOptions)}
            </div>
            <Footer />
        </>
    )  
}
export default Privacy;

