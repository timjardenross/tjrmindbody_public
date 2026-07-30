import Link from 'next/link';

export function Pagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between text-sm">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1)} className="text-blue hover:underline">
          &larr; Newer
        </Link>
      ) : (
        <span />
      )}
      <span className="text-ink-light">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1)} className="text-blue hover:underline">
          Older &rarr;
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
