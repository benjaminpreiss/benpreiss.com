import { createContext, useContext, useState, useEffect } from 'react';
import { debounce } from 'lodash';

const dimDefault = {
    height: 0,
    width: 0,
    scrollBarWidth: 0
}

const WindowContext = createContext(dimDefault)

type WindowContextWrapperProps = {
    children: React.ReactNode;
    debounceMs: number;
}

export function WindowContextWrapper({children, debounceMs}: WindowContextWrapperProps) {
    const [dim, setDim] = useState(dimDefault)
    useEffect(() => {
        function handleResize() {
            if(typeof window !== undefined) {
                setDim({
                    height: window.innerHeight,
                    width: window.innerWidth,
                    scrollBarWidth: window.innerWidth - document.documentElement.clientWidth
                })
            }
        }
        const debouncedHandleWindowResize = debounce(handleResize, debounceMs)
        handleResize()
        window.addEventListener('resize', debouncedHandleWindowResize)
        return () => {
            window.removeEventListener('resize', debouncedHandleWindowResize)
        }
    }, [debounceMs])

    return (
        <WindowContext.Provider value={dim}>
            {children}
        </WindowContext.Provider>
    )
}

export function useWindowContext() {
    return useContext(WindowContext)
}