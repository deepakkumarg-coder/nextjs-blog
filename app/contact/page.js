


"use client";

import { useState ,useEffect } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");


  {/*This is set the tab name */ }
  useEffect(() => {
    document.title = " Contact  | Page"
  }, [])

  // -----------------------------------
  // Validate one field
  // -----------------------------------
  const validateField = (fieldName, value) => {
    const trimmedValue = value.trim();

    if (fieldName === "name") {
      if (trimmedValue === "") {
        return "Name is required.";
      }

      if (trimmedValue.length < 3) {
        return "Name must contain at least 3 characters.";
      }

      if (trimmedValue.length > 50) {
        return "Name cannot exceed 50 characters.";
      }

      if (!/^[A-Za-z ]+$/.test(trimmedValue)) {
        return "Name can contain only letters and spaces.";
      }
    }

    if (fieldName === "email") {
      if (trimmedValue === "") {
        return "Email is required.";
      }

      if (trimmedValue.length > 254) {
        return "Email cannot exceed 254 characters.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
        return "Please enter a valid email address.";
      }
    }

    if (fieldName === "message") {
      if (trimmedValue === "") {
        return "Message is required.";
      }

      if (trimmedValue.length < 10) {
        return "Message must contain at least 10 characters.";
      }

      if (trimmedValue.length > 1000) {
        return "Message cannot exceed 1000 characters.";
      }
    }

    return "";
  };

  // -----------------------------------
  // Handle input changes
  // -----------------------------------
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    // Update form data
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Validate the current field
    const errorMessage = validateField(name, value);

    // Update only the current field's error
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: errorMessage,
    }));

    // Clear old messages while typing
    setSuccess("");
    setApiError("");
  };

  // -----------------------------------
  // Check whether the form is valid
  // -----------------------------------
  const isFormValid =
    Object.values(formData).every(
      (value) => value.trim() !== ""
    ) &&
    Object.values(errors).every(
      (error) => error === ""
    );

  // -----------------------------------
  // Handle form submission
  // -----------------------------------
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Extra protection
    if (!isFormValid) {
      return;
    }

    setLoading(true);
    setSuccess("");
    setApiError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit contact form.");
      }

      setSuccess("Your message has been sent successfully!");

      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });

      // Clear errors
      setErrors({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setApiError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Get in touch
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Contact Us
          </h1>

          <p className="mt-4 text-slate-300">
            Have a question or feedback? Send us a message.
          </p>
        </div>

        <form
          onSubmit={handleFormSubmit}
          noValidate
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          {/* Name field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter your name"
              maxLength={50}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full rounded-lg border bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 ${errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/10 focus:border-blue-500"
                }`}
            />

            {errors.name && (
              <p
                id="name-error"
                className="mt-2 text-sm text-red-400"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Enter your email"
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full rounded-lg border bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 ${errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/10 focus:border-blue-500"
                }`}
            />

            {errors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm text-red-400"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Message field */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-slate-200"
              >
                Message
              </label>

              <span className="text-xs text-slate-400">
                {formData.message.length}/1000
              </span>
            </div>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              placeholder="Write your message..."
              rows={6}
              maxLength={1000}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? "message-error" : undefined
              }
              className={`w-full resize-none rounded-lg border bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 ${errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/10 focus:border-blue-500"
                }`}
            />

            {errors.message && (
              <p
                id="message-error"
                className="mt-2 text-sm text-red-400"
              >
                {errors.message}
              </p>
            )}
          </div>

          {/* Success message */}
          {success && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
            >
              {success}
            </div>
          )}

          {/* API error message */}
          {apiError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {apiError}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full rounded-lg px-5 py-3 font-semibold transition ${!isFormValid || loading
                ? "cursor-not-allowed bg-slate-700 text-slate-400"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {/* Form status */}
          <p className="mt-4 text-center text-xs text-slate-500">
            All fields are required.
          </p>
        </form>
      </section>
    </main>
  );
}