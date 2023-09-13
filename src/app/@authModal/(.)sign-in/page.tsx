'use client'
import CloseModal from "@/components/CloseModal"
import SignIn from "@/components/SignIn"
import { useRouter } from "next/navigation"

let Page = ()=>{

    let router = useRouter()

    return(
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-5 flex justify-center items-center z-50" onClick={()=>router.back()}>
        <div className="p-4 bg-white rounded-lg container relative max-w-md" onClick={(e)=>e.stopPropagation()}>
            <div className="absolute right-0 top-0 mt-4 mr-4 cursor-pointer">
                <CloseModal />
            </div>
            <SignIn />
        </div>
    </div>
        )
}

export default Page