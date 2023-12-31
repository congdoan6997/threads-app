// clerk
import { currentUser } from "@clerk/nextjs";
// action server
import { fetchCommunities, fetchUser, fetchUsers } from "@/lib/actions";
// utils
import { redirect } from "next/navigation";
// components

import { CommunityCard } from "@/components/cards";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const { communities, isNext } = await fetchCommunities({
    searchString: "",
    pageSize: 10,
    pageNumber: 1,
  });

  console.log("communities::", communities);
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      {/* search bar */}
      <div className="mt-14 flex flex-col gap-9">
        {!communities || communities.length === 0 ? (
          <div className="no-result">No Communities</div>
        ) : (
          communities.map((community: any) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              imgUrl={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
