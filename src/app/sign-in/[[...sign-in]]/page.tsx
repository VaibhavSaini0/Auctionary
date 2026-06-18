import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16 bg-background">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/profile"
        fallbackRedirectUrl="/profile"
      />
    </section>
  );
}
