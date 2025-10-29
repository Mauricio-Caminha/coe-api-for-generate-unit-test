import { User } from "../models/userModel";

let users: User[] = [];

export const getAllUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((u) => u.id === id);
};

export const createUser = (data: { name?: string; email?: string }): User => {
  const { name, email } = data;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const newUser: User = {
    id: String(users.length + 1),
    name,
    email,
  };

  users.push(newUser);
  return newUser;
};

export const updateUser = (
  id: string,
  data: { name?: string; email?: string }
): User | null => {
  const { name, email } = data;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) return null;

  const existing = users[userIndex];
  const updated: User = {
    ...existing,
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
  };

  users[userIndex] = updated;
  return users[userIndex];
};

export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  users = users.filter((u) => u.id !== id);
  return users.length < initialLength;
};

// For testing purposes you might want to reset or seed users; not exported by default.
