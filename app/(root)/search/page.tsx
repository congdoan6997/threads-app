// clerk
import { currentUser } from "@clerk/nextjs";
// action server
import { fetchUser, fetchUsers } from "@/lib/actions";
// utils
import { redirect } from "next/navigation";
// components
import { ProfileHeader, ThreadTab } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import { Thread } from "@/lib/models";
import { ThreadCard, UserCard } from "@/components/cards";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const { users, isNext } = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageSize: 25,
    numberPage: 1,
  });

  // console.log('user::', users);
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      {/* search bar */}
      <div className="mt-14 flex flex-col gap-9">
        {!users || users.length === 0 ? (
          <div className="no-result">No users</div>
        ) : (
          users.map((user: any) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              username={user.username}
              image={user.image}
              personType="User"
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
