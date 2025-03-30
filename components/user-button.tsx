"use client"

import { SignInButton, SignUpButton, UserButton as ClerkUserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function UserButton() {
  const { isSignedIn, user } = useUser()

  if (isSignedIn) {
    return <ClerkUserButton afterSignOutUrl="/" />
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">
          Sign in
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button variant="default" size="sm">
          Sign up
        </Button>
      </SignUpButton>
    </div>
  )
}

