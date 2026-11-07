import LoginForm from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  // Only a single, known code string is passed through to the form.
  const errorCode = typeof error === "string" ? error : undefined;

  return <LoginForm errorCode={errorCode} />;
}
