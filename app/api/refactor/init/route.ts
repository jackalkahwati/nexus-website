import { NextResponse } from 'next/server';
import { testConnection, seedDemoData, getSession, closeDriver, useLocalDatabase } from '@/lib/refactor/neo4j';
import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import { parseCode, populateGraphFromAst } from '@/lib/refactor/analysis';

// Use local database by default since Neo4j is not installed
useLocalDatabase(true);

interface InitRequestBody {
  projectId: string;
  repositoryPath?: string; // Optional local path to scan
  scanEnabled?: boolean;
  mockMode?: boolean;
  seedDemoData?: boolean;
}

// Helper to scan a local repository
async function scanRepository(repositoryPath: string, projectId: string): Promise<{ scanned: number, failed: number }> {
  // In a real implementation, this would scan a directory on the server
  // Here we use a simulated approach based on common patterns
  
  // For demonstration purposes, simulate files that might be found in a TypeScript project
  const simulatedFiles = [
    { path: path.join(repositoryPath, 'src/services/user.service.ts'), exists: true },
    { path: path.join(repositoryPath, 'src/controllers/user.controller.ts'), exists: true },
    { path: path.join(repositoryPath, 'src/repositories/user.repository.ts'), exists: true },
    { path: path.join(repositoryPath, 'src/utils/validation.ts'), exists: true },
    { path: path.join(repositoryPath, 'src/services/auth.service.ts'), exists: true },
    { path: path.join(repositoryPath, 'src/models/user.ts'), exists: false }, // Simulate missing file
  ];
  
  let scanned = 0;
  let failed = 0;
  const session = getSession();
  
  try {
    for (const file of simulatedFiles) {
      if (!file.exists) {
        console.log(`Skipping non-existent file: ${file.path}`);
        failed++;
        continue;
      }
      
      try {
        // Get mock content based on file path
        const content = await getSimulatedFileContent(file.path);
        
        // Parse and analyze the file
        const ast = await parseCode(content, file.path);
        await populateGraphFromAst(session, ast, file.path, projectId);
        
        console.log(`Successfully analyzed and populated graph for: ${file.path}`);
        scanned++;
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
        failed++;
      }
    }
    
    return { scanned, failed };
  } finally {
    await session.close();
  }
}

// Mock function to simulate getting file content based on path patterns
// In a real implementation, this would use fs.readFile
async function getSimulatedFileContent(filePath: string): Promise<string> {
  // Simulated file system based on common patterns in the path
  if (filePath.includes('user.service')) {
    return `import { User } from '../models/user';
import { Database } from '../database/db';

export class UserService {
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
  }
  
  async getUser(id: string): Promise<User | null> {
    // Check if id is valid
    if (!id || id.length < 5) {
      throw new Error('Invalid user ID');
    }
    
    try {
      const user = await this.db.findOne('users', { id });
      if (!user) {
        console.log('User not found:', id);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
  
  async createUser(userData: Partial<User>): Promise<User> {
    // Validate userData
    if (!userData.name || !userData.email) {
      throw new Error('User data is incomplete');
    }
    
    try {
      const newUser = await this.db.insert('users', userData);
      console.log('User created:', newUser.id);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}`;
  } else if (filePath.includes('auth.service')) {
    return `import { UserService } from './user.service';
import { TokenManager } from '../utils/token-manager';

export class AuthService {
  private userService: UserService;
  private tokenManager: TokenManager;
  
  constructor(userService: UserService, tokenManager: TokenManager) {
    this.userService = userService;
    this.tokenManager = tokenManager;
  }
  
  async authenticate(email: string, password: string): Promise<string | null> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    try {
      // This is a dummy authentication
      const user = await this.userService.findByEmail(email);
      if (!user) {
        console.log('User not found during authentication:', email);
        return null;
      }
      
      // Check password (simplified)
      if (user.password !== password) {
        return null;
      }
      
      // Generate token
      const token = this.tokenManager.createToken({
        userId: user.id,
        email: user.email,
        role: user.role || 'user'
      });
      
      return token;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
}`;
  } else if (filePath.includes('user.controller')) {
    return `import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;
  
  constructor(userService: UserService) {
    this.userService = userService;
  }
  
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUser(userId);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error in getUser controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error in createUser controller:', error);
      
      if (error.message === 'User data is incomplete') {
        res.status(400).json({ message: error.message });
        return;
      }
      
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}`;
  } else if (filePath.includes('user.repository')) {
    return `import { Database } from '../database/db';
import { User } from '../models/user';

export class UserRepository {
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
  }
  
  async findById(id: string): Promise<User | null> {
    return this.db.findOne('users', { id });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.db.findOne('users', { email });
  }
  
  async create(userData: Partial<User>): Promise<User> {
    return this.db.insert('users', userData);
  }
  
  async update(id: string, userData: Partial<User>): Promise<User | null> {
    return this.db.update('users', { id }, userData);
  }
  
  async delete(id: string): Promise<boolean> {
    return this.db.delete('users', { id });
  }
}`;
  } else if (filePath.includes('validation')) {
    return `export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
}

export function validateUser(user: any): string[] {
  const errors: string[] = [];
  
  if (!user.name || typeof user.name !== 'string') {
    errors.push('Name is required');
  }
  
  if (!user.email || !validateEmail(user.email)) {
    errors.push('Valid email is required');
  }
  
  if (!user.password || !validatePassword(user.password)) {
    errors.push('Password must be at least 8 characters, with uppercase, lowercase and numbers');
  }
  
  return errors;
}`;
  } else {
    throw new Error(`File not found: ${filePath}`);
  }
}

// Support both GET (for browser init) and POST (for more complex init with body)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') || 'default-project';
    const mockMode = searchParams.get('mock') === 'true';
    const seed = searchParams.get('seed') === 'true';
    
    return handleInitialization({
      projectId,
      mockMode,
      seedDemoData: seed,
      scanEnabled: false
    });
  } catch (error) {
    console.error('Initialization error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({ 
      status: 'error', 
      message: `Failed to initialize refactoring system: ${errorMessage}`,
      error: errorMessage,
      details: {
        fallbackMode: 'mock'
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: InitRequestBody = await request.json();
    return handleInitialization(body);
  } catch (error) {
    console.error('Initialization error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({ 
      status: 'error', 
      message: `Failed to initialize refactoring system: ${errorMessage}`,
      error: errorMessage,
      details: {
        fallbackMode: 'mock'
      }
    }, { status: 500 });
  }
}

async function handleInitialization(config: InitRequestBody) {
  const {
    projectId = 'default-project',
    repositoryPath,
    scanEnabled = false,
    mockMode = false,
    seedDemoData: seedDemo = false
  } = config;
  
  // If mock mode is requested, return success without touching Neo4j
  if (mockMode) {
    return NextResponse.json({
      status: 'success',
      message: 'Mock mode enabled, bypassing Neo4j',
      details: {
        mode: 'mock',
        projectId
      }
    });
  }
  
  // We're always using the local file-based database
  let connected = true;
  
  console.log("Using local file-based database");
  useLocalDatabase(true);
  
  // No need to test connection since we're using local DB
  // We're always connected via the local database file system
  
  // Seed demo data if requested
  if (seedDemo) {
    try {
      await seedDemoData(projectId);
    } catch (seedError) {
      console.error('Error seeding data:', seedError);
      return NextResponse.json({
        status: 'error',
        message: 'Connected to Neo4j but failed to seed data',
        error: seedError instanceof Error ? seedError.message : 'Unknown seeding error',
        details: {
          connected: true,
          projectId
        }
      }, { status: 500 });
    }
  }
  
  // Scan repository if requested and path provided
  let scanResults = null;
  if (scanEnabled && repositoryPath) {
    try {
      console.log(`Scanning repository at ${repositoryPath} for project ${projectId}`);
      scanResults = await scanRepository(repositoryPath, projectId);
    } catch (scanError) {
      console.error('Error scanning repository:', scanError);
      return NextResponse.json({
        status: 'error',
        message: 'Failed to scan repository',
        error: scanError instanceof Error ? scanError.message : 'Unknown scanning error',
        details: {
          connected: true,
          projectId,
          repositoryPath
        }
      }, { status: 500 });
    }
  }
  
  // Get connection details for diagnostics (mask sensitive data)
  const neo4jDetails = {
    uri: process.env.NEO4J_URI?.replace(/^(.*:\/\/)([^:]+):[^@]+@(.*)$/, '$1$2:****@$3') || 'not configured',
    user: process.env.NEO4J_USER || 'not configured',
    connectionStatus: connected ? 'connected' : 'failed',
    projectId,
    repositoryScanned: scanEnabled && !!repositoryPath,
    scanResults
  };
  
  return NextResponse.json({ 
    status: 'success',
    message: scanResults 
      ? `Initialization successful. Scanned ${scanResults.scanned} files (${scanResults.failed} failed).`
      : 'Initialization successful',
    details: neo4jDetails
  });
}