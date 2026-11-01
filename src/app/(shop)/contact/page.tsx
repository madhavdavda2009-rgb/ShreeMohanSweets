"use client";

import { InstagramLogoIcon, MapPinIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { useActionState } from "react";
import { sendMessage } from "@/app/actions/shop";
import { FormNotice, SubmitButton } from "@/components/forms";
import { site } from "@/lib/site";

const contacts = [
  { icon: PhoneIcon, label: "Phone", value: site.phone, href: site.phoneHref },
  { icon: WhatsappLogoIcon, label: "WhatsApp", value: site.phone, href: site.whatsapp },
  { icon: InstagramLogoIcon, label: "Instagram", value: "@shreemohansweetsandnamkeen1979", href: site.instagram },
  { icon: MapPinIcon, label: "Address", value: site.addressLines.join(", "), href: site.mapLink },
];

export default function ContactPage() {
  const [state, action] = useActionState(sendMessage, {});
  return (
    <div className="page py-10 md:py-14">
      <h1 className="heading text-5xl md:text-7xl">Contact us</h1>
      <p className="mt-3 text-lg text-muted">Questions, orders or feedback? We are here to help.</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          <ul className="grid gap-5">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                <Icon size={26} className="mt-0.5 text-rani" />
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group">
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="font-semibold wrap-anywhere group-hover:text-rani">{value}</span>
                </a>
              </li>
            ))}
          </ul>
          <iframe
            title="Map showing Shree Mohan Sweets and Namkeen in Paldi"
            src={site.mapEmbed}
            loading="lazy"
            className="mt-8 h-72 w-full rounded-[var(--radius-soft)] border-0"
          />
        </div>

        <form action={action} className="grid content-start gap-5">
          <h2 className="heading text-3xl">Send a message</h2>
          <FormNotice error={state.error} success={state.success} />
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" required autoComplete="name" className="input" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="input" />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required className="input" />
          </div>
          <SubmitButton className="btn-primary justify-self-start">Send Message</SubmitButton>
        </form>
      </div>
    </div>
  );
}
