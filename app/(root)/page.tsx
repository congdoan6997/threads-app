import { fetchPosts } from "@/lib/actions";
// clerk user
import { currentUser } from "@clerk/nextjs";
// components
import { ThreadCard } from "@/components/cards";
export default async function Home() {
  const user = await currentUser();

  const { posts, isNext } = await fetchPosts(1, 30);

  // console.log('posts::',posts);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-19 flex flex-col gap-10">
        {!posts || posts.length === 0 ? (
          <div className="no-result">No result found</div>
        ) : (
          posts.map((post) => (
            <ThreadCard
              key={post._id}
              id={post._id}
              currentUserId={user?.id || ""}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
            />
          ))
        )}
      </section>
    </>
  );
}
