<template>
  <div style="flex: 1; height: 100%; overflow-y: auto; padding: 1.25rem 2rem; background: var(--bg-main);">
    <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
      <!-- Filter Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <!-- Categories -->
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button 
            :class="categoryFilter === 'ALL' ? 'cat-active' : 'cat-btn'"
            @click="categoryFilter = 'ALL'"
          >
            全部差异 ({{ differences.length }})
          </button>

          <button 
            v-if="countMismatch > 0"
            :class="categoryFilter === 'TYPE_MISMATCH' ? 'cat-active' : 'cat-btn'"
            @click="categoryFilter = 'TYPE_MISMATCH'"
            style="color: #c084fc;"
          >
            破坏性类型漂移 ({{ countMismatch }})
          </button>

          <button 
            v-if="countAdded > 0"
            :class="categoryFilter === 'ADDED' ? 'cat-active' : 'cat-btn'"
            @click="categoryFilter = 'ADDED'"
            style="color: #34d399;"
          >
            新增字段 ({{ countAdded }})
          </button>

          <button 
            v-if="countModified > 0"
            :class="categoryFilter === 'MODIFIED' ? 'cat-active' : 'cat-btn'"
            @click="categoryFilter = 'MODIFIED'"
            style="color: #fbbf24;"
          >
            值变更 ({{ countModified }})
          </button>

          <button 
            v-if="countRemoved > 0"
            :class="categoryFilter === 'REMOVED' ? 'cat-active' : 'cat-btn'"
            @click="categoryFilter = 'REMOVED'"
            style="color: #fb7185;"
          >
            已废弃/删除 ({{ countRemoved }})
          </button>
        </div>

        <!-- Search Input -->
        <div style="display: flex; align-items: center; gap: 0.4rem; background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.25rem 0.6rem; border-radius: 6px;">
          <Search :size="13" style="color: var(--text-dim);" />
          <input 
            v-model="searchKeyword"
            type="text"
            placeholder="按 JSONPath 或字段名搜索..."
            class="font-mono"
            style="background: transparent; border: none; outline: none; font-size: 11px; color: var(--text-main); width: 170px;"
          />
        </div>
      </div>

      <!-- Empty Differences State -->
      <div v-if="filteredDiffs.length === 0" style="padding: 4rem 1rem; text-align: center; color: var(--text-dim);">
        <CheckCircle2 :size="40" style="color: var(--success); margin: 0 auto 0.75rem auto;" />
        <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.35rem;">
          {{ differences.length === 0 ? '两份报文在语义上完全一致！' : '没有匹配筛选条件的差异项' }}
        </h3>
        <p style="font-size: 0.78rem;">
          {{ differences.length === 0 ? '即使字段顺序不同或空格缩进不一，所有业务结构与取值均完全相同。' : '请尝试调整筛选条件或清空搜索关键字。' }}
        </p>
      </div>

      <!-- Diff Items List -->
      <div v-else style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div 
          v-for="(diff, idx) in filteredDiffs" 
          :key="idx"
          style="background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.25);"
          :style="{
            borderColor: diff.type === 'TYPE_MISMATCH' ? 'rgba(168, 85, 247, 0.4)' : (diff.type === 'ADDED' ? 'rgba(16, 185, 129, 0.3)' : (diff.type === 'REMOVED' ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-card)'))
          }"
        >
          <!-- Card Header -->
          <div style="padding: 0.65rem 1rem; background: var(--bg-card-header); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <!-- Type Badge -->
              <span 
                :class="{
                  'badge-mismatch': diff.type === 'TYPE_MISMATCH',
                  'badge-added': diff.type === 'ADDED',
                  'badge-removed': diff.type === 'REMOVED',
                  'badge-modified': diff.type === 'MODIFIED'
                }"
              >
                {{ getBadgeLabel(diff.type) }}
              </span>

              <!-- JSONPath -->
              <span class="font-mono" style="font-size: 0.8rem; font-weight: 600; color: #7dd3fc;">
                {{ diff.path }}
              </span>
            </div>

            <span style="font-size: 0.75rem; color: var(--text-muted);">
              {{ diff.desc }}
            </span>
          </div>

          <!-- Card Body: Value Comparison -->
          <div style="padding: 0.75rem 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--bg-input); font-size: 11.5px;" class="font-mono">
            <!-- Left (Source) -->
            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); padding: 0.5rem 0.75rem; border-radius: 6px; overflow-x: auto;">
              <span style="font-size: 10px; color: var(--text-dim); display: block; margin-bottom: 2px;">左侧原始值 (Source)：</span>
              <span v-if="diff.oldVal === undefined" style="color: var(--text-dim); font-style: italic;">（未定义 / 不存在）</span>
              <span v-else :style="{ color: diff.type === 'REMOVED' ? '#fb7185' : '#94a3b8' }">
                {{ formatVal(diff.oldVal) }}
              </span>
            </div>

            <!-- Right (Target) -->
            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); padding: 0.5rem 0.75rem; border-radius: 6px; overflow-x: auto;">
              <span style="font-size: 10px; color: var(--text-dim); display: block; margin-bottom: 2px;">右侧目标值 (Target)：</span>
              <span v-if="diff.newVal === undefined" style="color: var(--text-dim); font-style: italic;">（已删除 / 不存在）</span>
              <span v-else :style="{ color: diff.type === 'ADDED' ? '#34d399' : (diff.type === 'TYPE_MISMATCH' ? '#c084fc' : '#fbbf24') }">
                {{ formatVal(diff.newVal) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps({
  differences: { type: Array, default: () => [] }
});

const categoryFilter = ref('ALL');
const searchKeyword = ref('');

const countMismatch = computed(() => props.differences.filter(d => d.type === 'TYPE_MISMATCH').length);
const countAdded = computed(() => props.differences.filter(d => d.type === 'ADDED').length);
const countModified = computed(() => props.differences.filter(d => d.type === 'MODIFIED').length);
const countRemoved = computed(() => props.differences.filter(d => d.type === 'REMOVED').length);

const filteredDiffs = computed(() => {
  let list = props.differences;

  if (categoryFilter.value !== 'ALL') {
    list = list.filter(d => d.type === categoryFilter.value);
  }

  if (searchKeyword.value.trim()) {
    const q = searchKeyword.value.trim().toLowerCase();
    list = list.filter(d => d.path.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q));
  }

  return list;
});

function getBadgeLabel(type) {
  if (type === 'TYPE_MISMATCH') return '类型漂移';
  if (type === 'ADDED') return '新增字段';
  if (type === 'REMOVED') return '删除字段';
  if (type === 'MODIFIED') return '值变更';
  return type;
}

function formatVal(val) {
  if (typeof val === 'object' && val !== null) {
    return JSON.stringify(val);
  }
  return String(val);
}
</script>

<style scoped>
.cat-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.72rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cat-btn:hover {
  color: var(--text-main);
  background: var(--bg-card-row);
}
.cat-active {
  background: var(--accent);
  border: 1px solid var(--accent);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
