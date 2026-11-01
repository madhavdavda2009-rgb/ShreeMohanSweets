import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/orders";
import { sessionClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, created_at")
    .order("id", { ascending: false })
    .limit(200);
  if (error) throw error;

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
            <p className="text-sm text-muted">{formatDateTime(message.created_at)}</p>
            <p className="mt-2 whitespace-pre-wrap">{message.message}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
