import { useCallback, useRef } from "react"
import type EditorJS from "@editorjs/editorjs"
import { uploadFiles } from "@/lib/uploadthing"

export const useInitEditor = (): [()=>Promise<void>, React.RefObject<EditorJS | undefined>]=>{

    const ref = useRef<EditorJS>()

    return [useCallback(async()=>{
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    const Code = (await import("@editorjs/code")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
    const ImageTool = (await import("@editorjs/image")).default

    if(!ref.current){
        const editor = new EditorJS({
            holder: 'editor',
            onReady: ()=>{
                ref.current = editor
            },
            placeholder: "Type here to write your post...",
            inlineToolbar: true,
            data: {blocks:[]},
            tools:{
                header: {
                    //@ts-ignore
                    class: Header,
                    config: {
                      placeholder: 'Enter a header',
                      levels: [2, 3, 4],
                      defaultLevel: 3
                    }
                  },
                linkTool: {
                    class: LinkTool,
                    config: {
                        endpoint: '/api/link'
                    }
                },
                image: {
                    class: ImageTool,
                    config:{
                        uploader: {
                            async uploadByFile(file: File){
                                let [res] = await uploadFiles([file], 'imageUploader')
                                return {
                                    success: 1,
                                    file: {
                                        url: res.fileUrl
                                    }
                                }
                            }
                        }
                    }
                },
                list: List,
                code: Code,
                embed: Embed,
                table: Table,
                inlineCode: InlineCode
            }
        })
    }
}, []), ref]

}