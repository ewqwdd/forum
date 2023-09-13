'use-client'

import { X } from "lucide-react"
import { Button } from "./ui/Button"
import { useRouter } from "next/navigation"

let CloseModal = ()=>{

    let router = useRouter()
    return(
        <Button variant='subtle' className="h-6 2-6 p-0 rounded-md " onClick={()=>{router.back()}}>
            <X className="h-4"/>
        </Button>
        
    )
}

export default CloseModal