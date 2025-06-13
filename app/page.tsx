import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import {recentSessions} from "@/constants";

const Page = () => {
    return (
    <main>
      <h1>Popular companions</h1>
        <section className={"home-section"}>
            <CompanionCard id={'1'} name={'Neura the Brainy Explorer'} topic={'Neural Network of the Brain'} subject={'Science'} duration={45} color={'#E5D0FF'}/>
            <CompanionCard id={'2'} name={'Countsy the Number Wizard'} topic={'Derivatives & Integrals'} subject={'maths'} duration={30} color={'#FFDA6E'}/>
            <CompanionCard id={'3'} name={'Verba the Vocabulary Builder'} topic={'English Literature'} subject={'language'} duration={30} color={'#BDE7FF'}/>
        </section>
        <section className={"home-section"}>
            <CompanionList
                title={"Recently completed sessions"}
                companions={recentSessions}
                classNames={'w-2/3 max-lg:w-full'}
            />
            <CTA/>
        </section>
    </main>
  )
}

export default Page