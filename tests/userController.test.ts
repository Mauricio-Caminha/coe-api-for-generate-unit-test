import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../src/controllers/userController';
import * as userService from '../src/services/userService';
import type { User } from '../src/models/userModel';

vi.mock('../src/services/userService');

describe('UserController', () => {
  const mockResponse = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all users', () => {
    const req = {};
    const res = mockResponse();
    const mockUsers: User[] = [{ id: '1', name: 'John', email: 'john@example.com' }];

    vi.mocked(userService.getAllUsers).mockReturnValue(mockUsers);

    getUsers(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('should return user by id when user exists', () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();
    const mockUser: User = { id: '1', name: 'John', email: 'john@example.com' };

    vi.mocked(userService.getUserById).mockReturnValue(mockUser);

    getUserById(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 when user not found', () => {
    const req = { params: { id: '2' } };
    const res = mockResponse();

    vi.mocked(userService.getUserById).mockReturnValue(null);

    getUserById(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should create a new user', () => {
    const req = { body: { name: 'John', email: 'john@example.com' } };
    const res = mockResponse();
    const newUser: User = { id: '1', name: 'John', email: 'john@example.com' };

    vi.mocked(userService.createUser).mockReturnValue(newUser);

    createUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });

  it('should return 400 for invalid data when creating a user', () => {
    const req = { body: {} };
    const res = mockResponse();

    vi.mocked(userService.createUser).mockImplementation(() => {
      throw new Error('Invalid data');
    });

    createUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
  });

  it('should update user when user exists', () => {
    const req = { params: { id: '1' }, body: { name: 'John Updated', email: 'john.updated@example.com' } };
    const res = mockResponse();
    const updatedUser: User = { id: '1', name: 'John Updated', email: 'john.updated@example.com' };

    vi.mocked(userService.updateUser).mockReturnValue(updatedUser);

    updateUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  it('should return 404 when updating a user not found', () => {
    const req = { params: { id: '2' }, body: { name: 'John Updated' } };
    const res = mockResponse();

    vi.mocked(userService.updateUser).mockReturnValue(null);

    updateUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should delete user when user exists', () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    vi.mocked(userService.deleteUser).mockReturnValue(true);

    deleteUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should return 404 when deleting a user not found', () => {
    const req = { params: { id: '2' } };
    const res = mockResponse();

    vi.mocked(userService.deleteUser).mockReturnValue(false);

    deleteUser(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});