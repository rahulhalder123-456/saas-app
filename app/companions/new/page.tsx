import CompanionForm from "@/components/CompanionForm";
import { newCompanionPermissions } from "@/lib/actions/companion.actions";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import Image from "next/image";
import Link from "next/dist/client/link";

const NewCompanion = async () => {

    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const canCreateCompanion = await newCompanionPermissions()

    return (
        <main className={"min-lg:w-1/3 min-md:w-2/3 items-center justify-center"}>
            {canCreateCompanion ? (
                <article className={"w-full gap-4 flex flex-col"}>
                <h1>Companion Builder</h1>
                <CompanionForm/>
            </article>
            ) : (
                <article className={"companion-limit"}>
                    <Image
                        src={"/images/limit.svg"}
                        alt="Companion Limit Reached" 
                        width={360} height={240}
                        />
                    <div className="cta-badge">
                        Upgrade your plan
                    </div>
                    <h1>You've reached your limit</h1>
                    <p>You've reached your limit for creating new companions. Please upgrade your plan to create more.</p>
                    <Link href={"/subscription"} className="btn-primary w-full justify-center">Upgrade My plan</Link>
                </article>
            )}
        </main>
    )
}
export default NewCompanion
