<script setup lang="ts">
import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-vue-next'
import type { Transaction } from '~/composables/useTransactions'

defineProps<{
  transactions: Transaction[]
  isLoaded: boolean
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

// Categories
const { getCategoryById, loadFromStorage: loadCategories } = useCategories()

// Load categories
onMounted(() => {
  loadCategories()
})

// Format currency
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// Confirm delete
const handleDelete = (id: string) => {
  emit('delete', id)
}
</script>

<template>
  <div class="space-y-3">
    <!-- Loading State -->
    <template v-if="!isLoaded">
      <div class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else-if="transactions.length === 0">
      <div class="text-center py-12">
        <div class="bg-base-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Calendar class="w-8 h-8 text-base-content/40" />
        </div>
        <p class="text-base-content/60 font-medium">ยังไม่มีรายการ</p>
        <p class="text-base-content/40 text-sm mt-1">เริ่มบันทึกรายรับ-รายจ่ายของคุณ</p>
      </div>
    </template>

    <!-- Transaction List -->
    <template v-else>
      <div 
        v-for="tx in transactions" 
        :key="tx.id"
        class="card bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="card-body p-4">
          <div class="flex items-center gap-4">
            <!-- Icon -->
            <div 
              class="rounded-full p-2.5"
              :class="tx.type === 'income' ? 'bg-success/10' : 'bg-error/10'"
            >
              <TrendingUp 
                v-if="tx.type === 'income'" 
                class="w-5 h-5 text-success" 
              />
              <TrendingDown 
                v-else 
                class="w-5 h-5 text-error" 
              />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-base-content truncate">{{ tx.title }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-sm text-base-content/50">{{ formatDate(tx.date) }}</span>
                <!-- Category Badge -->
                <span 
                  v-if="tx.categoryId && getCategoryById(tx.categoryId)"
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  :style="{ 
                    backgroundColor: getCategoryById(tx.categoryId)!.color + '20',
                    color: getCategoryById(tx.categoryId)!.color
                  }"
                >
                  <span 
                    class="w-1.5 h-1.5 rounded-full"
                    :style="{ backgroundColor: getCategoryById(tx.categoryId)!.color }"
                  />
                  {{ getCategoryById(tx.categoryId)!.name }}
                </span>
              </div>
            </div>

            <!-- Amount -->
            <div class="text-right">
              <p 
                class="font-bold"
                :class="tx.type === 'income' ? 'text-success' : 'text-error'"
              >
                {{ tx.type === 'income' ? '+' : '-' }}{{ formatMoney(tx.amount) }}
              </p>
            </div>

            <!-- Delete Button -->
            <button 
              class="btn btn-ghost btn-sm btn-square text-base-content/40 hover:text-error hover:bg-error/10"
              @click="handleDelete(tx.id)"
              title="ลบรายการ"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
