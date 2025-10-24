import { Request, Response } from 'express';
import { User } from '../models/userModel';

let users: User[] = [];

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const createUser = (req: Request, res: Response) => {
  const newUser: User = {
    id: String(users.length + 1),
    name: req.body.name,
    email: req.body.email,
  };

  if (!newUser.name || !newUser.email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], name, email };
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);

  if (users.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
