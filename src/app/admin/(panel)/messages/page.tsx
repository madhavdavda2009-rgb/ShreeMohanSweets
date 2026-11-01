import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await query<{ id: number; name: string; email: string; message: string; created_at: string }>(
    "SELECT id, name, email, message, created_at FROM contact_messages ORDER BY id DESC LIMIT 200",
  );

  return (
    <>
      <h1 className="heading text-4xl">Messages</h1>
      {messages.length === 0 && <p className="mt-4 text-muted">No messages yet.</p>}
      <ul className="mt-6 grid max-w-3xl gap-3">
        {messages.map((message) => (
          <li key={message.id} className="rounded-[var(--radius-soft)] bg-blush p-4">
            <p className="font-semibold">
              {message.name},{" "}
              <a href={`mailto:${message.email}`} className="text-rani underline">
                {message.email}
              </a>
            </p>
            <p className="text-sm text-muted">{message.created_at}</p>
            <p className="mt-2 whitespace-pre-wrap">{message.message}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
