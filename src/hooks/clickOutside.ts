import { RefObject, useEffect } from "react";

export let useClickOutside = (ref: RefObject<HTMLElement>, func: ()=>any)=>{

    useEffect(()=>{
        let body = document.querySelector('body')
        body?.addEventListener('click', func)

        let stopPropagination = (e: MouseEvent)=>{
            e.stopPropagation()
        }

        ref.current?.addEventListener('click', stopPropagination)

        return ()=>{
            body?.removeEventListener('click', func)
            ref.current?.removeEventListener('click', stopPropagination)
        }
    }, [ref, func])
    

}