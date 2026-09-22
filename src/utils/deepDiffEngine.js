/**
 * Semantic Deep Diff Engine
 * Performs order-insensitive recursive comparison between JSON/XML objects.
 * Accurately catches Added, Removed, Modified, and Type-Mismatch fields with JSONPaths.
 */

export function deepDiff(sourceRaw, targetRaw) {
  const parsedSource = parsePayload(sourceRaw);
  const parsedTarget = parsePayload(targetRaw);

  if (!parsedSource.valid || !parsedTarget.valid) {
    return {
      isValid: false,
      error: !parsedSource.valid ? `左侧原始报文解析失败: ${parsedSource.error}` : `右侧目标报文解析失败: ${parsedTarget.error}`,
      differences: [],
      summary: { addedCount: 0, removedCount: 0, modifiedCount: 0, typeMismatchCount: 0, totalChanges: 0 },
      formattedSource: sourceRaw,
      formattedTarget: targetRaw
    };
  }

  const differences = [];
  compare(parsedSource.data, parsedTarget.data, '$', differences);

  const summary = {
    addedCount: differences.filter(d => d.type === 'ADDED').length,
    removedCount: differences.filter(d => d.type === 'REMOVED').length,
    modifiedCount: differences.filter(d => d.type === 'MODIFIED').length,
    typeMismatchCount: differences.filter(d => d.type === 'TYPE_MISMATCH').length,
    totalChanges: differences.length
  };

  return {
    isValid: true,
    parsedSourceData: parsedSource.data,
    parsedTargetData: parsedTarget.data,
    differences,
    summary,
    formattedSource: JSON.stringify(parsedSource.data, null, 2),
    formattedTarget: JSON.stringify(parsedTarget.data, null, 2)
  };
}

function parsePayload(raw) {
  if (!raw || !raw.trim()) {
    return { valid: true, data: {} };
  }

  const str = raw.trim();

  // Try JSON
  try {
    const data = JSON.parse(str);
    return { valid: true, data };
  } catch (jsonErr) {
    // If it looks like XML, convert to simplified JS object
    if (str.startsWith('<') && str.endsWith('>')) {
      try {
        const data = parseXmlToJson(str);
        return { valid: true, data };
      } catch (xmlErr) {
        return { valid: false, error: 'XML 解析失败: ' + xmlErr.message };
      }
    }
    return { valid: false, error: jsonErr.message };
  }
}

function getType(val) {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

function compare(src, tgt, path, diffs) {
  const srcType = getType(src);
  const tgtType = getType(tgt);

  // 1. Check for Type Mismatch (Critical Bug in API upgrade)
  if (srcType !== tgtType) {
    diffs.push({
      type: 'TYPE_MISMATCH',
      path,
      oldVal: src,
      newVal: tgt,
      oldType: srcType,
      newType: tgtType,
      desc: `类型破坏性变更：从 [${srcType}] 变为 [${tgtType}]`
    });
    return;
  }

  // 2. Both are null or undefined
  if (src === null || src === undefined) {
    return;
  }

  // 3. Compare Primitives (string, number, boolean)
  if (srcType !== 'object' && srcType !== 'array') {
    if (src !== tgt) {
      diffs.push({
        type: 'MODIFIED',
        path,
        oldVal: src,
        newVal: tgt,
        desc: `值发生变化：${JSON.stringify(src)} ➔ ${JSON.stringify(tgt)}`
      });
    }
    return;
  }

  // 4. Compare Objects
  if (srcType === 'object') {
    const srcKeys = Object.keys(src);
    const tgtKeys = Object.keys(tgt);
    const allKeys = new Set([...srcKeys, ...tgtKeys]);

    allKeys.forEach(key => {
      const subPath = `${path}.${key}`;
      const inSrc = Object.prototype.hasOwnProperty.call(src, key);
      const inTgt = Object.prototype.hasOwnProperty.call(tgt, key);

      if (inSrc && !inTgt) {
        diffs.push({
          type: 'REMOVED',
          path: subPath,
          oldVal: src[key],
          newVal: undefined,
          desc: `字段被删除或废弃:「${key}」`
        });
      } else if (!inSrc && inTgt) {
        diffs.push({
          type: 'ADDED',
          path: subPath,
          oldVal: undefined,
          newVal: tgt[key],
          desc: `接口新增扩展字段:「${key}」`
        });
      } else {
        compare(src[key], tgt[key], subPath, diffs);
      }
    });
    return;
  }

  // 5. Compare Arrays
  if (srcType === 'array') {
    const maxLen = Math.max(src.length, tgt.length);
    for (let i = 0; i < maxLen; i++) {
      const subPath = `${path}[${i}]`;
      if (i >= src.length) {
        diffs.push({
          type: 'ADDED',
          path: subPath,
          oldVal: undefined,
          newVal: tgt[i],
          desc: `数组新增第 ${i + 1} 项元素`
        });
      } else if (i >= tgt.length) {
        diffs.push({
          type: 'REMOVED',
          path: subPath,
          oldVal: src[i],
          newVal: undefined,
          desc: `数组移除第 ${i + 1} 项元素`
        });
      } else {
        compare(src[i], tgt[i], subPath, diffs);
      }
    }
  }
}

/**
 * Lightweight XML to JSON parser for browser
 */
function parseXmlToJson(xmlStr) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error(parseError.textContent);
  }
  return xmlNodeToObject(xmlDoc.documentElement);
}

function xmlNodeToObject(node) {
  const obj = {};
  if (node.children.length === 0) {
    return node.textContent.trim();
  }
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const nodeName = child.nodeName;
    const value = xmlNodeToObject(child);

    if (obj[nodeName] !== undefined) {
      if (!Array.isArray(obj[nodeName])) {
        obj[nodeName] = [obj[nodeName]];
      }
      obj[nodeName].push(value);
    } else {
      obj[nodeName] = value;
    }
  }
  return obj;
}
