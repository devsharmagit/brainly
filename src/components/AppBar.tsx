import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export const Appbar = () => {
  return <div>
  <Button onClick={() => signIn()}>Signin</Button>
  <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
</div>
}