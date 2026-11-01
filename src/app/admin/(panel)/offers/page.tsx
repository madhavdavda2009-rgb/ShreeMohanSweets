import { deleteOffer, toggleOffer } from "@/app/actions/admin";
import { OfferForm } from "@/components/admin-forms";
import { requireAdmin } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";

export default async function OffersPage() {
  await requireAdmin();
  const supabase = await sessionClient();
  const { data: offers, error } = await supabase
    .from("offers")
    .select("id, description, start_date, end_date, active")
    .order("id", { ascending: false });
  if (error) throw error;

  return (
    <>
      <h1 className="heading text-4xl">Offers</h1>
      <p className="mt-2 text-muted">The newest active offer appears on the homepage rate board.</p>
      <OfferForm today={new Date().toISOString().slice(0, 10)} />
      <div className="mt-10 overflow-x-auto">
        <table className="table-admin min-w-[640px]">
          <thead>
            <tr>
              <th>Offer</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td>{offer.description}</td>
                <td className="whitespace-nowrap">
                  {offer.start_date} to {offer.end_date}
                </td>
                <td>{offer.active ? "Active" : "Inactive"}</td>
                <td>
                  <div className="flex gap-3">
                    <form action={toggleOffer}>
                      <input type="hidden" name="id" value={offer.id} />
                      <input type="hidden" name="active" value={String(offer.active)} />
                      <button type="submit" className="font-semibold text-rani underline">
                        {offer.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                    <form action={deleteOffer}>
                      <input type="hidden" name="id" value={offer.id} />
                      <button type="submit" className="text-muted underline hover:text-rani">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
