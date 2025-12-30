<script setup lang="ts">
import { Wallet, TrendingUp, TrendingDown } from 'lucide-vue-next'

const { totalBalance, totalIncome, totalExpense, isLoaded } = useTransactions()

// Format currency
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
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
            <p class="text-base-content/60 text-sm font-medium">รายรับ</p>
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
            <p class="text-base-content/60 text-sm font-medium">รายจ่าย</p>
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
</template>
