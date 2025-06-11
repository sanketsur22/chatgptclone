import { useRouter } from "next/router";

export default function Custom500() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">500 - Server Error</h1>
      <p className="mt-4">An error occurred on the server.</p>
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => router.push("/")}
      >
        Go back to home
      </button>
    </div>
  );
}
