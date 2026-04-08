import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#00d395",
            colorBackground: "#f8f4eb",
            colorInputBackground: "#ede6d2",
            colorInputText: "#1a1814",
            borderRadius: "0.75rem",
          },
        }}
      />
    </div>
  );
}
