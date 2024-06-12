"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function CreateUser() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const createUser = api.user.createUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setEmail("");
      setMessage("User created successfully!");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createUser.mutate({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="max-w-lg flex-1"
      />
      <Button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createUser.isPending}
      >
        {createUser.isPending ? "Loading..." : "Get Started"}
      </Button>
      {message && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </form>
  );
}
