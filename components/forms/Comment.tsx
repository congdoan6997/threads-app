"use client";
// hooks
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import React from "react";
import Image from "next/image";
// components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommentValidation } from "@/lib/validations";
// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// server action
import { addCommentToThread } from "@/lib/actions";
interface CommentProps {
  threadId: string;
  currentUserId: string;
  currentUserImg: string;
}

function Comment({ threadId, currentUserId, currentUserImg }: CommentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread({
      comment: values.thread,
      userId: currentUserId,
      threadId: threadId,
      path: pathname,
    });
    //   await createThread({
    //     text: values.thread,
    //     author: userId,
    //     communityId: null,
    //     path: pathname,
    //   });
    // revalidatePath("/");
    // router.push("/");
    form.reset();
  };
  return (
    <div>
      {/* <h1 className="text-white">Comment Form</h1> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full items-center gap-4">
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt="user"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    className="no-focus outline-none  text-light-1"
                    placeholder="Comment..."
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                Enter your thread
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="comment-form_btn">
            Reply
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Comment;
