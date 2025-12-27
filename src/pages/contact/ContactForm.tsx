import type { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ContactFormProps {
  form: UseFormReturn<{
    name: string;
    email: string;
    organizationName: string;
    message: string;
  }>;
  onSubmit: (values: {
    name: string;
    email: string;
    organizationName: string;
    message: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const ContactForm = ({
  form,
  onSubmit,
  isLoading,
  error,
}: ContactFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-semibold">Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-semibold">Work Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="john@company.com"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-semibold">Organization Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your Company"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-semibold">Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us about your needs and how we can help..."
                  rows={4}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
};
