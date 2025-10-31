import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../src/controllers/userController';
import * as userService from '../src/services/userService';
import type { User } from '../src/models/userModel';

vi.mock('../src/services/userService');

describe('UserController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return users when getUsers is called', () => {
    // Arrange
    const mockUsers: User[] = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
    (userService.getAllUsers as vi.Mock).mockReturnValue(mockUsers);
    const req = {} as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    getUsers(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('should return user when getUserById is called with existing id', () => {
    // Arrange
    const mockUser: User = { id: '1', name: 'John Doe', email: 'john@example.com' };
    (userService.getUserById as vi.Mock).mockReturnValue(mockUser);
    const req = { params: { id: '1' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    getUserById(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 when getUserById is called with non-existing id', () => {
    // Arrange
    (userService.getUserById as vi.Mock).mockReturnValue(null);
    const req = { params: { id: '999' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    getUserById(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should create user when createUser is called with valid data', () => {
    // Arrange
    const newUser: User = { id: '2', name: 'Jane Doe', email: 'jane@example.com' };
    (userService.createUser as vi.Mock).mockReturnValue(newUser);
    const req = { body: { name: 'Jane Doe', email: 'jane@example.com' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    createUser(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });

  it('should return 400 when createUser is called with invalid data', () => {
    // Arrange
    (userService.createUser as vi.Mock).mockImplementation(() => {
      throw new Error('Invalid data');
    });
    const req = { body: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    createUser(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
  });

  it('should update user when updateUser is called with valid id', () => {
    // Arrange
    const updatedUser: User = { id: '1', name: 'John Smith', email: 'johnsmith@example.com' };
    (userService.updateUser as vi.Mock).mockReturnValue(updatedUser);
    const req = { params: { id: '1' }, body: { name: 'John Smith', email: 'johnsmith@example.com' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    updateUser(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  it('should return 404 when updateUser is called with non-existing id', () => {
    // Arrange
    (userService.updateUser as vi.Mock).mockReturnValue(null);
    const req = { params: { id: '999' }, body: { name: 'John Smith', email: 'johnsmith@example.com' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    updateUser(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should delete user when deleteUser is called with existing id', () => {
    // Arrange
    (userService.deleteUser as vi.Mock).mockReturnValue(true);
    const req = { params: { id: '1' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    // Act
    deleteUser(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should return 404 when deleteUser is called with non-existing id', () => {
    // Arrange
    (userService.deleteUser as vi.Mock).mockReturnValue(false);
    const req = { params: { id: '999' } } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Act
    deleteUser(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});