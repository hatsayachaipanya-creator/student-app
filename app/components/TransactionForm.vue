<script setup lang="ts">
import { X, Tag } from 'lucide-vue-next'
import type { Transaction } from '~/composables/useTransactions'

const emit = defineEmits<{
  close: []
  submit: [transaction: Omit<Transaction, 'id'>]
}>()

const props = defineProps<{
  isOpen: boolean
}>()

// Categories
const { categories, loadFromStorage: loadCategories } = useCategories()

// Form state
const title = ref('')
const amount = ref<number | null>(null)
const type = ref<'income' | 'expense'>('expense')
const date = ref(new Date().toISOString().split('T')[0])
const categoryId = ref('')

// Load categories on mount
onMounted(() => {
  loadCategories()
})

// Filter categories by type
const filteredCategories = computed(() => {
  // Income categories (green-ish colors or specific names)
  const incomeKeywords = ['เงินเดือน', 'รายได้', 'income', 'salary']
  
  if (type.value === 'income') {
    return categories.value.filter(c => 
      incomeKeywords.some(k => c.name.toLowerCase().includes(k.toLowerCase())) ||
      c.color === '#22c55e' || c.color === '#10b981'
    )
  }
  
  // Expense categories (all others)
  return categories.value.filter(c => 
    !incomeKeywords.some(k => c.name.toLowerCase().includes(k.toLowerCase()))
  )
})

// Reset category when type changes
watch(type, () => {
  categoryId.value = ''
})

// Reset form
const resetForm = () => {
  title.value = ''
  amount.value = null
  type.value = 'expense'
  date.value = new Date().toISOString().split('T')[0]
  categoryId.value = ''
}

// Handle submit
const handleSubmit = () => {
  if (!title.value.trim() || !amount.value || amount.value <= 0) {
    return
  }

  emit('submit', {
    title: title.value.trim(),
    amount: amount.value,
    type: type.value,
    date: date.value,
    categoryId: categoryId.value || undefined,
  })

  resetForm()
  emit('close')
}

// Handle close
const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <dialog class="modal modal-bottom sm:modal-middle" :class="{ 'modal-open': isOpen }">
    <div class="modal-box bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-lg">เพิ่มรายการใหม่</h3>
        <button 
          class="btn btn-sm btn-circle btn-ghost"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Type Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">ประเภท</span>
          </label>
          <div class="flex gap-2">
            <label 
              class="flex-1 cursor-pointer"
              :class="[
                'btn',
                type === 'income' 
                  ? 'btn-success text-white' 
                  : 'btn-outline btn-success'
              ]"
            >
              <input 
                type="radio" 
                v-model="type" 
                value="income" 
                class="hidden" 
              />
              รายรับ
            </label>
            <label 
              class="flex-1 cursor-pointer"
              :class="[
                'btn',
                type === 'expense' 
                  ? 'btn-error text-white' 
                  : 'btn-outline btn-error'
              ]"
            >
              <input 
                type="radio" 
                v-model="type" 
                value="expense" 
                class="hidden" 
              />
              รายจ่าย
            </label>
          </div>
        </div>

        <!-- Category Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">หมวดหมู่</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in filteredCategories"
              :key="cat.id"
              type="button"
              class="btn btn-sm gap-1.5 px-3 rounded-full transition-all"
              :class="categoryId === cat.id ? '' : 'btn-ghost border border-base-300'"
              :style="categoryId === cat.id ? { 
                backgroundColor: cat.color + '20', 
                color: cat.color,
                borderColor: cat.color 
              } : {}"
              @click="categoryId = cat.id"
            >
              <span 
                class="w-3 h-3 rounded-full" 
                :style="{ backgroundColor: cat.color }"
              />
              {{ cat.name }}
            </button>
          </div>
          <p v-if="filteredCategories.length === 0" class="text-sm text-gray-400 mt-2">
            ไม่มีหมวดหมู่สำหรับประเภทนี้
          </p>
        </div>

        <!-- Title -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">รายละเอียด</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="เช่น เงินเดือน, ค่าอาหาร, ค่าเดินทาง"
            class="input input-bordered w-full focus:input-primary"
            required
          />
        </div>

        <!-- Amount -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">จำนวนเงิน (บาท)</span>
          </label>
          <input
            v-model="amount"
            type="number"
            placeholder="0"
            min="1"
            class="input input-bordered w-full focus:input-primary text-lg font-semibold"
            required
          />
        </div>

        <!-- Date -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">วันที่</span>
          </label>
          <input
            v-model="date"
            type="date"
            class="input input-bordered w-full focus:input-primary"
            required
          />
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button 
            type="button" 
            class="btn btn-ghost"
            @click="handleClose"
          >
            ยกเลิก
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!title.trim() || !amount || amount <= 0"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
    
    <!-- Backdrop -->
    <form method="dialog" class="modal-backdrop">
      <button @click="handleClose">close</button>
    </form>
  </dialog>
</template>
