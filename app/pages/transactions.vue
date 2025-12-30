<script setup lang="ts">
import { Plus, Trash2, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-vue-next'
import type { Transaction } from '~/composables/useTransactions'

// Use transactions composable
const { 
  sortedTransactions, 
  isLoaded, 
  loadFromStorage, 
  addTransaction, 
  deleteTransaction 
} = useTransactions()

// Toast for notifications
const { showToast } = useToast()

// Modal state
const isModalOpen = ref(false)

// Filter state
const filterType = ref<'all' | 'income' | 'expense'>('all')

// Load data on mount
onMounted(() => {
  loadFromStorage()
})

// Filtered transactions
const filteredTransactions = computed(() => {
  if (filterType.value === 'all') {
    return sortedTransactions.value
  }
  return sortedTransactions.value.filter(tx => tx.type === filterType.value)
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

// Handle add transaction
const handleAddTransaction = (tx: Omit<Transaction, 'id'>) => {
  addTransaction(tx)
  showToast(tx.type === 'income' ? 'เพิ่มรายรับเรียบร้อย' : 'เพิ่มรายจ่ายเรียบร้อย', 'success')
}

// Handle delete transaction
const handleDeleteTransaction = (id: string) => {
  deleteTransaction(id)
  showToast('ลบรายการเรียบร้อย', 'success')
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <!-- Page Title -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">บันทึกรายการ</h1>
        <p class="text-gray-500 text-sm mt-1">จัดการรายรับ-รายจ่ายของคุณ</p>
      </div>
      <button 
        class="btn btn-primary gap-2 px-4 rounded-xl"
        @click="isModalOpen = true"
      >
        <Plus class="w-5 h-5" />
        <span class="hidden sm:inline">เพิ่มรายการ</span>
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2">
      <button 
        class="btn btn-sm px-4 rounded-full"
        :class="filterType === 'all' ? 'btn-primary' : 'btn-ghost bg-base-200'"
        @click="filterType = 'all'"
      >
        ทั้งหมด
      </button>
      <button 
        class="btn btn-sm gap-1 px-4 rounded-full"
        :class="filterType === 'income' ? 'btn-success text-white' : 'btn-ghost bg-base-200 text-success'"
        @click="filterType = 'income'"
      >
        <TrendingUp class="w-4 h-4" />
        รายรับ
      </button>
      <button 
        class="btn btn-sm gap-1 px-4 rounded-full"
        :class="filterType === 'expense' ? 'btn-error text-white' : 'btn-ghost bg-base-200 text-error'"
        @click="filterType = 'expense'"
      >
        <TrendingDown class="w-4 h-4" />
        รายจ่าย
      </button>
    </div>

    <!-- Transaction List -->
    <div class="space-y-3">
      <!-- Loading State -->
      <template v-if="!isLoaded">
        <div class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="filteredTransactions.length === 0">
        <div class="text-center py-12">
          <div class="bg-base-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar class="w-8 h-8 text-base-content/40" />
          </div>
          <p class="text-base-content/60 font-medium">
            {{ filterType === 'all' ? 'ยังไม่มีรายการ' : filterType === 'income' ? 'ยังไม่มีรายรับ' : 'ยังไม่มีรายจ่าย' }}
          </p>
          <p class="text-base-content/40 text-sm mt-1">เริ่มบันทึกรายการของคุณ</p>
        </div>
      </template>

      <!-- Transaction Items -->
      <template v-else>
        <div 
          v-for="tx in filteredTransactions" 
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
                <p class="text-sm text-base-content/50">{{ formatDate(tx.date) }}</p>
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
                @click="handleDeleteTransaction(tx.id)"
                title="ลบรายการ"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Add Transaction Modal -->
    <TransactionForm 
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @submit="handleAddTransaction"
    />
  </div>
</template>
