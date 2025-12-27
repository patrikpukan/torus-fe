import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ContactForm } from "./ContactForm";
import { ContactFooter } from "./ContactSections";
import { SuccessScreen } from "./SuccessScreen";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  organizationName: z.string().min(1, "Organization name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      organizationName: "",
      message: "",
    },
    mode: "onBlur",
  });

  const handleSubmit = async (values: ContactFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to send contact form
      // const response = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(values),
      // });
      // if (!response.ok) throw new Error("Failed to send message");

      // For now, just log the values
      console.log("Contact form submitted:", values);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
      form.reset();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted px-4 py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Contact Sales</CardTitle>
            <CardDescription>
              Tell us about your organization and we'll be in touch
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ContactForm
              form={form}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>

        <ContactFooter />
      </div>
    </div>
  );
};

export default ContactPage;
