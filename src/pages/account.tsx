import type { User } from "@/components/top-bar";

import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DeletionDialog } from "@/components/dialogs/deletion-dialog";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IconCopy } from "@tabler/icons-react";
import { EyeIcon } from "@heroicons/react/24/outline";

function InlineInput({ label, value }: { label: string; value: string }) {
  const { toast } = useToast();

  return (
    <div className="flex items-center w-full">
      <label
        htmlFor={label.replace(" ", "-").toLowerCase()}
        className="min-w-fit text-sm px-3 bg-neutral-100 text-neutral-500 dark:bg-neutral-900 h-9 items-center flex rounded-md rounded-r-none border border-neutral-200 dark:border-neutral-800"
      >
        {label}
      </label>
      <div className="relative w-full flex items-center">
        <Input
          type="text"
          readOnly
          id={label.replace(" ", "-").toLowerCase()}
          value={value}
          className="pr-9 border-l-0 rounded-l-none text-ellipsis"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 group hover:bg-inherit dark:hover:bg-inherit"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast({
              title: "Copied!",
              description: `Your ${label} has been copied to your clipboard.`,
            });
          }}
        >
          <IconCopy className="w-5 h-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
        </Button>
      </div>
    </div>
  );
}
export default function Account() {
  const api = useSWR<User>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false }
  );

  const { toast } = useToast();

  const [deletionOpen, setDeletionOpen] = useState(false);
  const [inputType, setInputType] = useState<"password" | "text">("password");

  return (
    <>
      <Head>
        <title>stardew.app | Account Settings</title>
        <meta
          name="description"
          content="Manage your stardew.app account. Manage your data, saves, and more."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="flex min-h-[calc(100vh-65px)] md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8">
        <div className="mx-auto max-w-5xl w-full space-y-8 mt-4">
          <Tabs defaultValue="authentication">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="saves">Saves</TabsTrigger>
            </TabsList>
            <TabsContent value="authentication" className="mt-4 space-y-8">
              <section className="flex flex-col space-y-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Authentication
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
                  Manage and view your authentication information. Your user ID
                  is used to identify your account and is used to link your
                  saves to your account.
                </p>

                {/* Logged In */}
                {api.data && (
                  <>
                    <Card>
                      <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
                        <CardTitle>Account</CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-3">
                        <InlineInput
                          label="Discord ID"
                          value={api.data.discord_id}
                        />
                        <InlineInput
                          label="Username"
                          value={api.data.discord_name}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}

                <Card>
                  <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
                    <CardTitle>User ID</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="relative flex w-full items-center">
                      <Input
                        type={inputType}
                        readOnly
                        value={getCookie("uid") as string}
                        className="pr-[72px] text-ellipsis"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-9 group hover:bg-inherit dark:hover:bg-inherit"
                        onClick={() =>
                          setInputType((prev) =>
                            prev === "password" ? "text" : "password"
                          )
                        }
                      >
                        <EyeIcon className="w-5 h-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 group hover:bg-inherit dark:hover:bg-inherit"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            getCookie("uid") as string
                          );
                          toast({
                            title: "Copied!",
                            description:
                              "Your user ID has been copied to your clipboard.",
                          });
                        }}
                      >
                        <IconCopy className="w-5 h-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
              {api.data && (
                <section className="flex flex-col space-y-4">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Danger Zone
                  </h1>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        deleteCookie("token", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        deleteCookie("uid", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        deleteCookie("oauth_state", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        deleteCookie("discord_user", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        return (window.location.href = "/");
                      }}
                    >
                      Log Out
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeletionOpen(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </section>
              )}
            </TabsContent>
            <TabsContent value="saves" className="mt-4 space-y-8">
              <section className="flex flex-col space-y-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Saves
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
                  Manage and view your Stardew Valley Saves.
                </p>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <DeletionDialog
        open={deletionOpen}
        setOpen={setDeletionOpen}
        type="account"
      />
    </>
  );
}
