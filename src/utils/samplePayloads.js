/**
 * Realistic Enterprise API Upgrade Demos
 */

export const SAMPLE_ORDER_V1 = JSON.stringify({
  "code": 200,
  "msg": "success",
  "data": {
    "order_id": 1002384,
    "order_no": "ORD202609010088",
    "status": "PENDING",
    "total_amount": 358.50,
    "user": {
      "user_id": 8801,
      "username": "chen_dev",
      "mobile": "13800138000"
    },
    "items": [
      {
        "sku_id": 501,
        "sku_name": "无线降噪蓝牙耳机",
        "quantity": 1,
        "price": 299.00
      },
      {
        "sku_id": 502,
        "sku_name": "快充数据线 Type-C",
        "quantity": 2,
        "price": 29.75
      }
    ],
    "legacy_signature": "a1b2c3d4e5f67890"
  },
  "timestamp": 1758528000000
}, null, 2);

// In V2: order_id became String (Breaking Type Mismatch!), discount_amount & shipping_address added, legacy_signature removed, status changed, keys reordered!
export const SAMPLE_ORDER_V2 = JSON.stringify({
  "timestamp": 1758528120000,
  "msg": "success",
  "code": 200,
  "data": {
    "status": "PAID",
    "order_no": "ORD202609010088",
    "total_amount": 338.50,
    "discount_amount": 20.00,
    "order_id": "1002384",
    "shipping_address": {
      "receiver": "陈工程师",
      "phone": "13800138000",
      "address": "上海市浦东新区张江高科科苑路 88 号"
    },
    "items": [
      {
        "price": 299.00,
        "sku_id": 501,
        "quantity": 1,
        "sku_name": "无线降噪蓝牙耳机"
      },
      {
        "price": 29.75,
        "sku_id": 502,
        "quantity": 2,
        "sku_name": "快充数据线 Type-C"
      }
    ],
    "user": {
      "mobile": "13800138000",
      "username": "chen_dev",
      "user_id": 8801
    }
  }
}, null, 2);

export const SAMPLE_USER_V1 = JSON.stringify({
  "userId": 9527,
  "nickname": "全栈架构师",
  "department": "技术研发部",
  "roles": ["DEVELOPER", "ADMIN"],
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}, null, 2);

export const SAMPLE_USER_V2 = JSON.stringify({
  "userId": 9527,
  "nickname": "资深技术专家",
  "department": "平台架构部",
  "roles": ["DEVELOPER", "ARCHITECT", "RELEASE_MANAGER"],
  "settings": {
    "theme": "dark",
    "notifications": false,
    "twoFactorAuth": true
  }
}, null, 2);
