"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { Thread } from "../models";
import { FilterQuery, SortOrder } from "mongoose";
interface UserProps {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: UserProps): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: 'Community',
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    await connectToDB();
    // find all threads authorized by the user
    // TODO: community threads
    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "id name image",
          },
        },
      })
      .exec();
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString,
  numberPage = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString: string;
  numberPage?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    await connectToDB();
    // find all users
    const offset = (numberPage - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: {
        $ne: userId,
      },
    };

    if (searchString?.trim() !== "") {
      query["$or"] = [
        {
          name: regex,
        },
        {
          username: regex,
        },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(offset)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = offset + users.length < totalUsers;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    await connectToDB();

    // find all threads authorized by the user
    const userThreads = await Thread.find({ author: userId });

    //collect all thread ids (replies)
    const childrenThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // console.log('childrenThreadIds::', childrenThreadIds);
    const replies = await Thread.find({
      _id: { $in: childrenThreadIds },
      author: { $ne: userId },
    })
      .populate({
        path: "author",
        model: User,
        select: "_id name image",
      })
      .exec();

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}
