export const user_role = {
  admin: "admin",
  user: "user",
  agent: "agent",
} as const;

export type Roles = "admin" | "user" | "agent";
