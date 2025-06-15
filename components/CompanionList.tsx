"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Adjust the path as needed
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Adjust the path as needed
import { addBookmark, removeBookmark } from "@/lib/actions/companion.actions"; // Adjust the path as needed
import { getSubjectColor } from "@/lib/utils"; // Adjust the path as needed

// Define the types
type Companion = {
  id: string;
  subject: string;
  name: string;
  topic: string;
  duration: string;
  bookmarked: boolean;
};

type CompanionListProps = {
  title: string;
  companions?: Companion[];
  classNames?: string;
};

const CompanionList: React.FC<CompanionListProps> = ({ title, companions = [], classNames }) => {
  const pathname = usePathname();
  const [companionList, setCompanionList] = useState<Companion[]>(companions);

  const toggleBookmark = async (id: string) => {
    try {
      const companion = companionList.find((c) => c.id === id);
      if (!companion) return;

      if (companion.bookmarked) {
        await removeBookmark(id, pathname);
      } else {
        await addBookmark(id, pathname);
      }

      // Update local state for instant feedback
      setCompanionList((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, bookmarked: !c.bookmarked } : c
        )
      );
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  return (
    <article className={cn("companion-list", classNames)}>
      <h2 className="font-bold text-3xl">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companionList.map(({ id, subject, name, topic, duration, bookmarked }) => (
            <TableRow key={id}>
              <TableCell>
                <div className="flex items-center gap-2 justify-between">
                  <Link href={`/companions/${id}`} className="flex items-center gap-2">
                    <div
                      className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
                      style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                      <Image
                        src={`/icons/${subject}.svg`}
                        alt={subject}
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-2xl">{name}</p>
                      <p className="text-lg">{topic}</p>
                    </div>
                  </Link>
                  <button onClick={() => toggleBookmark(id)} className="ml-2">
                    <Image
                      src={
                        bookmarked
                          ? "/icons/bookmark-filled.svg"
                          : "/icons/bookmark.svg"
                      }
                      alt="bookmark"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </TableCell>
              {/* Add more TableCell components here for subject and duration if needed */}
              <TableCell>{subject}</TableCell>
              <TableCell className="text-right">{duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default CompanionList;
