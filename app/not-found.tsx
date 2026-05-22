import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <p className="text-sm font-medium text-accent tracking-wide uppercase">404</p>
        <h1 className="mt-2 text-4xl font-heading font-semibold text-primary">
          Page not found
        </h1>
        <p className="mt-3 text-secondary leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
