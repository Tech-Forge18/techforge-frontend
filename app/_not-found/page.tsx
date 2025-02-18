import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cool-50 dark:bg-cool-900">
      <h1 className="text-4xl font-bold text-cool-800 dark:text-cool-100 mb-4">404 - Page Not Found</h1>
      <p className="text-cool-600 dark:text-cool-300 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="bg-vibrant-500 hover:bg-vibrant-600 text-white font-bold py-2 px-4 rounded">
        Go back to Home
      </Link>
    </div>
  )
}

