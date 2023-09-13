import { db } from "@/lib/db"
import CommentComp from "./Comment"
import CreateComment from "./CreateComment"

const CommentsSection = async({postId}: {postId: string})=>{

    let comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null
        },
        include:{
            author: true,
            votes: true,
            replies: {
                include:{
                    author: true,
                    votes: true
                }
            }
        }
    })

    return(
        <div className="flex flex-col gap-y-4 mt-4">
            <hr className="w-full h-px my-6" />
            <CreateComment postId={postId} />
            <div className="flex flex-col gap-y-6 mt-4">
                {comments.map(elem=><><CommentComp postId={postId} comment={elem} />
                <div className="sm:ml-4 border-zinc-400 border-l-2 pl-4">
                    {elem.replies.map(reply=><CommentComp key={elem.id} replyTo={elem.id} postId={postId} comment={reply} />)}
                    </div></>)}
            </div>
        </div>
    )
}

export default CommentsSection