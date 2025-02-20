"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);


interface UploadResponse {
  success: boolean;
  paths?: string[];
  error?: string;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startPrice: z.number().min(1, "Starting price must be greater than 0"),
  endTime: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, "End time must be in the future"),
  images: z
    .array(z.any())
    .refine((files) => files.every((file) => file instanceof File), 'Invalid file format')
    .refine((files) => files.length >= 1, 'At least one image is required')
    .refine((files) => files.every((file) => file.size <= 4 * 1024 * 1024), 'File size must be less than 4MB'),
});

type FormData = z.infer<typeof formSchema>;

export function CreateAuctionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startPrice: 0,
      endTime: "",
      images: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Upload images
      const uploadFormData = new FormData();
      data.images.forEach((file: File) => uploadFormData.append('files', file));

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images');
      }

      const uploadResult: UploadResponse = await uploadResponse.json();
      const imagePaths = uploadResult.paths;

      // Submit auction data
      const auctionResponse = await fetch('/api/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images: imagePaths,
          startPrice: Number(data.startPrice),
        }),
      });

      if (!auctionResponse.ok) {
        const errorData = await auctionResponse.json();
        throw new Error(errorData.error || "Failed to create auction");
      }

      toast.success("Auction created successfully!");
      router.push("/auctions");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

{/*Return the tailwindcss */}

  return (
    
    <Card className="bg-white opacity-70 font-montserrat text-red-500  shadow-lg rounded-lg w-1/2 mx-auto block">
  <div >
      <CardHeader >
        <CardTitle className="text-green-700 text-3xl opacity-100 underline font-extrabold p-2">Create New Auction</CardTitle>
        {/* <CardDescription className="text-2xl">
          Fill in the details below to create your auction. All fields are
          required.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-3xl text-black opacity-100 font-extrabold
">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter auction title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
  control={form.control}
  name="startPrice"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Starting Price ($)</FormLabel>
      <FormControl>
        <NumericFormat
          thousandSeparator={true} // Adds commas automatically
          allowNegative={false}    // Prevents negative values
          prefix={"$"}             // Adds "$" prefix
          decimalScale={2}         // Limits to 2 decimal places
          fixedDecimalScale={true} // Always show 2 decimal places
          customInput={Input}      // Uses your existing Input component
          value={field.value}      // Ensures integration with React Hook Form
          onValueChange={(values) => field.onChange(values.value)} 
          placeholder="$ 0.00"// Pass only the numeric value
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

          <FormField
  control={form.control}
  name="endTime"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="p-2">End Time</FormLabel>
      <FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <DateTimePicker
                label="Select End Time"
                value={field.value ? dayjs(field.value) : null} // Ensure proper parsing
                onChange={(newValue) => {
                  if (newValue) {
                    const formattedDate = dayjs(newValue).format("MMMM D, YYYY, h:mm A");
                    field.onChange(formattedDate);
                  }
                }}
                disablePast // ✅ Blocks past dates
                shouldDisableTime={(timeValue, clockType) => {
                  const now = dayjs();
                  const selectedDate = field.value ? dayjs(field.value) : null;

                  // Disable past hours and minutes for today
                  if (selectedDate && selectedDate.isSame(now, "day")) {
                    if (clockType === "hours" && timeValue < now.hour()) return true;
                    if (clockType === "minutes" && selectedDate.hour() === now.hour() && timeValue < now.minute()) return true;
                  }
                  return false;
                }}
                ampm // ✅ Enables 12-hour format with AM/PM
                format="MMMM D, YYYY, h:mm A"
                slotProps={{ textField: { variant: "outlined" } }}
              />
            )}
          />
        </LocalizationProvider>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auction Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-black text-white" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </div>
              ) : (
                "Create Auction"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      </div>
    </Card>
    
  );
}
