import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <main className={"flex items-center gap-2 justify-center"}>
        <SignIn />
    </main>

}