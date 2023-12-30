"use server";

import { revalidatePath } from "next/cache";
// model

// mongoose
import { connectToDB } from "../mongoose";
import { Thread, User } from "../models";
interface ThreadProps {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: ThreadProps): Promise<void> {
  try {
    connectToDB();
    const newThread = await Thread.create({
      text,
      author,
      community: null,
    });

    if (newThread) {
      await User.findByIdAndUpdate(author, {
        $push: {
          threads: newThread._id,
        },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create/update thread: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 10) {
  try {
    await connectToDB();

    const offset = (pageNumber - 1) * pageSize;
    // fetch the posts that have no parents (top level posts)
    const postQuery = Thread.find({
      parentId: { $exists: false },
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(pageSize)
      .populate({
        path: "author",
        model: "User",
        select: "id name image username",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User",
          select: "_id name image parentId",
        },
      });

    const totalPosts = await Thread.countDocuments({
      parentId: { $exists: false },
    });

    const posts = await postQuery.exec();

    const isNext = offset + posts.length < totalPosts;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  try {
    await connectToDB();
    return await Thread.findOne({ _id: id })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}
export async function addCommentToThread({
  threadId,
  comment,
  userId,
  path,
}: {
  threadId: string;
  comment: string;
  userId: string;
  path: string;
}) {
  try {
    await connectToDB();

    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Original thread not found");
    }
    const newComment = new Thread({
      text: comment,
      author: userId,
      parentId: threadId,
    });

    const newThread = await newComment.save();

    if (newThread) {
      originalThread.children.push(newThread._id);
      await originalThread.save();
      revalidatePath(path);
    } else {
      throw new Error("Failed to create comment");
    }
    // return newComment;
  } catch (error: any) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}
