import { fetchUserThreads } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import { ThreadCard } from "../cards";

interface ThreadTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadTab = async ({
  currentUserId,
  accountId,
  accountType,
}: ThreadTabProps) => {
  // fetch profile threads
  const results = await fetchUserThreads(accountId);
  // console.log('results::', results.threads)
  if (!results) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {results.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: results.name, image: results.image, id: results.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          } // TODO
          community={thread.community} // todo
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadTab;
