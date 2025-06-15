import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList"; // Fixed: Import name
import CTA from "@/components/CTA";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

const Page = async () => {
  const companions = await getAllCompanions({limit:3});
  const recentSessionsCompanionsRaw = (await getRecentSessions()).flat();
  // Remove duplicates by id to ensure unique keys
  const recentSessionsCompanions = recentSessionsCompanionsRaw.filter(
    (companion, index, self) =>
      index === self.findIndex((c) => c.id === companion.id)
  );
    return (
    <main>
      <h1>Popular companions</h1>
        <section className={"home-section"}>
            {companions.map(companion => (
              <CompanionCard 
                key={companion.id} 
                {...companion} 
                color={getSubjectColor(companion.subject)}
                bookmarked={false} /* Fixed: Added required prop */
              />
            ))}
        </section>
        <section className={"home-section"}>
            <CompanionList // Fixed: Component name
                title={"Recently completed sessions"}
                companions={recentSessionsCompanions}
                classNames={'w-2/3 max-lg:w-full'}
            />
            <CTA/>
        </section>
    </main>
  )
}

export default Page;