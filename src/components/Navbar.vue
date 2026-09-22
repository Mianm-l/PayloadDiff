<template>
  <header style="background: var(--bg-card); border-bottom: 1px solid var(--border-color); padding: 0.65rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; z-index: 20;">
    <!-- Left: Logo & Title -->
    <div style="display: flex; align-items: center; gap: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <div style="background: linear-gradient(135deg, #06b6d4, #0891b2); width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);">
          <Split :size="18" />
        </div>
        <div>
          <h1 style="font-size: 1.05rem; font-weight: 700; display: flex; align-items: center; gap: 0.45rem; letter-spacing: -0.02em;">
            PayloadDiff
            <span style="font-size: 0.7rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3);">
              语义级深度比对
            </span>
          </h1>
        </div>
      </div>

      <!-- Presets -->
      <div style="display: flex; gap: 0.35rem;">
        <button class="btn-ghost" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;" @click="$emit('load-order-demo')">
          <Sparkles :size="12" />
          <span>订单升级示例 (含破坏性类型变动)</span>
        </button>
        <button class="btn-ghost" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;" @click="$emit('load-user-demo')">
          <Layers :size="12" />
          <span>用户权限示例</span>
        </button>
      </div>
    </div>

    <!-- Right Actions -->
    <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
      <button class="btn-ghost" @click="$emit('swap-payloads')" title="左右对调比较">
        <ArrowLeftRight :size="14" />
        <span>左右互换</span>
      </button>

      <button class="btn-ghost" @click="$emit('format-both')" title="规范化格式化两边 JSON">
        <AlignLeft :size="14" />
        <span>格式化</span>
      </button>

      <button class="btn-primary" @click="$emit('open-contract')" title="自动逆向生成 TypeScript Interface 与 Mock 桩">
        <FileCode2 :size="14" />
        <span>TS 契约 & Mock 桩</span>
      </button>

      <a 
        href="https://github.com/Mianm-l/PayloadDiff" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="btn-icon" 
        title="在 GitHub 上查看源码"
      >
        <Github :size="18" />
      </a>
    </div>
  </header>
</template>

<script setup>
import { Split, Sparkles, Layers, ArrowLeftRight, AlignLeft, FileCode2, Github } from 'lucide-vue-next';

defineEmits(['load-order-demo', 'load-user-demo', 'swap-payloads', 'format-both', 'open-contract']);
</script>
