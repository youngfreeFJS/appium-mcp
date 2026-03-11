/**
 * Type definitions for AI Vision Finder
 */

/**
 * AI Vision configuration interface
 */
export interface AIVisionConfig {
  model: string;
  apiBaseUrl: string;
  apiToken: string;
  coordType: 'normalized' | 'absolute';
  imageMaxWidth: number;
  imageQuality: number;
}

/**
 * Bounding box coordinates interface
 * Matches the format returned by vision models
 */
export interface BBoxCoordinates {
  target: string;
  bbox_2d: number[];
}

/**
 * AI element finding result interface
 */
export interface AIFindResult {
  bbox: number[];
  center: { x: number; y: number };
  target: string;
}
