<script setup lang="ts">
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-vue-next'

const { toasts } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return XCircle
    case 'warning': return AlertTriangle
    default: return Info
  }
}

const getClass = (type: string) => {
  switch (type) {
    case 'success': return 'alert-success'
    case 'error': return 'alert-error'
    case 'warning': return 'alert-warning'
    default: return 'alert-info'
  }
}
</script>

<template>
  <div class="toast toast-top toast-end z-[100]">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="alert shadow-lg"
        :class="getClass(toast.type)"
      >
        <component :is="getIcon(toast.type)" class="w-5 h-5" />
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
