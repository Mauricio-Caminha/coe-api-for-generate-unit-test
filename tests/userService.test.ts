import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../src/services/userService';
import type { User } from '../src/models/userModel';

describe('UserService', () => {
  let users: User[];

  beforeEach(() => {
    // Reset users before each test
    users = [];
  });

  it('should return an empty array when there are no users', () => {
    const result = getAllUsers();
    expect(result).toEqual([]);
  });

  it('should return a user when it exists', () => {
    const user: User = { id: '1', name: 'John Doe', email: 'john@example.com' };
    users.push(user);
    const result = getUserById('1');
    expect(result).toEqual(user);
  });

  it('should return undefined when user does not exist', () => {
    const result = getUserById('non-existent-id');
    expect(result).toBeUndefined();
  });

  it('should create a new user', () => {
    const newUser = createUser({ name: 'Jane Doe', email: 'jane@example.com' });
    expect(newUser).toHaveProperty('id');
    expect(newUser.name).toBe('Jane Doe');
    expect(newUser.email).toBe('jane@example.com');
    expect(getAllUsers()).toContainEqual(newUser);
  });

  it('should throw an error when creating a user without name or email', () => {
    expect(() => createUser({ name: 'John Doe' })).toThrow('Name and email are required');
    expect(() => createUser({ email: 'john@example.com' })).toThrow('Name and email are required');
  });

  it('should update an existing user', () => {
    const user: User = { id: '1', name: 'John Doe', email: 'john@example.com' };
    users.push(user);
    const updatedUser = updateUser('1', { name: 'John Smith' });
    expect(updatedUser).toEqual({ ...user, name: 'John Smith' });
  });

  it('should return null when trying to update a non-existent user', () => {
    const result = updateUser('non-existent-id', { name: 'John Smith' });
    expect(result).toBeNull();
  });

  it('should delete an existing user', () => {
    const user: User = { id: '1', name: 'John Doe', email: 'john@example.com' };
    users.push(user);
    const result = deleteUser('1');
    expect(result).toBe(true);
    expect(getAllUsers()).not.toContainEqual(user);
  });

  it('should return false when trying to delete a non-existent user', () => {
    const result = deleteUser('non-existent-id');
    expect(result).toBe(false);
  });
});