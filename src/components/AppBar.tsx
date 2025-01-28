import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const Appbar = () => {
  const session = useSession();

  return (
    <div>
      {session.data?.user?.name ? (
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      ) : (
        <Button onClick={() => signIn()}>Signin</Button>
      )}
    </div>
  );
};
