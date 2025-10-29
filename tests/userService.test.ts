import { describe, it, expect, beforeEach } from 'vitest';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../src/services/userService';
import type { User } from '../src/models/userModel';

describe('UserService', () => {
  let users: User[];

  beforeEach(() => {
    // Reset users before each test
    users = [];
  });

  it('should return an empty array when no users exist', () => {
    const result = getAllUsers();
    expect(result).toEqual([]);
  });

  it('should return undefined when user does not exist', () => {
    const result = getUserById('1');
    expect(result).toBeUndefined();
  });

  it('should create a new user', () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const result = createUser(userData);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('should throw an error when creating a user without name or email', () => {
    expect(() => createUser({ name: '', email: '' })).toThrow('Name and email are required');
  });

  it('should update an existing user', () => {
    const userData = { name: 'Jane Doe', email: 'jane@example.com' };
    const createdUser = createUser(userData);
    const updatedUser = updateUser(createdUser.id, { name: 'Jane Smith' });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe('Jane Smith');
  });

  it('should return null when updating a user that does not exist', () => {
    const result = updateUser('non-existent-id', { name: 'New Name' });
    expect(result).toBeNull();
  });

  it('should delete an existing user', () => {
    const userData = { name: 'Mark Doe', email: 'mark@example.com' };
    const createdUser = createUser(userData);
    const result = deleteUser(createdUser.id);
    expect(result).toBe(true);
    expect(getUserById(createdUser.id)).toBeUndefined();
  });

  it('should return false when deleting a user that does not exist', () => {
    const result = deleteUser('non-existent-id');
    expect(result).toBe(false);
  });
});