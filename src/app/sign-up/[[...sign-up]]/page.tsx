import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
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
