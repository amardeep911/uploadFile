"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { sendContactForm } from "../../lib/api";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

type Inputs = {
  name: string;
  email: string;
  message: string;
};

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data, event: any) => {
    setLoading(true);
    setError(null);
    setTimeout(async () => {
      try {
        await sendContactForm(data);
        // Reset the form after successful submission
        event.target.reset(); // Reset the form using the event object
        // Alternatively, you can use the reset function provided by react-hook-form
        // reset(); // Assuming you have a reset function from useForm hook
      } catch (error) {
        setError("An error occurred while submitting the form.");
      } finally {
        // Clear loading state after delay
        setLoading(false);
        toast.success("Message Sent Successfully");
      }
    }, 2000); // Set the delay to 2000 milliseconds (2 seconds)
  };

  return (
    <MaxWidthWrapper className="p-5 ">
      <Toaster richColors />
      <section className="grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-10 sm:h-full h-fit w-full">
        <div className="flex flex-col text-sm justify-center sm:gap-20 gap-5 items-start sm:h-screen h-fit">
          <div className="flex flex-col sm:gap-5 gap-2  text-muted-foreground sm:text-lg text-sm">
            <h2 className="text-2xl sm:text-5xl tracking-tight font-medium text-gray-900">
              Contact Us
            </h2>
            <p>
              Email, call, or fill out the form below to get in touch with us.
              We can solve your problems and help you grow your business.
            </p>
            <p>contact@builderx100.com</p>
            <p>+91 8016313103</p>
          </div>
          <div className="flex min-w-full sm:flex-row flex-col justify-between gap-5 text-start text-muted-foreground">
            <div>
              <h3 className="text-xl sm:text-sm tracking-tight font-medium text-gray-900">
                Customer Support
              </h3>
              <p className="text-sm">
                Our support team is available around the clock to help you with
                any issues you may have.
              </p>
            </div>
            <div>
              {" "}
              <h3 className="text-xl sm:text-sm tracking-tight font-medium text-gray-900">
                Feedback and Suggestions
              </h3>
              <p className="text-sm">
                We are always open to feedback and suggestions. Let us know how
                we can improve our services.
              </p>
            </div>
            <div>
              {" "}
              <h3 className="text-xl sm:text-sm tracking-tight font-medium text-gray-900">
                Media inquiries
              </h3>
              <p className="text-sm">
                For media inquiries, please contact us at the following email
                address.
              </p>
            </div>
          </div>
        </div>
        {/* //down part */}
        <section className="w-full sm:h-full h-fit flex justify-center items-center align-middle sm:p-8 p-5 bg-[#e8f0ff] ">
          <div className="w-full p-5 h-fit border bg-white rounded-2xl shadow-lg">
            {/* heading */}
            <div>
              <h2 className="text-2xl sm:text-4xl tracking-tight font-semibold text-gray-900">
                Get in touch
              </h2>
              <p className="text-muted-foreground text-sm tracking-tight">
                you can reach us at anytime
              </p>
            </div>
            {/* form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mt-6"
            >
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border rounded-3xl"
                id="name"
                {...register("name", { required: true })}
              />
              <div className="text-red-500">
                {errors.name && "Name is required"}
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-3xl"
                id="email"
                {...register("email", { required: true })}
              />
              <div className="text-red-500">
                {errors.email && "Email is required"}
              </div>

              <textarea
                placeholder="Message"
                className="w-full p-3 border rounded-xl "
                id="message"
                {...register("message", { required: true })}
              />
              <div className="text-red-500">
                {errors.message && "Message is required"}
              </div>
              <button
                className={`p-3 rounded-lg ${
                  loading
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-700 text-white"
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
              {/* Error Message */}
              {error && <div className="text-red-500">{error}</div>}
              {/* terms */}
              <div className=" flex  items-center justify-center align-middle ">
                <div className=" w-9/12 text-muted-foreground text-xs text-center">
                  By submitting this form, you agree to our{" "}
                  <span className="text-black">Terms of Service</span> and
                  <span className="text-black"> Privacy Policy</span>.
                </div>
              </div>
            </form>
          </div>
        </section>
      </section>
    </MaxWidthWrapper>
  );
};

export default Page;
