import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

export const TestFormDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Test Dialog</DialogTitle>
        <DialogDescription>
          This is a test dialog with form...
        </DialogDescription>
        <TestForm />
      </DialogContent>
    </Dialog>
  );
};

// form should always be written in separate component like below and not directly inside dialog
// as form initialization should happen after dialog is opened and shouls unmount when dialog closes

// formschema

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(1),
});

type FormType = z.infer<typeof formSchema>;

const TestForm = () => {
  // Define form.
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Define a submit handler.
  const handleFormSubmit = form.handleSubmit((values) => {
    // Do something with the form values.
    console.log(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSelect />
        <DialogClose asChild>
          <Button type="submit">Submit</Button>
        </DialogClose>
      </form>
    </Form>
  );
};

const FormSelect = () => {
  const form = useFormContext<FormType>();

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="m@example.com">m@example.com</SelectItem>
              <SelectItem value="m@google.com">m@google.com</SelectItem>
              <SelectItem value="m@support.com">m@support.com</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
