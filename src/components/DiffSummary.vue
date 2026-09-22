<template>
  <div style="background: var(--bg-card); border-bottom: 1px solid var(--border-color); padding: 0.65rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
    <!-- Metric Badges -->
    <div style="display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap;">
      <!-- Critical Type Mismatch Badge -->
      <div 
        v-if="summary.typeMismatchCount > 0"
        style="display: flex; align-items: center; gap: 0.45rem; background: var(--diff-type-mismatch-bg); border: 1.5px solid var(--diff-type-mismatch); padding: 0.25rem 0.65rem; border-radius: 6px; box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);"
      >
        <AlertTriangle :size="14" style="color: #c084fc;" />
        <span style="font-size: 0.75rem; font-weight: 700; color: #e9d5ff;">
          类型破坏性漂移: {{ summary.typeMismatchCount }} 处
        </span>
        <span style="font-size: 0.65rem; color: #d8b4fe;">(极易引发生产序列化崩溃)</span>
      </div>

      <!-- Regular Indicators -->
      <div style="display: flex; gap: 0.5rem; font-size: 0.75rem;">
        <span class="badge-added" style="display: flex; align-items: center; gap: 0.25rem;">
          <PlusCircle :size="12" />
          新增: {{ summary.addedCount }}
        </span>

        <span class="badge-modified" style="display: flex; align-items: center; gap: 0.25rem;">
          <Edit3 :size="12" />
          变更: {{ summary.modifiedCount }}
        </span>

        <span class="badge-removed" style="display: flex; align-items: center; gap: 0.25rem;">
          <MinusCircle :size="12" />
          删除/废弃: {{ summary.removedCount }}
        </span>

        <span style="color: var(--text-dim); display: flex; align-items: center; padding: 0 4px;">
          共发现 {{ summary.totalChanges }} 处语义差异
        </span>
      </div>
    </div>

    <!-- View Mode Switcher -->
    <div style="display: flex; gap: 4px; background: var(--bg-main); padding: 3px; border-radius: 6px; border: 1px solid var(--border-color);">
      <button 
        :class="activeView === 'changes' ? 'mode-btn-active' : 'mode-btn'"
        @click="$emit('update:activeView', 'changes')"
      >
        <ListTree :size="13" />
        <span>精简差异清单</span>
      </button>

      <button 
        :class="activeView === 'split' ? 'mode-btn-active' : 'mode-btn'"
        @click="$emit('update:activeView', 'split')"
      >
        <Columns :size="13" />
        <span>双栏对照视图</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, PlusCircle, Edit3, MinusCircle, ListTree, Columns } from 'lucide-vue-next';

defineProps({
  summary: { type: Object, required: true },
  activeView: { type: String, default: 'changes' }
});

defineEmits(['update:activeView']);
</script>

<style scoped>
.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: transparent;
  color: var(--text-muted);
  border: none;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.mode-btn:hover {
  color: var(--text-main);
}
.mode-btn-active {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--bg-card);
  color: #22d3ee;
  border: 1px solid var(--border-card);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
