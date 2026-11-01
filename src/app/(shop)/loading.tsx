export default function Loading() {
  return (
    <div className="page animate-pulse py-14" aria-label="Loading">
      <div className="h-12 w-2/3 max-w-md rounded-lg bg-blush" />
      <div className="mt-4 h-5 w-1/2 max-w-sm rounded bg-blush" />
      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-square rounded-[var(--radius-soft)] bg-blush" />
        ))}
      </div>
    </div>
  );
}
