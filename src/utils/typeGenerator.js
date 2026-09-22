/**
 * TypeScript Interface Generator from JSON Payload
 */

export function generateTypeScript(jsonObj, rootInterfaceName = 'ApiResponse') {
  if (!jsonObj || typeof jsonObj !== 'object') {
    return `export type ${rootInterfaceName} = any;`;
  }

  const interfaces = [];
  const generatedNames = new Set();

  function toPascalCase(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
      .replace(/[\s-_]+/g, '');
  }

  function resolveType(val, fieldName) {
    if (val === null || val === undefined) return 'any';
    if (typeof val === 'string') return 'string';
    if (typeof val === 'number') return 'number';
    if (typeof val === 'boolean') return 'boolean';

    if (Array.isArray(val)) {
      if (val.length === 0) return 'any[]';
      const itemType = resolveType(val[0], fieldName + 'Item');
      return `${itemType}[]`;
    }

    if (typeof val === 'object') {
      let subName = toPascalCase(fieldName);
      if (generatedNames.has(subName)) {
        subName = `${subName}_Sub`;
      }
      generatedNames.add(subName);
      parseObject(val, subName);
      return subName;
    }

    return 'any';
  }

  function parseObject(obj, name) {
    const lines = [];
    lines.push(`export interface ${name} {`);

    for (const key of Object.keys(obj)) {
      const fieldType = resolveType(obj[key], key);
      lines.push(`  ${key}: ${fieldType};`);
    }

    lines.push('}');
    interfaces.unshift(lines.join('\n'));
  }

  parseObject(jsonObj, rootInterfaceName);

  return interfaces.join('\n\n');
}
