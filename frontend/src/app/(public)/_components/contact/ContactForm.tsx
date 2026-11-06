"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Mountain, Send } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createEnquiry, getEnquiryTripOptions } from "@/lib/api/enquiries";
import { getErrorMessage } from "@/utils/error";
import PolicyLink from "@/components/PolicyLink";
import { privacyPolicy } from "@/lib/privacy-policy";
import BookingPolicyDownloads from "../BookingPolicyDownloads";

import { contactSchema, toEnquiryInput, type ContactFormValues } from "@/types/contact-schema";

const defaults: ContactFormValues = {
  category: "general",
  trip: "",
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};
const inputClass =
  "w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-orange-600 aria-invalid:border-red-600";
const collaborationTopic = "Company / NGO collaboration";
const topics = [
  "Booking and availability",
  "Custom itinerary",
  "Gear and preparation",
  "School or corporate group",
  collaborationTopic,
  "Other enquiry",
];

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-800">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-orange-700">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({
  collaboration = false,
  selectedTrip,
}: {
  collaboration?: boolean;
  selectedTrip?: { value: string; name: string };
}) {
  const initialValues: ContactFormValues = selectedTrip
    ? {
        ...defaults,
        category: "trip",
        trip: selectedTrip.value,
        subject: "Booking and availability",
      }
    : collaboration
      ? { ...defaults, subject: collaborationTopic }
      : defaults;
  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialValues,
  });
  const category = useWatch({ control, name: "category" });
  const tripValue = useWatch({ control, name: "trip" });
  const tripOptions = useQuery({
    queryKey: ["public", "enquiry-trip-options"],
    queryFn: ({ signal }) => getEnquiryTripOptions(signal),
    enabled: category === "trip",
  });

  function changeCategory(next: ContactFormValues["category"]) {
    if (next === category) return;
    setValue("category", next);
    setValue("trip", "");
    clearErrors("trip");
  }

  async function submit(values: ContactFormValues) {
    try {
      const result = await createEnquiry(toEnquiryInput(values));
      toast.success(result.message || "Your enquiry was received.");
      reset(initialValues);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <Card
      id="enquiry-form"
      className="scroll-mt-6 gap-3 rounded-xl border border-stone-200 bg-[#fffefa] p-4 text-slate-900 ring-0! sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="section-heading-accent font-heading text-3xl font-bold tracking-tight">
          Dispatch an Inquiry
        </h2>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide text-sky-800 uppercase">
          Enquiry desk
        </span>
      </div>
      <p className="text-sm text-slate-600">
        Send your trip or general enquiry to the Almora team.
      </p>
      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        aria-busy={isSubmitting}
        aria-describedby="contact-privacy"
      >
        <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
          <legend className="sr-only">Enquiry details</legend>
          <div role="group" aria-label="Enquiry type" className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={category === "trip"}
              onClick={() => changeCategory("trip")}
              className="rounded-lg aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-[#ffffff]"
            >
              <Mountain aria-hidden="true" /> Trek / Expedition / Trip Query
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={category === "general"}
              onClick={() => changeCategory("general")}
              className="rounded-lg aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-[#ffffff]"
            >
              General Query
            </Button>
          </div>
          {category === "trip" && (
            <Field
              id="contact-trip"
              label="Trek, Expedition or Trip"
              required
              error={errors.trip?.message}
            >
              <select
                id="contact-trip"
                required
                {...register("trip")}
                value={tripValue}
                aria-invalid={Boolean(errors.trip)}
                aria-describedby={errors.trip ? "contact-trip-error" : undefined}
                disabled={tripOptions.isPending || tripOptions.isError}
                className={inputClass}
              >
                <option value="">
                  {tripOptions.isPending ? "Loading routes…" : "Select a published route"}
                </option>
                {selectedTrip &&
                  !tripOptions.data?.some(({ kind, trips }) =>
                    trips.some(({ id }) => `${kind}:${id}` === selectedTrip.value),
                  ) && <option value={selectedTrip.value}>{selectedTrip.name}</option>}
                {tripOptions.data?.map(
                  ({ kind, trips }) =>
                    trips.length > 0 && (
                      <optgroup
                        key={kind}
                        label={
                          kind === "treks" ? "Treks" : kind === "trips" ? "Trips" : "Expeditions"
                        }
                      >
                        {trips.map(({ id, name }) => (
                          <option key={id} value={`${kind}:${id}`}>
                            {name}
                          </option>
                        ))}
                      </optgroup>
                    ),
                )}
              </select>
              {tripOptions.isError && (
                <p role="alert" className="text-xs text-red-700">
                  Couldn’t load routes.{" "}
                  <button
                    type="button"
                    onClick={() => void tripOptions.refetch()}
                    disabled={tripOptions.isFetching}
                    className="font-bold underline"
                  >
                    Try again
                  </button>
                </p>
              )}
              {tripOptions.isSuccess && tripOptions.data.every(({ trips }) => !trips.length) && (
                <p className="text-xs text-slate-600">
                  No published routes are available. You can send a general enquiry.
                </p>
              )}
            </Field>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="contact-name" label="Full Name" required error={errors.name?.message}>
              <input
                id="contact-name"
                autoComplete="name"
                maxLength={150}
                placeholder="Your full name"
                required
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className={inputClass}
              />
            </Field>
            <Field id="contact-email" label="Email Address" required error={errors.email?.message}>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                maxLength={255}
                placeholder="you@example.com"
                required
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                className={inputClass}
              />
            </Field>
          </div>
          <Field
            id="contact-phone"
            label="Phone / WhatsApp (optional)"
            error={errors.phone?.message}
          >
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              placeholder="+91 98765 43210"
              {...register("phone")}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
              className={inputClass}
            />
          </Field>
          <Field
            id="contact-subject"
            label="Subject / Query Topic"
            required
            error={errors.subject?.message}
          >
            <select
              id="contact-subject"
              required
              {...register("subject")}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
              className={inputClass}
            >
              <option value="">Select your enquiry topic</option>
              {topics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </Field>
          <Field
            id="contact-message"
            label="Message / Inquiry Details"
            required
            error={errors.message?.message}
          >
            <textarea
              id="contact-message"
              rows={5}
              maxLength={5000}
              placeholder="How can our Almora team help you?"
              required
              {...register("message")}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={`${inputClass} resize-y`}
            />
          </Field>
          <BookingPolicyDownloads />
          <p id="contact-privacy" className="text-xs leading-relaxed text-slate-600">
            We use the details you share to respond to your enquiry and coordinate the services you
            request. Our{" "}
            <PolicyLink
              policy={privacyPolicy.id}
              className="font-semibold text-orange-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              Privacy Policy
            </PolicyLink>{" "}
            explains how we handle your information and your privacy rights. For privacy-related
            requests, email{" "}
            <a
              href="mailto:rocklizardalmora@gmail.com"
              className="break-all font-medium underline underline-offset-4"
            >
              rocklizardalmora@gmail.com
            </a>
            .
          </p>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-lg bg-orange-500 px-4 font-bold text-[#ffffff] hover:bg-orange-400"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" /> Sending…
              </>
            ) : (
              <>
                Send Message <Send aria-hidden="true" />
              </>
            )}
          </Button>
        </fieldset>
      </form>
    </Card>
  );
}
