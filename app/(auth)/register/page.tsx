"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";
import Link from "next/link";

interface ErrorResponse {
  message: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log("form: ", form);
  }, [form]);

  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Register as Buyer</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">Are you a seller?</p>
        <Link
          href="/sellerRegister"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Register as Seller
        </Link>
      </div>
    </div>
  );
}
