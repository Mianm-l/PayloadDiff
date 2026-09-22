<template>
  <div style="flex: 1; height: 100%; display: grid; grid-template-columns: 1fr 1fr; background: var(--bg-main); overflow: hidden;">
    <!-- Left Source Pane -->
    <div style="border-right: 1px solid var(--border-color); display: flex; flex-direction: column; background: var(--bg-card); overflow: hidden;">
      <div style="padding: 0.6rem 1rem; background: var(--bg-card-header); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">
          原始接口报文 (Source / Baseline)
        </span>
        <button class="btn-ghost" style="font-size: 0.72rem; padding: 0.15rem 0.45rem;" @click="$emit('clear-left')">
          清空
        </button>
      </div>
      <div style="flex: 1; position: relative;">
        <textarea
          :value="source"
          @input="$emit('update:source', $event.target.value)"
          class="font-mono"
          style="width: 100%; height: 100%; background: var(--bg-card); color: #94a3b8; border: none; outline: none; resize: none; padding: 0.85rem; font-size: 11.5px; line-height: 1.55; tab-size: 2;"
          placeholder="在此粘贴基准接口报文 (JSON 或 XML)..."
        ></textarea>
      </div>
    </div>

    <!-- Right Target Pane -->
    <div style="display: flex; flex-direction: column; background: var(--bg-card); overflow: hidden;">
      <div style="padding: 0.6rem 1rem; background: var(--bg-card-header); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.8rem; font-weight: 600; color: #22d3ee;">
          新版/对照报文 (Target / Modified)
        </span>
        <button class="btn-ghost" style="font-size: 0.72rem; padding: 0.15rem 0.45rem;" @click="$emit('clear-right')">
          清空
        </button>
      </div>
      <div style="flex: 1; position: relative;">
        <textarea
          :value="target"
          @input="$emit('update:target', $event.target.value)"
          class="font-mono"
          style="width: 100%; height: 100%; background: var(--bg-card); color: #7dd3fc; border: none; outline: none; resize: none; padding: 0.85rem; font-size: 11.5px; line-height: 1.55; tab-size: 2;"
          placeholder="在此粘贴对照/新版接口报文 (JSON 或 XML)..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  source: { type: String, default: '' },
  target: { type: String, default: '' }
});

defineEmits(['update:source', 'update:target', 'clear-left', 'clear-right']);
</script>
