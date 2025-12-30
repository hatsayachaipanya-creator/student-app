<script setup lang="ts">
import { Wallet, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-vue-next'
import type { Transaction } from '~/composables/useTransactions'

// Use transactions composable
const { 
  sortedTransactions, 
  isLoaded, 
  loadFromStorage, 
  totalBalance,
  totalIncome,
  totalExpense
} = useTransactions()

// Load data on mount
onMounted(() => {
  loadFromStorage()
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
  }).format(date)
}

// Get recent transactions (last 5)
const recentTransactions = computed(() => {
  return sortedTransactions.value.slice(0, 5)
})

// Get today's stats
const todayStats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayTx = sortedTransactions.value.filter(tx => tx.date === today)
  
  return {
    income: todayTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0),
    expense: todayTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0),
    count: todayTx.length
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
      <p class="text-gray-500 text-sm mt-1">ภาพรวมรายรับ-รายจ่ายของคุณ</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Balance Card -->
      <div class="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-100 text-sm font-medium">ยอดคงเหลือ</p>
              <p class="text-2xl font-bold mt-1">
                <template v-if="isLoaded">{{ formatMoney(totalBalance) }}</template>
                <span v-else class="loading loading-dots loading-sm"></span>
              </p>
            </div>
            <div class="bg-white/20 rounded-full p-3">
              <Wallet class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <!-- Income Card -->
      <div class="card bg-base-100 border border-success/20 shadow-md">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base-content/60 text-sm font-medium">รายรับทั้งหมด</p>
              <p class="text-xl font-bold text-success mt-1">
                <template v-if="isLoaded">+{{ formatMoney(totalIncome) }}</template>
                <span v-else class="loading loading-dots loading-sm"></span>
              </p>
            </div>
            <div class="bg-success/10 rounded-full p-3">
              <TrendingUp class="w-5 h-5 text-success" />
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Card -->
      <div class="card bg-base-100 border border-error/20 shadow-md">
        <div class="card-body p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base-content/60 text-sm font-medium">รายจ่ายทั้งหมด</p>
              <p class="text-xl font-bold text-error mt-1">
                <template v-if="isLoaded">-{{ formatMoney(totalExpense) }}</template>
                <span v-else class="loading loading-dots loading-sm"></span>
              </p>
            </div>
            <div class="bg-error/10 rounded-full p-3">
              <TrendingDown class="w-5 h-5 text-error" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Activity -->
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body p-5">
        <h2 class="font-bold text-lg mb-4 flex items-center gap-2">
          <Calendar class="w-5 h-5 text-emerald-500" />
          กิจกรรมวันนี้
        </h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-emerald-600">{{ todayStats.count }}</p>
            <p class="text-sm text-gray-500">รายการ</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-success">+{{ formatMoney(todayStats.income) }}</p>
            <p class="text-sm text-gray-500">รายรับ</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-error">-{{ formatMoney(todayStats.expense) }}</p>
            <p class="text-sm text-gray-500">รายจ่าย</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-lg">รายการล่าสุด</h2>
          <NuxtLink to="/transactions" class="text-sm text-emerald-600 hover:underline">
            ดูทั้งหมด →
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-if="isLoaded && recentTransactions.length === 0" class="text-center py-8">
          <div class="bg-base-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Calendar class="w-6 h-6 text-base-content/40" />
          </div>
          <p class="text-base-content/60 text-sm">ยังไม่มีรายการ</p>
          <NuxtLink to="/transactions" class="btn btn-primary btn-sm mt-3">
            เพิ่มรายการแรก
          </NuxtLink>
        </div>

        <!-- Transaction List -->
        <div v-else class="space-y-3">
          <div 
            v-for="tx in recentTransactions" 
            :key="tx.id"
            class="flex items-center gap-3 p-3 bg-base-50 rounded-lg hover:bg-base-100 transition-colors"
          >
            <div 
              class="rounded-full p-2"
              :class="tx.type === 'income' ? 'bg-success/10' : 'bg-error/10'"
            >
              <ArrowUpCircle v-if="tx.type === 'income'" class="w-4 h-4 text-success" />
              <ArrowDownCircle v-else class="w-4 h-4 text-error" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">{{ tx.title }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(tx.date) }}</p>
            </div>
            <p 
              class="font-bold text-sm"
              :class="tx.type === 'income' ? 'text-success' : 'text-error'"
            >
              {{ tx.type === 'income' ? '+' : '-' }}{{ formatMoney(tx.amount) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
