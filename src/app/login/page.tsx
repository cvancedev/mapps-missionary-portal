import LoginForm from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, notice } = await searchParams;

  // Only a single, known code string is passed through to the form.
  const errorCode = typeof error === "string" ? error : undefined;
  const noticeCode = typeof notice === "string" ? notice : undefined;

  return <LoginForm errorCode={errorCode} noticeCode={noticeCode} />;
}
