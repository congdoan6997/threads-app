import React from "react";
// clerk
import { currentUser } from "@clerk/nextjs";
// components
import { ThreadCard } from "@/components/cards";
import { Comment } from "@/components/forms";
// next navigation
import { redirect } from "next/navigation";
// server action
import { fetchThreadById, fetchUser } from "@/lib/actions";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);
  // console.log('user::', userInfo)

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id);
  // console.log('thread::', thread)
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7 ">
        <Comment
          threadId={thread._id}
          currentUserId={userInfo._id}
          currentUserImg={userInfo.image}
        />
      </div>

      <div className="mt-10">
        {thread.children?.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;