import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/profile/ProfileForm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile | StudioSpace",
  description: "Update your StudioSpace profile name and profile image.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <ProfileForm
      initialUser={{
        name: session.user.name ?? "",
        email: session.user.email,
        image: session.user.image ?? "",
      }}
    />
  );
}
