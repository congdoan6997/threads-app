// clerk
import { currentUser } from "@clerk/nextjs";
// action server
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions";
// utils
import { redirect } from "next/navigation";
// components
import { ProfileHeader, ThreadTab } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import { Thread } from "@/lib/models";
import { ThreadCard, UserCard } from "@/components/cards";
import Link from "next/link";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  // get Activity
  const activity = await getActivity(userInfo._id);
  // console.log('activity::', activity)
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {!activity || activity.length === 0 ? (
          <div className="!text-base-regular text-gray-1">No activity yet</div>
        ) : (
          activity.map((item) => (
            <Link key={item._id} href={`/thread/${item.parentId}`}>
              <article className="activity-card">
                <Image
                  src={item.author.image}
                  alt={item.author.name}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />

                <p className="!text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500">
                    {item.author.name}
                  </span>{" "}
                  replied to your thread
                </p>
              </article>
            </Link>
          ))
        )}
      </section>
    </section>
  );
};

export default Page;
