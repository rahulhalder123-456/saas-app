
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionList from "@/components/CompanionList"; // Fixed: Component name
import { get } from "http";
import { subjects } from "@/constants";
import { getSubjectColor } from "@/lib/utils";

// Fixed: Added proper interface
interface Companion {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  bookmarked?: boolean;
}

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const rawSessionHistory: any[][] = await getUserSessions(user.id);
  const sessionHistory: any[] = rawSessionHistory.flat();
  const rawBookmarkedCompanions: any[][] = await getBookmarkedCompanions(user.id);
  const bookmarkedCompanions: Companion[] = rawBookmarkedCompanions.flat();
  
  // Create a set of bookmarked companion IDs for quick lookup
  const bookmarkedIds = new Set(bookmarkedCompanions.map((c) => c.id));
  
  // Add `bookmarked: true/false` to each companion/session item
  const enrichedCompanions = companions.map((companion) => ({
    ...companion,
    duration: String(companion.duration),
    bookmarked: bookmarkedIds.has(companion.id),
  }));

  const enrichedSessions = sessionHistory.map((session) => ({
    ...session,
    duration: String(session.duration),
    bookmarked: bookmarkedIds.has(session.id),
  }));

  // Remove duplicates by id for each list to avoid duplicate keys
  const uniqueEnrichedCompanions = uniqueById(enrichedCompanions);
  const uniqueEnrichedSessions = uniqueById(enrichedSessions);

  // Helper to filter unique items by id
  function uniqueById<T extends { id: string }>(arr: T[]): T[] {
    const seen = new Set<string>();
    return arr.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  // Remove duplicates from bookmarks (in case they overlap with companions or sessions)
  const enrichedBookmarks = uniqueById(
    bookmarkedCompanions.map((bookmark) => ({
      ...bookmark,
      duration: String(bookmark.duration),
      bookmarked: true,
    }))
  );

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl}
            alt={user.firstName!}
            width={110}
            height={110}
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={22}
                height={22}
              />
              <p className="text-2xl font-bold">{sessionHistory.length}</p>
            </div>
            <div>Lessons completed</div>
          </div>
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/cap.svg"
                alt="cap"
                width={22}
                height={22}
              />
              <p className="text-2xl font-bold">{companions.length}</p>
            </div>
            <div>Companions created</div>
          </div>
        </div>
      </section>

      <Accordion type="multiple">
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            Bookmarked Companions {`(${enrichedBookmarks.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList // Fixed: Component name
              companions={enrichedBookmarks}
              title="Bookmarked Companions"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            Recent Sessions {`(${uniqueEnrichedSessions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList
              title="Recent Sessions"
              companions={uniqueEnrichedSessions}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">
            My Companions {`(${uniqueEnrichedCompanions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList
              title="My Companions"
              companions={uniqueEnrichedCompanions}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Profile;