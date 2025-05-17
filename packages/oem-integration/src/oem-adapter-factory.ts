import { OEMAdapterConfig, OEMInterface } from './interfaces/oem-interface';
import { OEMAdapterRegistry } from './oem-adapter-registry';

/**
 * Factory class for creating OEM adapters
 */
export class OEMAdapterFactory {
  private static registry: OEMAdapterRegistry = new OEMAdapterRegistry();

  /**
   * Create an OEM adapter instance
   * 
   * @param manufacturer The vehicle manufacturer (e.g., 'tesla', 'gm', 'toyota')
   * @param config Configuration options for the adapter
   * @returns An initialized OEM adapter instance
   */
  public static async createAdapter(
    manufacturer: string,
    config: OEMAdapterConfig
  ): Promise<OEMInterface> {
    // Get adapter class from registry
    const AdapterClass = this.registry.getAdapter(manufacturer.toLowerCase());
    
    if (!AdapterClass) {
      throw new Error(`No adapter registered for manufacturer: ${manufacturer}`);
    }
    
    // Create instance
    const adapter = new AdapterClass();
    
    // Initialize adapter with config
    await adapter.initialize(config);
    
    return adapter;
  }

  /**
   * Register a new adapter class with the factory
   * 
   * @param manufacturer The vehicle manufacturer identifier
   * @param adapterClass The adapter class to register
   */
  public static registerAdapter(manufacturer: string, adapterClass: any): void {
    this.registry.registerAdapter(manufacturer.toLowerCase(), adapterClass);
  }

  /**
   * Get all registered manufacturers
   * 
   * @returns Array of registered manufacturer identifiers
   */
  public static getRegisteredManufacturers(): string[] {
    return this.registry.getRegisteredManufacturers();
  }

  /**
   * Check if a manufacturer has a registered adapter
   * 
   * @param manufacturer The vehicle manufacturer to check
   * @returns True if an adapter is registered, false otherwise
   */
  public static hasAdapter(manufacturer: string): boolean {
    return this.registry.hasAdapter(manufacturer.toLowerCase());
  }
}