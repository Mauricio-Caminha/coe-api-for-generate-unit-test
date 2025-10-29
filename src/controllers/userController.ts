import { Request, Response } from "express";
import { User } from "../models/userModel";
import * as userService from "../services/userService";

export const getUsers = (req: Request, res: Response) => {
  const users: User[] = userService.getAllUsers();
  res.status(200).json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = userService.getUserById(id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const createUser = (req: Request, res: Response) => {
  try {
    const newUser = userService.createUser({
      name: req.body.name,
      email: req.body.email,
    });
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Invalid data" });
  }
};

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const updated = userService.updateUser(id, { name, email });

  if (updated) {
    res.status(200).json(updated);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = userService.deleteUser(id);

  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
