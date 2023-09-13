'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { useRef } from "react"

let Providers = ({children}: {children: React.ReactNode})=>{

    let client = useRef(new QueryClient())

    return(
        <QueryClientProvider client={client.current}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    )
}

export default Providers