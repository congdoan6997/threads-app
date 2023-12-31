// clerk
import { currentUser } from "@clerk/nextjs";
// action server
import { fetchCommunityDetails, fetchUser } from "@/lib/actions";
// utils
import { redirect } from "next/navigation";
// components
import { ProfileHeader, ThreadTab } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import { UserCard } from "@/components/cards";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const communityDetails = await fetchCommunityDetails(params.id);
  //    console.log('communityDetails::', communityDetails)
  return (
    <section>
      <ProfileHeader
        currentUserId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        image={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" ? (
                  <p className="ml-1 rounded-sm  bg-light-4 px-2 py1 !text-tiny-medium text-light-2">
                    {communityDetails?.threads?.length}
                  </p>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent>
          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails?.members?.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  image={member.image}
                  username={member.username}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
          <TabsContent value="requests" className="w-full text-light-1">
            <ThreadTab
              currentUserId={user.id}
              accountId={communityDetails.id}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
