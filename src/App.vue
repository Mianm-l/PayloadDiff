<template>
  <div style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: var(--bg-main);">
    <!-- Navigation Bar -->
    <Navbar 
      @load-order-demo="loadOrderDemo"
      @load-user-demo="loadUserDemo"
      @swap-payloads="swapPayloads"
      @format-both="formatBoth"
      @open-contract="contractModalOpen = true"
    />

    <!-- Diff Summary Statistics & View Mode Switcher -->
    <DiffSummary 
      :summary="diffResult.summary"
      v-model:active-view="activeView"
    />

    <!-- Main Workspace -->
    <main style="flex: 1; overflow: hidden; display: flex;">
      <!-- Mode 1: Changes List View -->
      <ChangesListView 
        v-if="activeView === 'changes'"
        :differences="diffResult.differences"
      />

      <!-- Mode 2: Split Dual Editors View -->
      <DiffEditorPane 
        v-else-if="activeView === 'split'"
        v-model:source="sourceText"
        v-model:target="targetText"
        @clear-left="sourceText = ''"
        @clear-right="targetText = ''"
      />
    </main>

    <!-- Contract & Mock Modal -->
    <ContractExportModal
      :is-open="contractModalOpen"
      :target-data="diffResult.parsedTargetData"
      @close="contractModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import DiffSummary from './components/DiffSummary.vue';
import ChangesListView from './components/ChangesListView.vue';
import DiffEditorPane from './components/DiffEditorPane.vue';
import ContractExportModal from './components/ContractExportModal.vue';

import { deepDiff } from './utils/deepDiffEngine';
import { 
  SAMPLE_ORDER_V1, 
  SAMPLE_ORDER_V2, 
  SAMPLE_USER_V1, 
  SAMPLE_USER_V2 
} from './utils/samplePayloads';

const sourceText = ref(SAMPLE_ORDER_V1);
const targetText = ref(SAMPLE_ORDER_V2);
const activeView = ref('changes');
const contractModalOpen = ref(false);

const diffResult = computed(() => {
  return deepDiff(sourceText.value, targetText.value);
});

function loadOrderDemo() {
  sourceText.value = SAMPLE_ORDER_V1;
  targetText.value = SAMPLE_ORDER_V2;
}

function loadUserDemo() {
  sourceText.value = SAMPLE_USER_V1;
  targetText.value = SAMPLE_USER_V2;
}

function swapPayloads() {
  const temp = sourceText.value;
  sourceText.value = targetText.value;
  targetText.value = temp;
}

function formatBoth() {
  if (diffResult.value.isValid) {
    sourceText.value = diffResult.value.formattedSource;
    targetText.value = diffResult.value.formattedTarget;
  }
}
</script>
