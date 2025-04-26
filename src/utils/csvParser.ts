
/**
 * Simple CSV parser that converts CSV text to an array of objects
 * @param csvText The CSV text to parse
 * @returns An array of objects where keys are from the header row
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  // Split by lines and filter out empty lines
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  // Get headers from the first line
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse data rows
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {};
    const currentLine = lines[i].split(',');
    
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j]?.trim() || '';
    }
    
    result.push(obj);
  }
  
  return result;
}

