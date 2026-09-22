/**
 * Smart Mock Response Generator
 * Generates realistic simulation data based on field name semantics.
 */

export function generateMockData(schemaObj) {
  if (!schemaObj || typeof schemaObj !== 'object') {
    return schemaObj;
  }

  function mockValue(key, sampleVal) {
    const k = key.toLowerCase();

    if (k.includes('id') || k.includes('uuid')) {
      return typeof sampleVal === 'number' ? Math.floor(100000 + Math.random() * 900000) : 'uid_' + Math.random().toString(36).substr(2, 9);
    }
    if (k.includes('order_no') || k.includes('orderno')) {
      return 'ORD2026' + Date.now();
    }
    if (k.includes('name') || k.includes('user')) {
      const names = ['张伟', '王芳', '李强', '陈明', '赵敏'];
      return names[Math.floor(Math.random() * names.length)];
    }
    if (k.includes('phone') || k.includes('mobile')) {
      return '138' + Math.floor(10000000 + Math.random() * 90000000);
    }
    if (k.includes('email') || k.includes('mail')) {
      return 'user_' + Math.random().toString(36).substr(2, 4) + '@company.com';
    }
    if (k.includes('price') || k.includes('amount') || k.includes('total') || k.includes('money')) {
      return Math.round((Math.random() * 500 + 10) * 100) / 100;
    }
    if (k.includes('status')) {
      return 'SUCCESS';
    }
    if (k.includes('time') || k.includes('date')) {
      return new Date().toISOString().replace('T', ' ').substr(0, 19);
    }
    if (k.includes('address') || k.includes('addr')) {
      return '北京市海淀区丹棱街 5 号创客广场 A 座 801 室';
    }
    if (k.includes('ip')) {
      return '192.168.1.105';
    }
    if (k.includes('desc') || k.includes('remark') || k.includes('comment')) {
      return '业务系统联调自动生成的测试数据';
    }

    if (typeof sampleVal === 'number') return Math.floor(Math.random() * 100) + 1;
    if (typeof sampleVal === 'boolean') return true;
    if (typeof sampleVal === 'string') return 'mock_str_' + Math.random().toString(36).substr(2, 4);

    return sampleVal;
  }

  function walk(node, keyName = '') {
    if (node === null || node === undefined) return null;
    if (Array.isArray(node)) {
      if (node.length === 0) return [];
      return [walk(node[0], keyName), walk(node[0], keyName)];
    }
    if (typeof node === 'object') {
      const res = {};
      for (const k of Object.keys(node)) {
        res[k] = walk(node[k], k);
      }
      return res;
    }
    return mockValue(keyName, node);
  }

  return walk(schemaObj);
}
