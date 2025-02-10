"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";
import { z } from "zod";

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
  companyRegistrationNo: z.string().nonempty("Company registration number is required"),
  address: z.string().nonempty("Address is required"),
  bidderType: z.enum(["BUYER", "SELLER"]),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  postalCode: z.string().nonempty("Postal code is required"),
  establishmentYear: z.string().nonempty("Establishment year is required"),
  natureOfBusiness: z.string().nonempty("Nature of business is required"),
  panTanNo: z.string().nonempty("PAN/TAN number is required"),
  contactName: z.string().nonempty("Contact name is required"),
  contactPhoneNo: z.string().nonempty("Contact phone number is required"),
  designation: z.string().nonempty("Designation is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const initialFormState = {
    companyName: "",
    email: "",
    phoneNo: "",
    companyRegistrationNo: "",
    address: "",
    bidderType: "BUYER",
    city: "",
    state: "",
    postalCode: "",
    establishmentYear: "",
    natureOfBusiness: "",
    panTanNo: "",
    contactName: "",
    contactPhoneNo: "",
    designation: "",
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
      setError(validation.error.errors.map(err => err.message).join(", "));
      setLoading(false);
      return;
    }

    try {
      const response = (await axios.post<RegisterResponse>(
        "/api/auth/register",
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
        <select
          name="bidderType"
          onChange={handleChange}
          value={form.bidderType}
          className="w-full p-2 border rounded"
        >
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
        </select>
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
          name="designation"
          placeholder="Designation"
          onChange={handleChange}
          value={form.designation}
          className="w-full p-2 border rounded"
          required
        />
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