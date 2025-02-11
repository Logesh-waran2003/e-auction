"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";
import { z } from "zod";
import { User } from "@/types";

interface ErrorResponse {
  message: string;
}

interface RegisterResponse {
  message: string;
  user: User; // Replace `any` with the actual user type if known
}

const registerSchema = z.object({
  companyName: z.string().nonempty("Company name is required"),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().nonempty("Phone number is required"),
  companyRegistrationNo: z
    .string()
    .nonempty("Company registration number is required"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  postalCode: z.string().nonempty("Postal code is required"),
  establishmentYear: z.string().nonempty("Establishment year is required"),
  natureOfBusiness: z.string().nonempty("Nature of business is required"),
  panTanNo: z.string().nonempty("PAN/TAN number is required"),
  contactName: z.string().nonempty("Contact name is required"),
  contactPhoneNo: z.string().nonempty("Contact phone number is required"),
  country: z.string().nonempty("Country is required"),
  dob: z.string().nonempty("Date of Birth is required"),
  taxId: z.string().nonempty("Tax ID is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const initialFormState = {
    companyName: "",
    email: "",
    phoneNo: "",
    companyRegistrationNo: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    establishmentYear: "",
    natureOfBusiness: "",
    panTanNo: "",
    contactName: "",
    contactPhoneNo: "",
    country: "",
    dob: "",
    taxId: "",
  };
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validation = registerSchema.safeParse(form);
    if (!validation.success) {
      console.log("validation.error: ", validation);
      setError(validation.error.errors.map((err) => err.message).join(", "));
      setLoading(false);
      return;
    }

    try {
      const response = (await axios.post<RegisterResponse>(
        "/api/auth/seller-register",
        form
      )) as AxiosResponse<RegisterResponse>;
      console.log("response.data: ", response.data);
      alert(response.data.message);
      setUser(response.data.user);
      router.push("/login");
    } catch (err: unknown) {
      const errorResponse = (err as AxiosError<ErrorResponse>).response?.data;
      setError(errorResponse?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <button
        onClick={() => router.push("/login")}
        className="text-blue-500 mb-4"
      >
        ← Back to Login
      </button>
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          value={form.companyName}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          onChange={handleChange}
          value={form.phoneNo}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="companyRegistrationNo"
          placeholder="Company Registration No"
          onChange={handleChange}
          value={form.companyRegistrationNo}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          value={form.address}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          value={form.city}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={handleChange}
          value={form.state}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          onChange={handleChange}
          value={form.postalCode}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="establishmentYear"
          placeholder="Establishment Year"
          onChange={handleChange}
          value={form.establishmentYear}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="natureOfBusiness"
          placeholder="Nature of Business"
          onChange={handleChange}
          value={form.natureOfBusiness}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="panTanNo"
          placeholder="PAN/TAN No"
          onChange={handleChange}
          value={form.panTanNo}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="contactName"
          placeholder="Contact Name"
          onChange={handleChange}
          value={form.contactName}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="contactPhoneNo"
          placeholder="Contact Phone No"
          onChange={handleChange}
          value={form.contactPhoneNo}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={handleChange}
          value={form.country}
          className="w-full p-2 border rounded"
          required
        />
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="dob"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date of Birth
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="dob"
                id="dob"
                value={form.dob}
                onChange={handleChange}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="taxId"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tax ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="taxId"
                id="taxId"
                value={form.taxId}
                onChange={handleChange}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded mr-2"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-500 text-white p-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
