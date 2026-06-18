import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16 bg-background">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/profile"
        fallbackRedirectUrl="/profile"
      />
    </section>
  );
}
