"use client";
// hooks
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
// components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "../ui/textarea";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// server action
import { createThread, updateUser } from "@/lib/actions";
// validations
import { ThreadValidation } from "@/lib/validations";

import { useOrganization } from "@clerk/nextjs";

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    // console.log('ORGANIZATION:', organization);
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full  gap-4">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                  rows={15}
                  placeholder="Enter your thread"
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
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
