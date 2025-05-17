/**
 * Registry for OEM adapter implementations
 * Stores references to adapter classes by manufacturer identifier
 */
export class OEMAdapterRegistry {
  private adapters: Map<string, any> = new Map();

  /**
   * Register an adapter class for a specific manufacturer
   * 
   * @param manufacturer The vehicle manufacturer identifier (lowercase)
   * @param adapterClass The adapter class to register
   */
  public registerAdapter(manufacturer: string, adapterClass: any): void {
    this.adapters.set(manufacturer.toLowerCase(), adapterClass);
  }

  /**
   * Get an adapter class by manufacturer
   * 
   * @param manufacturer The vehicle manufacturer identifier
   * @returns The adapter class or undefined if not found
   */
  public getAdapter(manufacturer: string): any {
    return this.adapters.get(manufacturer.toLowerCase());
  }

  /**
   * Check if a manufacturer has a registered adapter
   * 
   * @param manufacturer The vehicle manufacturer to check
   * @returns True if an adapter is registered, false otherwise
   */
  public hasAdapter(manufacturer: string): boolean {
    return this.adapters.has(manufacturer.toLowerCase());
  }

  /**
   * Get a list of all registered manufacturers
   * 
   * @returns Array of registered manufacturer identifiers
   */
  public getRegisteredManufacturers(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Remove an adapter from the registry
   * 
   * @param manufacturer The vehicle manufacturer identifier
   * @returns True if successfully removed, false if not found
   */
  public unregisterAdapter(manufacturer: string): boolean {
    return this.adapters.delete(manufacturer.toLowerCase());
  }

  /**
   * Clear all registered adapters
   */
  public clearRegistry(): void {
    this.adapters.clear();
  }
}