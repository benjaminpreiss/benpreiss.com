import Clickable from "../Clickable/Clickable"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import {object, string} from 'yup';
import TextLink from '../TextLink/TextLink'
import { fetchContactForm } from '../../util/backendFetching'
import { useRouter } from 'next/router'

type FormValuesType = {
    name: string
    email: string
    message: string
}

export default function ContactForm() {
    const router = useRouter()
    const { locale } = router
    const contactFormContent = fetchContactForm(locale)
    const ContactFormSchema = object().shape({
        name: string()
            .matches(/^[aA-zZ\s]+$/, contactFormContent.nameField.validation.matchRegExError)
            .max(40, contactFormContent.nameField.validation.maxLengthError)
            .required(contactFormContent.nameField.validation.requiredError),
        email: string()
            .email(contactFormContent.emailField.validation.validEmailError)
            .required(contactFormContent.emailField.validation.requiredError),
        message: string()
            .max(500, contactFormContent.messageField.validation.maxLengthError)
            .required(contactFormContent.messageField.validation.requiredError)
    });
    const inputClasses = "bg-ben-gray-2 font-fgt text-lg leading-tight placeholder:opacity-60 py-2.5 px-5 mt-4 block w-full border-[1px] border-transparent focus:outline focus:outline-[3px]"
    const inputErrorClasses = (isError: boolean) => isError ? "border-ben-red-1 text-ben-red-1 focus:border-ben-red-1 focus:text-ben-red-1 focus:outline-ben-red-1/20 placeholder:text-ben-red-1" : "focus:border-ben-black focus:outline-ben-black/20 text-ben-black placeholder:text-ben-black"
    return (
        <>
            <div className='px-8 w-full pt-52 mx-auto max-w-md md:max-w-xl mb-40' id="contact">
                <h3 className='font-fg font-medium text-3xl leading-none'>{contactFormContent.title}</h3>
                <p className='font-fgt text-xl mt-4 leading-tight'>{contactFormContent.description}</p>
                <h3 className='font-fg font-medium text-xl leading-none mt-10'>{contactFormContent.phoneTitle}</h3>
                <div className='relative w-full mt-3 overflow-hidden'>
                    <a className='bg-ben-gray-2 py-3.5 pr-2 pl-5 block font-fgt text-lg leading-none peer w-full text-left hover:bg-ben-gray-3' href='tel:+491607059712'>
                        +49 160 705 97 12
                    </a>
                    <div className='absolute top-1/2 -translate-y-1/2 right-0 px-2 peer-hover:bg-ben-gray-3 bg-ben-gray-2'>
                        <div className='relative bg-inherit'>
                            <Clickable type="button" onClick={() => {navigator.clipboard.writeText("+491607059712")}} color='white' additionalClasses='peer z-20 relative'>
                                <div className='w-7 h-7 p-1.5'>
                                <div className={`w-full h-full bg-copy bg-no-repeat bg-center bg-contain`}></div>
                                </div>
                            </Clickable>
                            <div className='absolute z-10 top-1/2 -translate-y-1/2 peer-hover:-translate-x-full left-0 peer-active:translate-x-0 h-7 flex items-center peer-active:opacity-0 peer-hover:opacity-100 opacity-0 bg-inherit transition-none peer-hover:transition-opacity-transform peer-active:transition-none duration-0 peer-hover:duration-0 peer-hover:delay-0 peer-focus:delay-700 delay-700'>
                                <span className='font-fgt text-sm leading-none pr-2 pl-4 block text-ben-gray-5 whitespace-nowrap'>{contactFormContent.phoneField.copyHint}</span>
                            </div>
                            <div className='absolute z-10 top-1/2 -translate-y-1/2 h-7 flex items-center peer-hover:-translate-x-full peer-active:-translate-x-full peer-active:opacity-100 opacity-0 left-0 peer-active:transition-none duration-0 transition-opacity-transform delay-700 bg-inherit'>
                                <span className='font-fgt text-sm leading-none pr-2 pl-4 block text-ben-gray-5 whitespace-nowrap'>{contactFormContent.phoneField.copiedText}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className='font-fg font-medium text-xl leading-none mt-10'>{contactFormContent.emailTitle}</h3>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        message: ""
                    }}
                    validationSchema={ContactFormSchema}
                    onSubmit={(
                        values: FormValuesType,
                        { setSubmitting }: FormikHelpers<FormValuesType>
                      ) => {
                        setTimeout(() => {
                          console.log(JSON.stringify(values, null, 2));
                          setSubmitting(false);
                        }, 500);
                      }}
                >
                    {({ errors, touched, isValid, dirty }) => (
                        <Form>
                            <label htmlFor="name" className='sr-only'>{contactFormContent.nameField.label}</label>
                            <Field id="name" name="name" placeholder={contactFormContent.nameField.placeholder} as="input" className={inputClasses + " " + inputErrorClasses(errors.name && touched.name ? true : false)} />
                            <div className="font-fgt w-full text-right pr-4 font-normal pt-1 text-ben-red-1 -mb-1"><ErrorMessage name="name" /></div>
                            <label htmlFor="email" className='sr-only'>{contactFormContent.emailField.label}</label>
                            <Field id="email" name="email" placeholder={contactFormContent.emailField.placeholder} as="input" className={inputClasses + " " + inputErrorClasses(errors.email && touched.email ? true : false)} />
                            <div className="font-fgt w-full text-right pr-4 font-normal pt-1 text-ben-red-1 -mb-1"><ErrorMessage name="email" /></div>
                            <label htmlFor="message" className='sr-only'>{contactFormContent.messageField.label}</label>
                            <Field id="message" name="message" placeholder={contactFormContent.messageField.placeholder} as="textarea" className={inputClasses + " h-40 " + inputErrorClasses(errors.message && touched.message ? true : false)} />
                            <div className="font-fgt w-full text-right pr-4 font-normal pt-1 text-ben-red-1 -mb-1"><ErrorMessage name="message" /></div>
                            <p className="font-fgt text-normal leading-tight md:ml-6 text-center md:text-left w-full mt-3">{contactFormContent.footNote}<br className="md:hidden"/><TextLink type="next-link" color="white" href="/privacy"><span className='font-fgt text-normal font-light'>{contactFormContent.privacyLink}</span></TextLink></p>
                            <button disabled={!isValid || !dirty} type="submit" className="bg-ben-black w-full text-white text-center font-fg font-medium text-lg py-1 px-4 mt-4 hover:bg-ben-gray-6 active:bg-ben-gray-5 active:scale-95 border-[3px] border-transparent focus:border-white/80 outline outline-transparent focus:outline-ben-black focus:outline-[1px] disabled:bg-ben-gray-4">{contactFormContent.submitButtonText}</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}