import { getAuthSession } from "@/lib/auth"
import { Post, Vote, VoteType } from "@prisma/client"
import { notFound } from "next/navigation"
import PostVotes from "./PostVotes"

interface PageProps{
    postId: string
    initialVoteAmt?: number
    initialVote?: VoteType | null
    getData?: ()=>Promise<(Post & {votes: Vote[]}) | null>
}

const Page = async({initialVoteAmt, postId, getData, initialVote}: PageProps)=>{
    const session = await getAuthSession()

    let _votesAmt: number = 0
    let _currentVote: VoteType | undefined | null = null

    if(getData){
        const post = await getData()
        if(!post) return notFound()
        _votesAmt = post.votes.reduce((acc, elem)=>{
            if(elem.type=="UP") return acc+1
            if(elem.type=="DOWN") return acc+1
            return acc
        }, 0)
        _currentVote = post.votes.find((vote)=>vote.userId===session?.user.id)?.type 
    }
    else{
        _votesAmt = initialVoteAmt!
        _currentVote = initialVote
    }

    return(
        <PostVotes initialVotesAmt={_votesAmt} postId={postId} initialVote={_currentVote} />
    )
}

export default Page