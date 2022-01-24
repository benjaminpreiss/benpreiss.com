import { string } from "yup/lib/locale"

type frameWorkButtonType = "figma" | "adobe-xd" | "adobe-illustrator" | "nextjs" | "formik" | "react-query" | "docker" | "tailwindcss" | "xstate" | "swiperjs" | "javascript" | "webpack" | "paperjs" | "sass" 

const frameWorkButtons: {name: frameWorkButtonType, href: string, bg: string, width: string}[] = [
    {name: "figma", href: "https://www.figma.com/", bg: "bg-figma", width: "w-9"},
    {name: "adobe-xd", href: "https://www.adobe.com/products/xd.html", bg: "bg-adobe-xd", width: "w-9"},
    {name: "adobe-illustrator", href: "https://www.adobe.com/products/illustrator.html", bg: "bg-adobe-illustrator", width: "w-9"},
    {name: "nextjs", href: "https://nextjs.org/", bg: "bg-nextjs", width: "w-9"},
    {name: "formik", href: "https://formik.org/", bg: "bg-formik", width: "w-20"},
    {name: "react-query", href: "https://react-query.tanstack.com/", bg: "bg-react-query", width: "w-28"},
    {name: "docker", href: "https://www.docker.com/", bg: "bg-docker", width: "w-9"},
    {name: "tailwindcss", href: "https://tailwindcss.com/", bg: "bg-tailwindcss", width: "w-28"},
    {name: "xstate", href: "https://xstate.js.org/", bg: "bg-xstate", width: "w-20"},
    {name: "swiperjs", href: "https://swiperjs.com/", bg: "bg-swiper", width: "w-9"},
    {name: "javascript", href: "https://javascript.info/", bg: "bg-javascript", width: "w-9"},
    {name: "webpack", href: "https://webpack.js.org/", bg: "bg-webpack", width: "w-9"},
    {name: "paperjs", href: "http://paperjs.org/", bg: "bg-paperjs", width: "w-9"},
    {name: "sass", href: "https://sass-lang.com/", bg: "bg-sass", width: "w-9"},
]

const intro: Record<string,string> = {
    en: `
        <p>Hey! I am <strong>Ben Preiss</strong>,</p>
        <p>a freelance webdeveloper<br/>and product designer passionate about 
            <em> open source</em>, 
            <em> privacy</em>,
            <br/>  
            <em> sustainability </em>and
            <em> web3</em>.
        </p>
    `,
    de: `
        <p>Hey! Ich bin <strong>Ben Preiss</strong>,</p>
        <p>ein freiberuflicher Webdeveloper<br/>und Product Designer mit einer Passion für
            <em> Open Source</em>, 
            <em> Privatsphäre</em>,
            <br/>  
            <em> Nachhaltigkeit </em>und das
            <em> Web3</em>.
        </p>
    `
}

const projectIntro: Record<string,string> = {
    en: `
        <p>scroll down to see a<br/><em>collection</em> of my <strong>work</strong></p>
    `,
    de: `
        <p>Eine <em>Sammlung</em> meiner <strong>Projekte</strong><br/>findest du hier.</p>
    `
}

type menuEntry = {
    message: string
    href: string
}

const menu: Record<string,menuEntry[]> = {
    en: [
        {message: "about.", href: "/#start"},
        {message: "work.", href: "/#work"},
        {message: "contact.", href: "/#contact"}
    ],
    de: [
        {message: "über mich.", href: "/#start"},
        {message: "projekte.", href: "/#work"},
        {message: "kontakt.", href: "/#contact"}
    ]
}

type projectEntry = {
    title: string
    projectLink: {
        href: string
        target: string
        text: string
    },
    videoUrl: string
    videoUrlMobile: string
    colorClass: string
    buttons: frameWorkButtonType[]
    text: string
}

const projects: Record<string,projectEntry[]> = {
    en: [
        {
            title: "kale and me", 
            projectLink: {
                href: "https://kaleandme-fastenprogramm.de/",
                target: "_blank",
                text: "juice cleanse app"
            },
            videoUrl: "/kale-and-me-desktop.webm",
            videoUrlMobile: "/kale-and-me-mobile.webm",
            colorClass: "#869B86",
            buttons: ["adobe-xd", "adobe-illustrator", "nextjs", "formik", "react-query", "docker", "tailwindcss", "swiperjs"],
            text: `
                <p>
                    Development of a progressive web app for juice company <a href="https://www.kaleandme.de/" target="_blank">kale and me</a>. Design by <a href="https://curilab.de/" target="_blank">curilab</a>.
                </p>
                <p>
                    The app is meant to accompany customers during their 14 day juice cleanse.
                </p>
                <p>
                    <em>Forms</em> with <a href="https://formik.org/" target="_blank">formik</a>, <em>query caching</em> with <a href="https://react-query.tanstack.com/" target="_blank">react-query</a> and <em>mobile-swipe</em> compatibility with <a href="https://swiperjs.com/" target="_blank">swiper.js</a>.
                </p>
            `
        },
        {
            title: "churchill", 
            projectLink: {
                href: "https://drinkchurchill.com/",
                target: "_blank",
                text: "website"
            },
            videoUrl: "/churchill-desktop.webm",
            videoUrlMobile: "/churchill-mobile.webm",
            colorClass: "#efefef",
            buttons: ["adobe-illustrator", "javascript", "webpack", "paperjs", "sass"],
            text: `
            <p>
                <em>Design</em> and <em>development</em> for <a href="https://drinkchurchill.com/" target="_blank">Churchill</a>, an environmentally friendly recovery soda. 
            </p>
            <p>
                <em>Dynamically colored</em> background on HTML <em>canvas element</em> utilizing <a href="http://paperjs.org/" target="_blank">paper.js</a>.
            </p>
            `
        },
        {
            title: "3d prima", 
            projectLink: {
                href: "https://3dprima.plusquam.site/",
                target: "_blank",
                text: "compare app"
            },
            videoUrl: "/kale-and-me-desktop.webm",
            videoUrlMobile: "/kale-and-me-mobile.webm",
            colorClass: "#E6EAEE",
            buttons: ["figma", "adobe-xd", "adobe-illustrator", "nextjs", "formik", "react-query", "docker", "tailwindcss", "xstate", "swiperjs"],
            text: `
            <p>
                <em>Design</em> and <em>development</em> of a progressive web app for <a href="https://www.3dprima.com/" target="_blank">3D Prima</a>, a <em>3D printer retail company</em>. 
            </p>
            <p>
                The app is meant to help customers <em>compare 3D printers</em> based on a <em>vast number of criteria</em>.
            </p>
            <p>
                <em>Forms</em> with <a href="https://formik.org/" target="_blank">formik</a>, <em>query caching</em> with <a href="https://react-query.tanstack.com/" target="_blank">react-query</a>, <em>mobile-swipe</em> compatibility with <a href="https://swiperjs.com/" target="_blank">swiper.js</a> and <em>state management</em> with <a href="https://xstate.js.org/" target="_blank">xstate</a>.
            </p>
            `
        },
        {
            title: "susanne preiss", 
            projectLink: {
                href: "https://susanne-preiss.de/",
                target: "_blank",
                text: "website"
            },
            videoUrl: "/susanne-preiss-desktop.webm",
            videoUrlMobile: "/susanne-preiss-mobile.webm",
            colorClass: "#EFEAE3",
            buttons: ["adobe-illustrator", "javascript", "webpack", "sass"],
            text: `
            <p>
                <em>Website</em> for <a href="https://susanne-preiss.de/" target="_blank">Susanne Preiss</a>. <em>Design</em> by <a href="http://baxmann.net/" target="_blank">Andre Baxmann</a>.
            </p>
            <p>
                Written in <em>plain HTML</em> and <em>JavaScript</em> utilizing a <em>custom webpack</em> configuration.
            </p>
            `
        }
    ],
    de: [
        {
            title: "kale and me", 
            projectLink: {
                href: "https://kaleandme-fastenprogramm.de/",
                target: "_blank",
                text: "Fastenapp"
            },
            videoUrl: "/kale-and-me-desktop.webm",
            videoUrlMobile: "/kale-and-me-mobile.webm",
            colorClass: "bg-ben-green-1",
            buttons: ["adobe-xd", "adobe-illustrator", "nextjs", "formik", "react-query", "docker", "tailwindcss", "swiperjs"],
            text: `
                <p>
                    Entwicklung einer progressiven web app für <a href="https://www.kaleandme.de/" target="_blank">kale and me</a>. Design von <a href="https://curilab.de/" target="_blank">curilab</a>.
                </p>
                <p>
                    Die App begleitet Kunden während ihres 14 tägigen Fastenprogramms.
                </p>
                <p>
                    <em>Formulare</em> mit <a href="https://formik.org/" target="_blank">formik</a>, <em>query caching</em> mit <a href="https://react-query.tanstack.com/" target="_blank">react-query</a> und <em>mobile-swipe-kompabilität</em> mit <a href="https://swiperjs.com/" target="_blank">swiper.js</a>.
                </p>
            `
        },
        {
            title: "churchill", 
            projectLink: {
                href: "https://drinkchurchill.com/",
                target: "_blank",
                text: "Website"
            },
            videoUrl: "/churchill-desktop.webm",
            videoUrlMobile: "/churchill-mobile.webm",
            colorClass: "bg-ben-gray-3",
            buttons: ["adobe-illustrator", "javascript", "webpack", "paperjs", "sass"],
            text: `
            <p>
                <em>Design</em> und <em>Entwicklung</em> für <a href="https://drinkchurchill.com/" target="_blank">Churchill</a>, ein nachhaltiges Recovery-Soda. 
            </p>
            <p>
                <em>Dynamisch farbige</em> Hintergrundanimationen in HTML <em>Canvas Elementen</em> mit <a href="http://paperjs.org/" target="_blank">paper.js</a>.
            </p>
            `
        },
        {
            title: "3d prima", 
            projectLink: {
                href: "https://3dprima.plusquam.site/",
                target: "_blank",
                text: "Vergleichs-App"
            },
            videoUrl: "/kale-and-me-desktop.webm",
            videoUrlMobile: "/kale-and-me-mobile.webm",
            colorClass: "bg-ben-bluegray-1",
            buttons: ["figma", "adobe-xd", "adobe-illustrator", "nextjs", "formik", "react-query", "docker", "tailwindcss", "xstate", "swiperjs"],
            text: `
            <p>
                <em>Design</em> und <em>Entwicklung</em> einer progressiveb web app für <a href="https://www.3dprima.com/" target="_blank">3D Prima</a>, ein <em>3D Drucker Online Händler</em>. 
            </p>
            <p>
                Die App soll künftig Kunden helfen, <em>3D Drucker</em> anhand <em>vieler Kriterien</em> zu vergleichen.
            </p>
            <p>
                <em>Formulare</em> mit <a href="https://formik.org/" target="_blank">formik</a>, <em>query caching</em> mit <a href="https://react-query.tanstack.com/" target="_blank">react-query</a>, <em>mobile-swipe-kompabilität</em> mit <a href="https://swiperjs.com/" target="_blank">swiper.js</a> und <em>State Management</em> mit <a href="https://xstate.js.org/" target="_blank">xstate</a>.
            </p>
            `
        },
        {
            title: "susanne preiss", 
            projectLink: {
                href: "https://susanne-preiss.de/",
                target: "_blank",
                text: "Website"
            },
            videoUrl: "/susanne-preiss-desktop.webm",
            videoUrlMobile: "/susanne-preiss-mobile.webm",
            colorClass: "bg-ben-beige-1",
            buttons: ["adobe-illustrator", "javascript", "webpack", "sass"],
            text: `
            <p>
                <em>Website</em> für <a href="https://susanne-preiss.de/" target="_blank">Susanne Preiss</a>. <em>Design</em> von <a href="http://baxmann.net/" target="_blank">Andre Baxmann</a>.
            </p>
            <p>
                Geschrieben in <em>HTML</em> und <em>JavaScript</em>, unterstützt durch eine <em>benutzerdefinierte webpack</em> Konfiguration.
            </p>
            `
        }
    ]
}

type contactForm = {
    title: string
    description: string
    phoneTitle: string
    phoneField: {
        copyHint: string
        copiedText: string
    }
    emailTitle: string
    nameField: {
        validation: {
            matchRegExError: string
            maxLengthError: string
            requiredError: string
        }
        placeholder: string
        label: string
    }
    emailField: {
        validation: {
            validEmailError: string
            requiredError: string
        }
        placeholder: string
        label: string
    }
    messageField: {
        validation: {
            maxLengthError: string
            requiredError: string
        }
        placeholder: string
        label: string
    }
    privacyLink: string
    footNote: string
    submitButtonText: string
    submitButtonErrorText: string
    submitButtonSuccessText: string
}

type footer = {
    social: {
        title: string
    }
    privacy: {
        title: string
        linkText: string
    }
    imprint: {
        title: string
        content: {title: string, html: string}[]
    }
}

const contactForm: Record<string,contactForm> = {
    en: {
        title: "get in touch",
        description: "Let’s have a chat! You can either call me or write me a message below.",
        phoneTitle: "Phone",
        phoneField: {
            copyHint: "click to copy",
            copiedText: "... copied"
        },
        emailTitle: "E-Mail",
        nameField: {
            validation: {
                matchRegExError: "Please enter valid name",
                maxLengthError: "Name must be at most 40 characters",
                requiredError: "Required"
            },
            placeholder: "Name",
            label: "Name"
        },
        emailField: {
            validation: {
                validEmailError: "Please enter a valid mail address",
                requiredError: "Required"
            },
            placeholder: "E-Mail",
            label: "E-Mail"
        },
        messageField: {
            validation: {
                maxLengthError: "Message must be at most 500 characters",
                requiredError: "Required"
            },
            placeholder: "Your Message",
            label: "Your Message"
        },
        privacyLink: "privacy policy",
        footNote: "This is not a newsletter sign up form. ",
        submitButtonText: "Submit",
        submitButtonErrorText: "Error. Try again later please!",
        submitButtonSuccessText: "Successfully sent email"
    },
    de: {
        title: "Kontakt",
        description: "Du hast eine spannende Idee oder brauchst Hilfe bei einem Projekt? Schreib mir unten eine Nachricht oder ruf mich an!",
        phoneTitle: "Telefon",
        phoneField: {
            copyHint: "Clicken zum kopieren",
            copiedText: "... Kopiert"
        },
        emailTitle: "E-Mail",
        nameField: {
            validation: {
                matchRegExError: "Bitte gib einen gültigen Namen ein",
                maxLengthError: "Der Name sollte maximal 40 Zeichen enthalten",
                requiredError: "Erforderlich"
            },
            placeholder: "Name",
            label: "Name"
        },
        emailField: {
            validation: {
                validEmailError: "Bitte gib eine gültige E-Mail-Adresse ein",
                requiredError: "Erforderlich"
            },
            placeholder: "E-Mail",
            label: "E-Mail"
        },
        messageField: {
            validation: {
                maxLengthError: "Die Nachricht darf maximal 500 Zeichen lang sein",
                requiredError: "Erforderlich"
            },
            placeholder: "Deine Nachricht",
            label: "Deine Nachricht"
        },
        privacyLink: "Datenschutzerklärung",
        footNote: "Dies ist kein Formular zur Newsletter Registrierung. ",
        submitButtonText: "Abschicken",
        submitButtonErrorText: "Fehler. Bitte probiere es später erneut!",
        submitButtonSuccessText: "Mail erfolgreich verschickt!"
    }
}

const footer: Record<string,footer> = {
    en: {
        social: {
            title: "social media"
        },
        privacy: {
            title: "privacy",
            linkText: "link to privacy policy"
        },
        imprint: {
            title: "imprint",
            content: [
                {
                    title: "website operator",
                    html: `
                        <p>Benjamin Preiss</p>
                    `
                }, {
                    title: "Information about the Company",
                    html: `
                        <p>Sole proprietorship</p>
                        <p>Strandweg 98a,<br/>DE - Hamburg , 22587</p>
                        <p>benjamin@benpreiss.com<br/>+49 160 705 97 12</p>
                    `
                }, {
                    title: "Information about the Company registration",
                    html: `
                        <p>DE328197327</p>
                    `
                }
            ]
        }
    },
    de: {
        social: {
            title: "Soziale Medien"
        },
        privacy: {
            title: "Datenschutzerklärung",
            linkText: "Link zur Datenschutzerklärung"
        },
        imprint: {
            title: "Impressum",
            content: [
                {
                    title: "Website Betreiber",
                    html: `
                        <p>Benjamin Preiss</p>
                    `
                }, {
                    title: "Informationen zur Firma",
                    html: `
                        <p>Einzelunternehmung</p>
                        <p>Strandweg 98a,<br/>DE - Hamburg , 22587</p>
                        <p>benjamin@benpreiss.com<br/>+49 160 705 97 12</p>
                    `
                }, {
                    title: "Informationen zur Firmenregistrierung",
                    html: `
                        <p>DE328197327</p>
                    `
                }
            ]
        }
    }
}

const privacy: Record<string,string> = {
    en: `
        <h1 id="dse_structure_ueberschrift">Privacy declaration</h1>
<h2 id="dse_verantwortlicher">Responsible Authority</h2>
<p>We are happy about you visiting our website. We would like to introduce you to the responsible authority in terms of data protection law as applicable:<br/><br/>Benjamin Preiss<br/>Strandweg 98a<br/>22587 Hamburg<br/>Phone: +49 160 705 97 12<br/>E-mail: benjamin@benpreiss.com</p>
<h2 id="dse_allgemein096">General Information</h2>
<p>Pursuant to our statutory obligations, we would like to inform you about the collection and use of your personal data.<br/><br/>When you use our website, personal data about you will be collected. This may happen by you entering the data yourself, for example your e-mail address. But our system also collects your data automatically, for example whenever you visit our website. This happens irrespective of the device or the software that you use to visit our website.<br/><br/>All data that you enter in our app is provided voluntarily; there are no disadvantages to you if you do not provide data. But without certain data, we are unable to provide services or to conclude contracts. Whenever such information is necessary, we will point it out to you.<br/><br/>On this website, the user’s personal data is only collected within the framework of the existing data-protection law, in particular the General Data Protection Regulation (GDPR). The legal terms used in the text are defined in Art. 4 of the GDPR.<br/><br/>The GDPR allows data processing in three cases in particular:</p><ul>    <li>in accordance with Art. 6 para. 1 (a) and 7 GDPR, when you have consented to us processing your data; in this Privacy Policy and in the cases of consent pursuant to Art. 4 no. 11 GDPR, we will inform you in detail and each time for what purposes and under what circumstances  your data will be processed by us;</li> <li>in accordance with Art. 6 para. 1 (b) GDPR, when processing your personal data is necessary for negotiating, concluding or performing a contract;</li> <li>in accordance with Art. 6 para. 1 (f) GDPR, if the balancing of interests leads to the conclusion that the processing is necessary to protect our legitimate interests; this means in particular our interests to analyse, optimise and secure the offers on our website – meaning primarily the analysis of user behaviour, setting up profiles for advertisement purposes and storage of access data as well as the use of third-party providers.</li> </ul>
<h3 id="dse_allgemein096_bestand">Inventory Data</h3>
<p>We collect inventory data as far as it is necessary to establish, negotiate or amend a contract (including one without remuneration) between us and the user. This can be: customer data (for example name, address), contact data (for example e-mail address, phone number), service data (for example services ordered, duration, payment). Upon establishing the user relationship, we will ask you for this data (for example name, address and e-mail address) and will also tell you which of the information is required to establish the user relationship.</p>
<h3 id="dse_allgemein096_nutzung">Usage Data</h3>
<p>We also collect usage data to allow users to use the services on our website. These may consist of: usage information (for example visited websites or parts, duration of visit, interest in services), content data (for example data, text, images, sounds, videos entered or uploaded by you), meta data (for example identity of your device, location, IP address).<br/><br/>We will only combine usage data if and insofar as it is necessary for billing purposes. Otherwise, we will only put together usage data pseudonymously and only insofar as you have not objected. You may send this objection to the address indicated in the “About Us” section or the responsible authority indicated in this Privacy Policy at any time.<br/><br/>The legal basis for this data processing are our legitimate interests pursuant to Art. 6 para. 1 (f) GDPR in analysing the website and your use, possibly also the statutory permission to store data as part of the negotiation of a contract pursuant to Art. 6 para. 1 (b) GDPR.<br/></p>
<h2 id="dse_hoster">Hoster</h2>
<h3 id="dse_hoster_hosterandere">Windcloud 4.0 GmbH</h3>
<p>Our Website is presented in the Internet by a service provider. We use the service Windcloud 4.0 GmbH, Lecker Straße 7, 25917 Enge-Sande, Deutschland. We have concluded a data processing agreement with our provider. With this contract, our provider is obliged to process the data according to our instructions. You can find more information on data processing at our provider in his privacy policy at <a href="https://windcloud.de/datenschutzerklaerung" target="_blank" rel="noopener noreferrer">https://windcloud.de/datenschutzerklaerung<span className="linkext"></span></a>. The legal basis for this data processing is on the one hand our legitimate interest in a technologically perfect online offering and its design and optimization in an economically efficient manner pursuant to Art. 6 para. 1 (f) GDPR, and, on the other hand, our contractual or pre-contractual legal relationship in accordance with Art. 6 para. 1 (b) GDPR.<br/><br/>Furthermore, our provider stores information, the so-called server log files, each time the website is used; this is information which is automatically transferred by your browser. In detail, this data consists of:</p><ul><li>your IP address</li><li>type and version of your browser</li><li>host name</li><li>time of visit</li><li>the page from which you came to our page</li><li>name of the page opened</li><li>exact time of usage as well as</li><li>the amount of data transferred</li></ul><p>This data will only be used for statistical purposes and do not allow us to identify you as a user.</p>
<h2 id="dse_erstkontakt">First Contact through Electronic Request</h2>
<p>If you contact us in electronic form (for example by mail, fax, phone, messenger, etc.), we store and process the data which you have given us (for example name, contact information, content of the request). This is based on our legitimate interest in an effective communication with customers in accordance with Article 6 para. 1 (a) GDPR and, as far as it concerns a request to enter into or to perform a contract, also with Article 6 para. 1 (b) GDPR.<br/>We will only pass on this data to third parties as far as required for the performance of the contract (in accordance with Article 6 para. 1 (b) GDPR), by the overwhelming interest in effective services (in accordance with Article 6 para. 1 (f) GDPR) or based on your consent (in accordance with Article 6 para. 1 (a) GDPR) or if there is another legal permission or obligation.<br/>You may ask us at any time and without any cost to provide information about the purpose of the processing, the origin and the recipient, if any, of your data. You may also request that we correct, delete or limit the processing of your personal data. You may object against the (further) processing of your data at any time and you have a right for the data to be made transferable as well as the right to file a complaint with the competent supervisory agency.<br/>In general, your data will only remain stored as long as required by the purpose of the respective data processing. A longer storage is an option, in particular when required in order to pursue our rights, for other legitimate interests of ours or when there is a statutory duty to keep the data longer (for example record-keeping under tax law, statute of limitations).</p>
<h2 id="dse_einwilligung">Consent</h2>
<p>Whenever we ask you for your consent for the processing of your data, we will inform you in clear language and in an easily accessible way about the cases for which you will be granting your consent. Any consent that we ask you for is voluntary. Any advantage that you wish to gain by granting consent is also available without consent; simply ask us.<br/><br/>Regarding any consent, you have the right to revoke any consent given to us for the processing of your personal data at any time. You just need to contact us without any particular formal requirement, for example through our contact form, an e-mail to the e-mail address indicated in the “About Us” section or a link to unsubscribe (if offered by us). Your withdrawal has no effect on the legality of the data processing carried out up to that point.</p>
<h2 id="dse_speicherdauer">Storage Period</h2>
<p>Generally, your data will only remain stored as long as required by the purpose of the respective data processing. Storage beyond that is possible in particular if it is still required for pursuing our rights or for other legitimate interests of ours.<br/>For your inventory data which were necessary to perform a contract (including one without remuneration), this means that we store this data until the complete performance or termination of the contractual relationship plus the limitation period (which is generally 2 or 3 years) plus an adequate extra time for potential interruptions of the limitation period.<br/>For your usage data which was collected in the course of your use of the website, this means that we will store it only for the time still required for the proper functionality of our website and as long as we still have a legitimate interest. Statistical information will be primarily stored by us in pseudonymous form.<br/>Beyond that, we still store your data for as long as we are required to do so by law. This concerns in particular the tax-law requirements to keep records, usually for 6 or even 10 years.</p>
<h2 id="dse_nutzerrechte">Users‘ Rights</h2>
<p>You may request us anytime to provide information about the personal data stored about you free of charge. To avoid misuse, this will require personal identification.</p>
<h3 id="dse_nutzerrechte_loeschung">Deletion, Correction, Limitation</h3>
<p>You may at any time demand from us that we correct (or complete) incorrect data as well as a limitation of the processing of data or deletion of your data. This applies in particular if the reason for processing the data is no longer valid, if a required consent has been revoked and there is no other legal basis or if our data processing is unlawful. We will then correct, block or even delete your personal data without delay as far as permitted by law.</p>
<h3 id="dse_nutzerrechte_widerspruch">Objection</h3>
<p>The right to object to advertisement is governed by our text regarding consent:<br/></p><div data-src="easy">Regarding any consent, you have the right to revoke any consent given to us for the processing of your personal data at any time. You just need to contact us without any particular formal requirement, for example through our contact form, an e-mail to the e-mail address indicated in the “About Us” section or a link to unsubscribe (if offered by us). Your withdrawal has no effect on the legality of the data processing carried out up to that point.</div><p></p>
<h3 id="dse_nutzerrechte_datenuebertragung">Data Transfer</h3>
<p>You may request us to transfer the data stored about you in machine-readable form.</p>
<h3 id="dse_nutzerrechte_beschwerde">Complaint</h3>
<p>If you feel that our data processing has violated any of your rights, you may file a complaint with the competent regulatory agency (<a href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html" target="_blank" rel="noopener noreferrer">here<span className="linkext"></span></a> you find a list of the agencies).</p>
<h2 id="dse_aenderungdse">Changes to the Privacy Policy</h2>
<p>If and when factual or legal reasons will compel us to amend the Privacy Policy, we will update this page accordingly. This will not change the consent provided by the user.</p>
<h2 id="dse_dateneingaben">Data Entry</h2>
<h3 id="dse_dateneingaben_verschluesselung">Encryption of Data Entry</h3>
<p>When you enter data on our website, whether in a contact form, during the registration process, when you log in or for payment purposes, the website, where you enter the data, is encrypted. Thus, third parties can not read what you enter. You will recognise the encryption by the lock symbol in your browser and by the URL beginning with “https“ instead of “http“.</p>
<h3 id="dse_dateneingaben_kontaktform">Contact Forms</h3>
<p>When you fill out a contact form or when you send us an e-mail or another electronic message, your information will be stored for the processing of the request, for possible follow-up questions or for other related questions and will only be used to follow up with the request.<br/><br/>Your data will be transferred in an encrypted manner, preventing third parties from reading your data while it is being entered.<br/><br/>Basis for this storage is the safeguarding of our legitimate interests in regard to communication with interested users pursuant to Art. 6 para. 1 (f) GDPR and in the case of inquiries prior to entering into a contract also the performance of a contract pursuant to Art. 6 para (b) GDPR.<br/><br/>Your data remains stored for as long as the processing of the request requires, in particular as long as the storage is still necessary to perform the contract, to pursue our rights or for our other legitimate interests or we are compelled by law to keep your data stored (for example based on tax-law requirements to maintain files).</p><p><br/>Built with <a href="https://easyrechtssicher.de/komplett-schutz/" target="_blank" rel="noopener noreferrer">Datenschutz Generator<span className="linkext"></span></a> of <a href="https://easyrechtssicher.de/" target="_blank" rel="noopener noreferrer">https://easyrechtssicher.de<span className="linkext"></span></a></p><p><br/>This is our current valid privacy policy from 02.01.2022</p>
        `,
    de: `
        <h1 id="dse_structure_ueberschrift">Datenschutzerklärung</h1>
<h2 id="dse_verantwortlicher">Verantwortliche Stelle</h2>
<p>Wir freuen uns über Ihren Besuch auf unserer Website. Zunächst möchten wir uns Ihnen als verantwortliche Stelle im Sinne des Datenschutzrechts vorstellen:<br/><br/>Benjamin Preiss<br/>Strandweg 98a<br/>22587 Hamburg<br/>Telefon: +49 160 705 97 12<br/>E-Mail: benjamin@benpreiss.com</p>
<h2 id="dse_allgemein096">Allgemeines</h2>
<p>Wir möchten Sie in Übereinstimmung mit unserer gesetzlichen Verpflichtung über die Erhebung und Verwendung Ihrer personenbezogenen Daten informieren.<br/><br/>Wenn Sie unsere Website nutzen, werden personenbezogene Daten über Sie erfasst. Dies kann dadurch erfolgen, dass Sie die Daten eigenständig eingeben – wie z.B. Ihre Mailadresse. Unser System erfasst Daten von Ihnen aber auch automatisch, wie etwa Ihren Besuch auf unserer Website. Dies erfolgt unabhängig davon, mit welchem Gerät oder mit welcher Software Sie unsere Website nutzen.<br/> <br/>Jegliche Eingabe von Daten durch Sie auf unserer Website ist freiwillig, es treten durch die Nichtpreisgabe Ihrer Daten für Sie keine Nachteile ein. Ohne bestimmte Daten ist es uns aber nicht möglich, Leistungen zu erbringen oder Verträge zu schließen. Auf derartige Pflichtangaben werden wir Sie jeweils hinweisen.<br/> <br/>Auf dieser Webseite werden personenbezogene Daten des Nutzers nur im Rahmen des geltenden Datenschutzrechts, insbesondere der Datenschutzgrundverordnung (DSGVO), erhoben. Die in dem Text verwendeten Fachbegriffe werden in Art. 4 der DSGVO näher erläutert. <br/> <br/> Eine Datenverarbeitung ist nach der DSGVO insbesondere in drei Fällen erlaubt: <br/> </p><ul>    <li>nach Art. 6 Abs. 1 lit. a und 7 DSGVO, wenn Sie in die Datenverarbeitung durch uns eingewilligt haben; jeweils werden wir Sie vorher in dieser Datenschutzerklärung und anlässlich der Einwilligung nach Maßgabe von Art. 4 Nr. 11 DSGVO genau unterrichten, wozu und unter welchen Umständen Ihre Daten von uns verarbeitet werden;</li>    <li>nach Art. 6 Abs. 1 lit. b DSGVO, wenn die Verarbeitung Ihrer personenbezogenen Daten für die Anbahnung, den Abschluss oder die Abwicklung eines Vertragsverhältnisses erforderlich ist;</li>    <li>nach Art. 6 Abs. 1 lit. f DSGVO, wenn nach einer Interessenabwägung die Verarbeitung zur Wahrung unserer berechtigten Interessen erforderlich ist; dazu gehören insbesondere unsere Interessen, das Angebot auf unserer Website zu analysieren, zu optimieren und abzusichern – darunter fallen vor allem eine Analyse des Nutzerverhaltens, die Erstellung von Profilen für Werbezwecke und die Speicherung von Zugriffsdaten sowie der Einsatz von dritten Anbietern.</li> </ul><p></p>
<h3 id="dse_allgemein096_bestand">Bestandsdaten</h3>
<p>Wir erheben Bestandsdaten, soweit sie für die Begründung, inhaltliche Ausgestaltung oder Änderung eines (auch unentgeltlichen) Vertragsverhältnisses zwischen uns und dem Nutzer erforderlich sind. Dazu können gehören: Kundendaten (z. B. Name, Adresse), Kontaktdaten (z. B. E-Mail-Adresse, Telefonnummer), Leistungsdaten (z.B. bestellte Leistung, Laufzeit, Entgelt). Bei der Begründung des Nutzungsverhältnisses werden wir diese Daten von Ihnen abfragen (z. B. Name, Anschrift und E-Mail-Adresse) und Ihnen auch mitteilen, inwieweit die Angabe jeweils verbindlich erforderlich ist, um das Nutzungsverhältnis zu begründen.</p>
<h3 id="dse_allgemein096_nutzung">Nutzungsdaten</h3>
<p>Weiter erheben wir Nutzungsdaten, um die Inanspruchnahme der Dienste auf unserer Website durch den Nutzer zu ermöglichen. Dazu können gehören: Nutzungsangaben (z. B. aufgerufene Webseiten oder Bereiche, Besuchsdauer, Interesse an Leistungen), Inhaltsdaten (z. B. von Ihnen eingegebene oder hochgeladene Daten, Texte, Bilder, Töne, Videos), Metadaten (z. B. Identität Ihres Gerätes, Standort, IP-Adresse).<br/><br/>Eine Zusammenführung von Nutzungsdaten wird von uns nur vorgenommen, sofern und soweit dies für Abrechnungszwecke erforderlich ist. Ansonsten werden wir Nutzungsdaten nur pseudonym erstellen und nur, soweit Sie dem nicht widersprochen haben. Diesen Widerspruch können Sie jederzeit an die in dem Impressum angegebene Anschrift oder den in dieser Datenschutzerklärung genannten Verantwortlichen senden.<br/><br/>Rechtsgrundlage für diese Datenverarbeitung sind zum einen unsere berechtigten Interessen gem. Art. 6 Abs. 1 lit. f DSGVO an der Analyse der Website und ihrer Nutzung, gegebenenfalls auch die gesetzliche Erlaubnis zur Speicherung von Daten im Rahmen der Anbahnung eines Vertragsverhältnisses gem. Art. 6 Abs. 1 lit. b DSGVO.<br/></p>
<h2 id="dse_hoster">Hoster</h2>
<h3 id="dse_hoster_hosterandere">Windcloud 4.0 GmbH</h3>
<p>Unsere Website wird im Internet von einem Dienstleister (Provider oder Hoster) zum Abruf bereitgestellt. Wir nutzen hierfür den Dienst von Windcloud 4.0 GmbH, Lecker Straße 7, 25917 Enge-Sande, Deutschland. Wir haben mit unserem Provider einen Auftragsverarbeitungsvertrag abgeschlossen. Danach ist unser Provider verpflichtet, Ihre Daten nur in unserem Auftrag und nach unserer Weisung zu verarbeiten. Weitergehende Informationen zu der Datenverarbeitung bei unserem Provider finden Sie in dessen Datenschutzerklärung unter <a href="https://windcloud.de/datenschutzerklaerung" target="_blank" rel="noopener noreferrer">https://windcloud.de/datenschutzerklaerung<span className="linkext"></span></a>. Rechtsgrundlage für diese Datenverarbeitung sind zum einen unsere berechtigten Interessen gem. Art. 6 Abs. 1 lit. f DSGVO an der Bereitstellung und Nutzung unserer Website im Internet sowie soweit einschlägig auch die gesetzliche Erlaubnis zur Speicherung von Daten im Rahmen der Anbahnung eines Vertragsverhältnisses gem. Art. 6 Abs. 1 lit. b DSGVO.<br/><br/>Unser Provider verarbeitet bei jeder Nutzung dieser Website Informationen, die sog. Server Log Dateien, die automatisch bei jedem Aufruf von Websites im Internet von Ihrem Browser übermittelt werden. Dies sind:</p><ul><li>Ihre IP-Adresse</li><li>Typ und Version Ihres Browsers</li><li>Hostname</li><li>Besuchszeitpunkt</li><li>die Website, von der aus Sie unsere Website besucht haben</li><li>Name der aufgerufenen Website</li><li>genauer Zeitpunkt des Aufrufes sowie</li><li>die übertragene Datenmenge</li></ul><p>Diese Daten werden nur für statistische Zwecke verwendet und ermöglichen uns keine Identifikation von Ihnen als Nutzer.</p>
<h2 id="dse_erstkontakt">Erstkontakt durch elektronische Anfrage</h2>
<p>Kontaktieren Sie uns in elektronischer Form (z. B. E-Mail, Fax, Telefon, Messenger, etc.), speichern und verarbeiten wir die Daten, die Sie uns bekannt gegeben haben (z. B. Name, Kontaktinformationen, Inhalt der Anfrage). Rechtsgrundlage dafür ist unser berechtigtes Interesse an effektiver Kundenkommunikation gem. Art. 6 Abs. 1 lit. a DSGVO und, soweit es um eine Anfrage zur Eingehung oder Erfüllung eines Vertrages geht, auch Art. 6 Abs. 1 lit. b DSGVO.<br/>Diese Daten werden wir an Dritte nur weitergeben, soweit es (nach Art. 6 Abs. 1 lit. b DSGVO) für die Erfüllung des Vertrages erforderlich ist, dies dem überwiegenden Interesse an einer effektiven Leistung (gem. Art. 6 Abs. 1 lit. f DSGVO) entspricht oder Ihre Einwilligung (nach Art. 6 Abs. 1 lit. a DSGVO) oder eine sonstige gesetzliche Erlaubnis oder Pflicht vorliegt. <br/>Sie können von uns jederzeit unentgeltlich Auskunft über Zweck der Verarbeitung, Herkunft und ggf. Empfänger Ihrer personenbezogenen Daten verlangen. Weiter können Sie die Berichtigung, die Löschung und die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten geltend machen. Sie können jederzeit Widerspruch gegen die (weitere) Verarbeitung Ihrer Daten erheben und haben ein Recht auf Datenübertragbarkeit sowie ein Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde. <br/>Ihre Daten bleiben grundsätzlich nur so lange gespeichert, wie es der Zweck der jeweiligen Datenverarbeitung erfordert. Eine weitergehende Speicherung kommt vor allem in Betracht, wenn dies zur Rechtsverfolgung oder aus berechtigten Interessen noch erforderlich ist oder eine gesetzliche Pflicht besteht, die Daten noch aufzubewahren (z. B. steuerliche Aufbewahrungsfristen, Verjährungsfrist).</p>
<h2 id="dse_einwilligung">Einwilligung</h2>
<p>Soweit wir Sie um Ihre Einwilligung bitten, Ihre Daten zu verarbeiten, werden wir Sie in klarer Sprache und leicht zugänglich darüber informieren, für welche Fälle Sie Ihre Einwilligung erteilen. Jede von uns erbetene Einwilligung ist freiwillig, jeden Vorteil, den Sie durch die Erteilung einer Einwilligung erlangen möchten, können Sie auch ohne die Einwilligung bekommen, fragen Sie uns einfach. <br/><br/>Für jede Einwilligung gilt, dass Sie das Recht haben, jederzeit eine uns erteilte Einwilligung zur Verarbeitung Ihrer personenbezogenen Daten zu widerrufen. Dies kann durch eine formlose Mitteilung erfolgen, z. B. über unser Kontaktformular, eine E-Mail an die im Impressum angegebene E-Mail-Adresse oder einen Abmeldelink (soweit von uns angeboten). Ihr Widerruf berührt die Rechtmäßigkeit der bis dahin vorgenommenen Datenverarbeitung nicht.</p>
<h2 id="dse_speicherdauer">Speicherdauer</h2>
<p>Ihre Daten bleiben grundsätzlich nur so lange gespeichert, wie es der Zweck der jeweiligen Datenverarbeitung erfordert. Eine weitergehende Speicherung kommt vor allem in Betracht, wenn dies zur Rechtsverfolgung durch uns oder aus unseren sonstigen berechtigten Interessen noch erforderlich ist. <br/>Für Ihre Bestandsdaten, die zur Erfüllung eines (auch unentgeltlichen) Vertragsverhältnisses erforderlich waren, bedeutet das, dass wir diese bis zur vollständigen Erfüllung oder Beendigung des Vertragsverhältnisses zuzüglich der Verjährungsfrist (die generell 2 oder 3 Jahre beträgt) nebst einem angemessenen Aufschlag für eine eventuelle Unterbrechung der Verjährung speichern.<br/>Für Ihre Nutzungsdaten, die anlässlich Ihrer Nutzung der Website erfasst wurden, bedeutet das, dass wir diese nur so lange speichern, wie dies für die ordnungsgemäße Funktion unserer Website noch erforderlich ist und unser berechtigtes Interesse reicht. Statistische Angaben werden wir in erster Linie nur pseudonymisiert speichern.<br/>Darüber hinaus speichern wir Ihre Daten noch, soweit wir dazu gesetzlich verpflichtet sind. Das sind insbesondere die steuerlichen Aufbewahrungsfristen, die grundsätzlich 6 oder gar 10 Jahre betragen.</p>
<h2 id="dse_nutzerrechte">Rechte der Nutzer</h2>
<p>Sie können von uns jederzeit kostenfrei Auskunft über die von uns über Sie gespeicherten personenbezogenen Daten verlangen. Hierbei wird zur Verhinderung von Missbrauch eine Identifikation Ihrer Person erforderlich.</p>
<h3 id="dse_nutzerrechte_loeschung">Löschung, Berichtigung, Einschränkung</h3>
<p>Sie können von uns jederzeit Berichtigung (auch durch Ergänzung) unrichtiger Daten verlangen sowie eine Einschränkung ihrer Verarbeitung oder auch die Löschung Ihrer Daten. Dies gilt insbesondere, wenn der Verarbeitungszweck erloschen ist, eine erforderliche Einwilligung widerrufen wurde und keine andere Rechtsgrundlage vorliegt oder unsere Datenverarbeitung unrechtmäßig ist. Wir werden Ihre personenbezogenen Daten dann im gesetzlichen Rahmen unverzüglich berichtigen, sperren oder gar löschen.</p>
<h3 id="dse_nutzerrechte_widerspruch">Widerspruch</h3>
<p></p><div data-src="easy">JEDER VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN, DIE WIR AUF EINE ABWÄGUNG MIT IHREN INTERESSEN NACH ART. 6 ABS. 1 lit. f DSGVO STÜTZEN, KÖNNEN SIE JEDERZEIT WIDERSPRECHEN, WENN DAFÜR GRÜNDE BESTEHEN, DIE SICH AUS IHRER BESONDEREN PERSÖNLICHEN SITUATION ERGEBEN. <br/>WIR VERARBEITEN IHRE DATEN DANN NICHT MEHR, ES SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE DIE INTERESSEN, RECHTE UND FREIHEITEN VON IHNEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN UNSERERSEITS.</div><p></p>
<h3 id="dse_nutzerrechte_datenuebertragung">Datenübertragung</h3>
<p>Sie können von uns die Übertragung der zu Ihrer Person gespeicherten Daten in maschinenlesbarer Form verlangen.</p>
<h3 id="dse_nutzerrechte_beschwerde">Beschwerde</h3>
<p>Soweit Sie sich durch unsere Datenverarbeitung in Ihren Rechten verletzt fühlen, können Sie bei der zuständigen Aufsichtsbehörde (<a href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html" target="_blank" rel="noopener noreferrer">hier<span className="linkext"></span></a> finden Sie eine Liste der Behörden) eine Beschwerde einreichen.</p>
<h2 id="dse_aenderungdse">Änderung der Datenschutzerklärung</h2>
<p>Sofern einmal eine Änderung der Datenschutzerklärung aus rechtlichen oder tatsächlichen Gründen erforderlich wird, werden wir diese Seite entsprechend aktualisieren. Dabei werden keine Änderungen an den vom Nutzer erteilten Einwilligungen vorgenommen.</p>
<h2 id="dse_dateneingaben">Dateneingaben</h2>
<h3 id="dse_dateneingaben_verschluesselung">Verschlüsselung</h3>
<p>Wenn Sie auf unserer Website Daten eingeben, sei es auf einem Kontaktformular, anlässlich einer Registrierung, des Einloggens oder für Zahlungszwecke, ist die Webseite, auf der Sie die Daten eingeben, verschlüsselt. Dadurch können Dritte nicht mitlesen, welche Daten Sie eingeben. Sie erkennen die Verschlüsselung an dem Schlosssymbol in Ihrem Browser und daran, dass die Adresszeile mit „https“ anstatt nur mit „http“ beginnt.</p>
<h3 id="dse_dateneingaben_kontaktform">Kontaktformular</h3>
<p>Füllen Sie ein Kontaktformular aus oder senden Sie uns eine Mail oder eine sonstige elektronische Nachricht, werden Ihre Angaben für die Bearbeitung der Anfrage, mögliche Anschlussfragen oder damit zusammenhängende weitere Fragen, gespeichert und nur im Rahmen der Anfrage verwendet.<br/><br/>Die Eingabe Ihrer Daten erfolgt verschlüsselt, dadurch können Dritte Ihre Daten anlässlich der Eingabe selbst dann nicht mitlesen, wenn sie Zugriff auf das Netzwerk haben (z.B. in ungeschützten öffentlichen W-LANs). <br/><br/>Grundlage für diese Speicherung ist unser berechtigtes Interesse an Kommunikation mit interessierten Nutzern nach Art. 6 Abs. 1 lit. f DSGVO und bei Vertragsanfragen auch die Speicherung von Vertragsdaten gem. Art. 6 Abs. 1 lit. b DSGVO.<br/><br/>Ihre Daten bleiben gespeichert, solange es die Bearbeitung der Anfrage erfordert, insbesondere die Speicherung noch zur Vertragserfüllung-/abwicklung, zur Rechtsverfolgung durch uns oder aus unseren sonstigen berechtigten Interessen noch erforderlich ist oder wir gesetzlich gehalten sind, Ihre Daten noch aufzubewahren (z.B. im Rahmen steuerlicher Aufbewahrungsfristen).</p><p><br/>Erstellt mit dem <a href="https://easyrechtssicher.de/komplett-schutz/" target="_blank" rel="noopener noreferrer">Datenschutz Generator<span className="linkext"></span></a> von <a href="https://easyrechtssicher.de/" target="_blank" rel="noopener noreferrer">https://easyrechtssicher.de<span className="linkext"></span></a></p><p><br/>Es gilt unsere aktuelle Datenschutzerklärung vom 02.01.2022</p>
    `
}

export function fetchIntro(locale = "en") {
    return intro[locale] ?? intro["en"]
}

export function fetchMenu(locale = "en") {
    return menu[locale] ?? menu["en"]
}

export function fetchProjectIntro(locale = "en") {
    return projectIntro[locale] ?? projectIntro["en"]
}

export function fetchProjects(locale = "en") {
    return projects[locale] ?? projects["en"]
}

export function fetchFrameWorkButtons(buttons: frameWorkButtonType[]) {
    return frameWorkButtons.filter(button => buttons.includes(button.name))
}

export function fetchPrivacyPage(locale = "en") {
    return privacy[locale] ?? privacy["en"]
}

export function fetchContactForm(locale = "en") {
    return contactForm[locale] ?? contactForm["en"]
}

export function fetchFooter(locale = "en") {
    return footer[locale] ?? footer["en"]
}