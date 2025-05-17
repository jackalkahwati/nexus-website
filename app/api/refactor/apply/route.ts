import { NextResponse } from 'next/server';
import * as parser from '@typescript-eslint/typescript-estree';
import { TSESTree } from '@typescript-eslint/typescript-estree';
import { getSession } from '@/lib/refactor/neo4j';
import * as fs from 'fs/promises';
import * as path from 'path';
import { difference } from 'diff';

// Define file structure to store in memory when refactoring
interface FileInfo {
  path: string;
  content: string;
  ast?: parser.TSESTreeOptions;
}

interface RefactorRequestBody {
  projectId: string;
  selectedNodeIds: string[];
  instructions: string;
  context: any;
}

interface FileDiff {
  fileName: string;
  oldCode: string;
  newCode: string;
}

// Helper to get real file path from node properties
const getFilePathFromNode = (node: any): string | null => {
  if (node?.properties?.path) {
    return node.properties.path;
  }
  return null;
};

// Process files for selected nodes
async function loadFilesForNodes(context: any): Promise<Map<string, FileInfo>> {
  const fileMap = new Map<string, FileInfo>();
  
  // Get unique file paths from nodes
  const filePaths = new Set<string>();
  for (const node of context.nodes) {
    const filePath = getFilePathFromNode(node);
    if (filePath) {
      filePaths.add(filePath);
    }
  }
  
  // Attempt to load files
  // In production, this would use real file paths from your repository or workspace
  // For this implementation, we'll use a simulated file system
  for (const filePath of filePaths) {
    try {
      // For this implementation, we'll use mock data since we can't access real files
      const content = await getSimulatedFileContent(filePath);
      fileMap.set(filePath, {
        path: filePath,
        content
      });
    } catch (error) {
      console.error(`Error loading file ${filePath}:`, error);
      // Skip files that can't be loaded
    }
  }
  
  return fileMap;
}

// Mock function to simulate getting file content
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
  } else {
    throw new Error(`File not found: ${filePath}`);
  }
}

// Parse and analyze files to prepare for refactoring
async function parseFiles(files: Map<string, FileInfo>): Promise<Map<string, FileInfo>> {
  const parsedFiles = new Map<string, FileInfo>();
  
  for (const [filePath, fileInfo] of files.entries()) {
    try {
      const ast = parser.parse(fileInfo.content, {
        loc: true,
        range: true,
        comment: true,
        tokens: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
        filePath
      });
      
      parsedFiles.set(filePath, {
        ...fileInfo,
        ast
      });
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      // Keep the file even if parsing fails
      parsedFiles.set(filePath, fileInfo);
    }
  }
  
  return parsedFiles;
}

// Process refactoring instructions and apply transformations
async function applyRefactoringTransformations(
  files: Map<string, FileInfo>,
  instructions: string,
  context: any
): Promise<FileDiff[]> {
  const diffs: FileDiff[] = [];
  const lowerInstructions = instructions.toLowerCase();
  
  // Extract common file paths for convenience
  let userServicePath = '';
  let userControllerPath = '';
  
  for (const [path, info] of files.entries()) {
    if (path.includes('user.service')) {
      userServicePath = path;
    } else if (path.includes('user.controller')) {
      userControllerPath = path;
    }
  }
  
  // Apply different refactoring strategies based on instructions
  if (lowerInstructions.includes('extract') && lowerInstructions.includes('log')) {
    // Extract logging functionality
    await extractLoggingMethods(files, diffs, userServicePath);
  } 
  else if (lowerInstructions.includes('rename') && 
          (lowerInstructions.includes('getuser') || lowerInstructions.includes('get user'))) {
    // Rename getUser method
    await renameUserMethod(files, diffs, userServicePath, userControllerPath);
  }
  else if (lowerInstructions.includes('error') && lowerInstructions.includes('handling')) {
    // Improve error handling
    await improveErrorHandling(files, diffs, userServicePath);
  }
  else {
    // Default refactoring - improve input validation
    await improveInputValidation(files, diffs, userControllerPath);
  }
  
  return diffs;
}

// Specific refactoring implementations

async function extractLoggingMethods(
  files: Map<string, FileInfo>,
  diffs: FileDiff[],
  userServicePath: string
): Promise<void> {
  if (!userServicePath || !files.has(userServicePath)) return;
  
  const fileInfo = files.get(userServicePath)!;
  const oldCode = fileInfo.content;
  
  // Simple string replacement approach 
  // In a production implementation, you would modify the AST instead
  let newCode = oldCode.replace(
    `console.log('User not found:', id);`,
    `this.logUserNotFound(id);`
  ).replace(
    `console.log('User created:', newUser.id);`,
    `this.logUserCreated(newUser.id);`
  );
  
  // Add the new methods at the end of the class
  // Find the last closing brace of the class
  const lastBraceIndex = newCode.lastIndexOf('}');
  if (lastBraceIndex > 0) {
    newCode = newCode.substring(0, lastBraceIndex) + `
  // Extracted logging methods
  private logUserNotFound(id: string): void {
    console.log('User not found:', id);
  }
  
  private logUserCreated(userId: string): void {
    console.log('User created:', userId);
  }
` + newCode.substring(lastBraceIndex);
  }
  
  diffs.push({
    fileName: path.basename(userServicePath),
    oldCode,
    newCode
  });
}

async function renameUserMethod(
  files: Map<string, FileInfo>,
  diffs: FileDiff[],
  userServicePath: string, 
  userControllerPath: string
): Promise<void> {
  if (!userServicePath || !files.has(userServicePath)) return;
  
  // Rename in service
  const serviceFileInfo = files.get(userServicePath)!;
  const oldServiceCode = serviceFileInfo.content;
  const newServiceCode = oldServiceCode.replace(
    /async\s+getUser\s*\(\s*id\s*:\s*string\s*\)\s*:\s*Promise<User\s*\|\s*null>/g,
    `async findUserById(id: string): Promise<User | null>`
  );
  
  diffs.push({
    fileName: path.basename(userServicePath),
    oldCode: oldServiceCode,
    newCode: newServiceCode
  });
  
  // Update references in controller if available
  if (userControllerPath && files.has(userControllerPath)) {
    const controllerFileInfo = files.get(userControllerPath)!;
    const oldControllerCode = controllerFileInfo.content;
    const newControllerCode = oldControllerCode.replace(
      /userService\.getUser\s*\(\s*userId\s*\)/g,
      `userService.findUserById(userId)`
    );
    
    diffs.push({
      fileName: path.basename(userControllerPath),
      oldCode: oldControllerCode,
      newCode: newControllerCode
    });
  }
}

async function improveErrorHandling(
  files: Map<string, FileInfo>,
  diffs: FileDiff[],
  userServicePath: string
): Promise<void> {
  if (!userServicePath || !files.has(userServicePath)) return;
  
  const fileInfo = files.get(userServicePath)!;
  const oldCode = fileInfo.content;
  
  // Replace the error handling in the getUser method
  const newCode = oldCode.replace(
    /} catch \(error\) {\s*console\.error\('Error fetching user:', error\);\s*throw error;\s*}/g,
    `} catch (error) {
      console.error('Error fetching user:', error);
      throw new Error(\`Failed to retrieve user: \${error.message}\`);
    }`
  );
  
  diffs.push({
    fileName: path.basename(userServicePath),
    oldCode,
    newCode
  });
}

async function improveInputValidation(
  files: Map<string, FileInfo>,
  diffs: FileDiff[],
  userControllerPath: string
): Promise<void> {
  if (!userControllerPath || !files.has(userControllerPath)) return;
  
  const fileInfo = files.get(userControllerPath)!;
  const oldCode = fileInfo.content;
  
  // Add more robust input validation
  const newCode = oldCode.replace(
    /async createUser\(req: Request, res: Response\): Promise<void> {\s*try {\s*const userData = req\.body;/g,
    `async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      
      // Added input validation
      if (!userData || typeof userData !== 'object') {
        res.status(400).json({ message: 'Invalid user data format' });
        return;
      }`
  );
  
  diffs.push({
    fileName: path.basename(userControllerPath),
    oldCode,
    newCode
  });
}

export async function POST(request: Request) {
  console.log("Received refactor request");
  try {
    const body: RefactorRequestBody = await request.json();
    console.log("Request body:", body);
    
    const { projectId, selectedNodeIds, instructions, context } = body;
    
    if (!projectId || !selectedNodeIds || !instructions || !context) {
      return NextResponse.json({ error: 'Missing required fields in request' }, { status: 400 });
    }
    
    // 1. Load files based on the context
    const files = await loadFilesForNodes(context);
    if (files.size === 0) {
      return NextResponse.json({ error: 'No valid files found to refactor' }, { status: 400 });
    }
    
    // 2. Parse and analyze files
    const parsedFiles = await parseFiles(files);
    
    // 3. Apply requested refactoring transformations
    const diffs = await applyRefactoringTransformations(parsedFiles, instructions, context);
    
    // For user feedback and transparency
    console.log(`Applied refactoring to ${diffs.length} files`);
    
    return NextResponse.json({ 
      message: 'Refactoring completed',
      diffs: diffs
    });
    
  } catch (error) {
    console.error("Refactor error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to refactor: ${errorMessage}` }, { status: 500 });
  }
} 