'use client'
import Output from 'editorjs-react-renderer'
import Image from 'next/image';
import { FC } from "react"

interface PageProps{
    content: any;
}

let EditorOutput: FC<PageProps> = ({content})=>{

    const renderers = {
        image: customImageRenderer
    }

    return(
        <>
            <Output 
            data={content} 
            className='text-sm'
            renderers={renderers}
            />
        </>
    )
}

function customImageRenderer({data}: any){
    let url = data.file.url

    return(
        <div className='relative w-full min-h-[15rem]'>
            <Image src={url} fill alt="image" className='object-contain'/>
        </div>
    )
}

export default EditorOutput