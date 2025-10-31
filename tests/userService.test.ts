import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../src/services/userService';
import type { User } from '../src/models/userModel';

describe('UserService', () => {
  let mockUser: User;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset users array for each test
    // @ts-ignore
    global.users = [];
    mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
  });

  it('should return all users', () => {
    // Arrange
    createUser({ name: 'John Doe', email: 'john@example.com' });
    createUser({ name: 'Jane Doe', email: 'jane@example.com' });

    // Act
    const result = getAllUsers();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining([mockUser]));
  });

  it('should return user by id', () => {
    // Arrange
    createUser({ name: 'John Doe', email: 'john@example.com' });

    // Act
    const result = getUserById('1');

    // Assert
    expect(result).toEqual(mockUser);
  });

  it('should create a new user', () => {
    // Act
    const result = createUser({ name: 'John Doe', email: 'john@example.com' });

    // Assert
    expect(result).toEqual(mockUser);
    expect(getAllUsers()).toHaveLength(1);
  });

  it('should throw error when creating user without name or email', () => {
    // Act & Assert
    expect(() => createUser({ name: '', email: '' })).toThrow('Name and email are required');
  });

  it('should update an existing user', () => {
    // Arrange
    createUser({ name: 'John Doe', email: 'john@example.com' });

    // Act
    const updatedUser = updateUser('1', { name: 'John Smith' });

    // Assert
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe('John Smith');
  });

  it('should return null when updating a non-existing user', () => {
    // Act
    const result = updateUser('999', { name: 'Non-existent User' });

    // Assert
    expect(result).toBeNull();
  });

  it('should delete an existing user', () => {
    // Arrange
    createUser({ name: 'John Doe', email: 'john@example.com' });

    // Act
    const result = deleteUser('1');

    // Assert
    expect(result).toBe(true);
    expect(getAllUsers()).toHaveLength(0);
  });

  it('should return false when deleting a non-existing user', () => {
    // Act
    const result = deleteUser('999');

    // Assert
    expect(result).toBe(false);
  });
});