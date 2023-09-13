import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

export default function SignIn(){

    return(
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] items-center text-center">
            <div className="flex flex-col space-y-4">
                <Icons.logo className="h-6 mx-auto w-6" />
                <h1 className="text-2xl font-semibold tracking-tight ">
                    Welcome back!
                    </h1>
                <p className="text-sm mx-auto max-w-xs">
                    By proceeding, you are setting up Forum account and agree to our
                    Aser Agreement and Privacy Policy
                </p>

                {/* sign in form */}
                <UserAuthForm />

                <p className="p-8 text-sm text-zinc-500">
                    New to Forum?{' '}
                    <Link className="hover:text-zinc-800 underline underline-offset-4" href={"/sign-up"}>Sign Up</Link>
                </p>
            </div>
        </div>
    )
}