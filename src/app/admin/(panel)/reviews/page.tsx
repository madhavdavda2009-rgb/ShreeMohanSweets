import { deleteReview } from "@/app/actions/admin";
import { ReviewForm } from "@/components/admin-forms";
import { requireAdmin } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";

export default async function ReviewsPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, customer_name, rating, review_text")
    .order("id", { ascending: false });
  if (error) throw error;

  return (
    <>
      <h1 className="heading text-4xl">Reviews</h1>
      <ReviewForm />
      <ul className="mt-10 grid max-w-3xl gap-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-[var(--radius-soft)] bg-blush p-4">
            <div className="flex items-center justify-between gap-3">
              <strong>
                {review.customer_name}, {review.rating}/5
              </strong>
              <form action={deleteReview}>
                <input type="hidden" name="id" value={review.id} />
                <button type="submit" className="text-sm text-muted underline hover:text-rani">
                  Delete
                </button>
              </form>
            </div>
            <p className="mt-1">{review.review_text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
