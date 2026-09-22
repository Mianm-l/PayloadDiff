<template>
  <div 
    v-if="isOpen"
    style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;"
    @click.self="$emit('close')"
  >
    <div style="background: var(--bg-card); border: 1.5px solid var(--border-card); border-radius: 12px; width: 100%; max-width: 760px; height: 80vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 16px 36px rgba(0,0,0,0.6);">
      <!-- Header with Tabs -->
      <div style="padding: 0.75rem 1.25rem; background: var(--bg-card-header); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button 
            :class="activeTab === 'ts' ? 'modal-tab-active' : 'modal-tab'"
            @click="activeTab = 'ts'"
          >
            <FileCode :size="14" />
            <span>TypeScript 契约逆向</span>
          </button>

          <button 
            :class="activeTab === 'mock' ? 'modal-tab-active' : 'modal-tab'"
            @click="activeTab = 'mock'"
          >
            <Sparkles :size="14" />
            <span>智能动态 Mock 响应</span>
          </button>
        </div>

        <button class="btn-icon" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <!-- Code Area -->
      <div style="flex: 1; position: relative; background: var(--bg-input);">
        <textarea
          :value="displayContent"
          readonly
          class="font-mono"
          style="width: 100%; height: 100%; background: transparent; color: #93c5fd; border: none; outline: none; resize: none; padding: 1rem; font-size: 11.5px; line-height: 1.6;"
        ></textarea>
      </div>

      <!-- Footer Actions -->
      <div style="padding: 0.85rem 1.25rem; background: var(--bg-card-header); border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button v-if="activeTab === 'mock'" class="btn-ghost" @click="refreshMock">
            <RefreshCw :size="13" />
            <span>重新随机生成数据</span>
          </button>
          <span style="font-size: 0.75rem; color: var(--text-dim);">
            {{ activeTab === 'ts' ? '已自动生成所有嵌套子对象的类型声明' : '支持中文姓名/手机/价格/订单号语义匹配' }}
          </span>
        </div>

        <div style="display: flex; gap: 0.65rem;">
          <button class="btn-ghost" @click="copyContent">
            <Copy :size="14" />
            <span>{{ isCopied ? '已复制！' : '复制内容' }}</span>
          </button>
          <button class="btn-primary" @click="downloadFile">
            <Download :size="14" />
            <span>下载文件</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { FileCode, Sparkles, X, Copy, Download, RefreshCw } from 'lucide-vue-next';
import { generateTypeScript } from '../utils/typeGenerator';
import { generateMockData } from '../utils/mockGenerator';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  targetData: { type: Object, default: () => ({}) }
});

defineEmits(['close']);

const activeTab = ref('ts');
const isCopied = ref(false);
const mockSeed = ref(0);

const tsContent = computed(() => {
  return generateTypeScript(props.targetData, 'ApiResponse');
});

const mockContent = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  mockSeed.value; // trigger reactivity
  const mocked = generateMockData(props.targetData);
  return JSON.stringify(mocked, null, 2);
});

const displayContent = computed(() => {
  return activeTab.value === 'ts' ? tsContent.value : mockContent.value;
});

function refreshMock() {
  mockSeed.value++;
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(displayContent.value);
    isCopied.value = true;
    setTimeout(() => { isCopied.value = false; }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
}

function downloadFile() {
  const isTs = activeTab.value === 'ts';
  const filename = isTs ? `api-contract-${Date.now()}.d.ts` : `mock-response-${Date.now()}.json`;
  const mimeType = isTs ? 'text/typescript' : 'application/json';

  const blob = new Blob([displayContent.value], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.modal-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: var(--text-muted);
  border: none;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.modal-tab:hover {
  color: var(--text-main);
}
.modal-tab-active {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-card);
  color: #22d3ee;
  border: 1px solid var(--border-card);
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
