# PayloadDiff 🔍

> **100% 纯客户端语义级 JSON / XML 接口报文比对与动态 Mock 桩生成器**  
> **Zero Server Upload · 纯本地运算 · 键乱序无关 · 类型破坏性漂移雷达 · TypeScript 契约逆向 · 智能 Mock 桩**

[![GitHub Pages](https://img.shields.io/badge/Demo-Live_Online-06b6d4?style=flat-square&logo=github)](https://mianm-l.github.io/PayloadDiff/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)

---

## 🌟 为什么需要 PayloadDiff？

在前后端联调、微服务接口迭代与第三方企业系统（致远 OA、用友 ERP、微信/支付宝支付网关）对接中，报文比对是高频刚需。然而：
- **普通文本 Diff 误报灾难**：传统文本比对工具基于字符逐行比较。只要新旧报文的键值书写顺序稍有不同，或者空格换行缩进不一，整屏大面积爆红，肉眼根本无法分辨哪几个是真正的业务字段变更。
- **隐蔽致命的“类型漂移 (Type Mismatch)”**：接口改造时，后端将 `id` 从 `Integer (1002)` 变成了 `String ("1002")`，或者将 `items` 从 `[]` 变成了 `null`。这种破坏性变更往往逃过普通比对，导致前端白屏或微服务反序列化崩溃！
- **生产敏感数据外泄**：线上排查接口返回时包含真实手机号、身份证、用户 Token 或金额流水，严禁上传到公共在线 Diff 平台。

**PayloadDiff** 专为接口联调而生：所有语法解析与语义递归算法 **100% 在浏览器本地沙箱完成，零数据上云**！

---

## ✨ 核心特性矩阵

### 1. 🔍 语义级键乱序无关对比 (Order-Insensitive Semantic Diff)
- 递归解析对象树，自动忽略 JSON 键的排列先后顺序；
- 精准分类 4 大变更维度：
  - 🟣 **TYPE MISMATCH (类型破坏性漂移)**：醒目高亮类型变更（如 Number ➔ String），并给出高危警示；
  - 🟢 **ADDED (新增字段)**：标识接口扩展的新字段；
  - 🟡 **MODIFIED (字段值变更)**：标识同一字段的具体数值变化；
  - 🔴 **REMOVED (已废弃/删除)**：标识被移除或漏传的字段。

---

### 2. 🎯 精准 JSONPath 定位与精简清单
- 每处差异均提供精准的 JSON 路径（如 `$.data.user.mobile`）；
- 提供“精简差异清单”视图：自动折叠上千行无变化的公共字段，仅列出产生实质性差异的核心项，秒级定位接口变动！

---

### 3. 🛠️ TypeScript 接口类型契约一键逆向
- 自动根据当前接口报文结构，逆向推导并生成符合工业规范的标准 **TypeScript `interface` 定义**；
- 递归声明嵌套子对象类型，前端工程师一键复制即可直接用于前端工程！

---

### 4. 🪄 智能动态 Mock 响应数据桩生成
- 自动识别字段语义（如 `order_no`、`username`、`mobile`、`amount`、`created_at`）；
- 一键生成结构一致、包含逼真测试数据的 Mock 响应 JSON，极大加速前后端并行开发与脱机联调。

---

## 🚀 在线体验

无需安装任何环境，直接访问：  
👉 **[https://mianm-l.github.io/PayloadDiff/](https://mianm-l.github.io/PayloadDiff/)**

---

## 💻 本地开发与构建

```bash
# 1. 克隆代码仓库
git clone https://github.com/Mianm-l/PayloadDiff.git
cd payload-diff

# 2. 安装依赖
npm install

# 3. 启动本地开发服务
npm run dev

# 4. 生产环境打包构建
npm run build
```

---

## 🛠️ 技术栈

- **前端核心**: [Vue 3](https://vuejs.org/) (Composition API)
- **工程化构建**: [Vite 6](https://vitejs.dev/)
- **图标系统**: [Lucide Vue Next](https://lucide.dev/)
- **部署方案**: GitHub Actions + GitHub Pages (全球免费 CDN)

---

## 📄 开源许可证

本项目采用 [MIT License](LICENSE) 许可协议，欢迎自由使用、分发与二次开发。
