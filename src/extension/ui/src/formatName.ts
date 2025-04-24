import { capitalize } from 'lodash-es';

// This function is used to format the name of a catalog item, as this name isn't always presentable
export function formatName(name: string): string {
  // Lodash doesn't have a capitalize function that works with strings
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(capitalize)
    .join(' ');
}
