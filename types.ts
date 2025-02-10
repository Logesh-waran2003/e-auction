interface User {
  id: string;
  name: string;
  email: string;
  role: "BUYER" | "SELLER" | "SUPER_ADMIN";
  isApproved: boolean;
}

export type { User };
