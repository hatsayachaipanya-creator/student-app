<script setup lang="ts">
import { Plus, Trash2, Tag, Edit2, X, Check } from 'lucide-vue-next'

// Color presets
const colorPresets = [
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', 
  '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#facc15',
]

// Use categories composable
const { 
  categories, 
  isLoaded, 
  loadFromStorage, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  resetToDefaults 
} = useCategories()

// Modal state
const isModalOpen = ref(false)
const editingCategory = ref<{ id: string; name: string; color: string } | null>(null)

// Form state
const newCategoryName = ref('')
const newCategoryColor = ref('#22c55e')

// Load categories on mount
onMounted(() => {
  loadFromStorage()
})

// Add category handler
const handleAddCategory = () => {
  if (!newCategoryName.value.trim()) return
  
  addCategory(newCategoryName.value.trim(), newCategoryColor.value)
  
  newCategoryName.value = ''
  newCategoryColor.value = '#22c55e'
  isModalOpen.value = false
}

// Edit handlers
const startEdit = (cat: { id: string; name: string; color: string }) => {
  editingCategory.value = { ...cat }
}

const saveEdit = () => {
  if (!editingCategory.value) return
  updateCategory(editingCategory.value.id, editingCategory.value.name, editingCategory.value.color)
  editingCategory.value = null
}

const cancelEdit = () => {
  editingCategory.value = null
}

// Delete handler
const handleDelete = (id: string) => {
  deleteCategory(id)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">หมวดหมู่</h1>
        <p class="text-gray-500 text-sm mt-1">จัดการหมวดหมู่รายรับ-รายจ่าย</p>
      </div>
      <button 
        class="btn btn-primary gap-2"
        @click="isModalOpen = true"
      >
        <Plus class="w-5 h-5" />
        <span class="hidden sm:inline">เพิ่มหมวดหมู่</span>
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <template v-if="!isLoaded">
        <div class="col-span-full flex justify-center py-8">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </template>

      <template v-else>
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          class="card bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="card-body p-4">
            <!-- Normal View -->
            <div v-if="editingCategory?.id !== cat.id" class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{ backgroundColor: cat.color + '20' }"
              >
                <Tag class="w-5 h-5" :style="{ color: cat.color }" />
              </div>
              <span class="flex-1 font-medium">{{ cat.name }}</span>
              <button 
                class="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-emerald-600"
                @click="startEdit(cat)"
              >
                <Edit2 class="w-4 h-4" />
              </button>
              <button 
                class="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-error"
                @click="handleDelete(cat.id)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <!-- Edit View -->
            <div v-else class="space-y-3">
              <input
                v-model="editingCategory.name"
                type="text"
                class="input input-bordered input-sm w-full"
                placeholder="ชื่อหมวดหมู่"
              />
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="color in colorPresets"
                  :key="color"
                  class="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  :class="editingCategory.color === color ? 'border-gray-800 scale-110' : 'border-transparent'"
                  :style="{ backgroundColor: color }"
                  @click="editingCategory.color = color"
                />
              </div>
              <div class="flex gap-2">
                <button 
                  class="btn btn-primary btn-sm flex-1 gap-1"
                  @click="saveEdit"
                >
                  <Check class="w-4 h-4" />
                  บันทึก
                </button>
                <button 
                  class="btn btn-ghost btn-sm"
                  @click="cancelEdit"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Reset Button -->
    <div class="text-center">
      <button 
        class="btn btn-ghost btn-sm text-gray-400"
        @click="resetToDefaults"
      >
        รีเซ็ตเป็นค่าเริ่มต้น
      </button>
    </div>

    <!-- Add Category Modal -->
    <dialog class="modal modal-bottom sm:modal-middle" :class="{ 'modal-open': isModalOpen }">
      <div class="modal-box bg-white">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg">เพิ่มหมวดหมู่ใหม่</h3>
          <button 
            class="btn btn-sm btn-circle btn-ghost"
            @click="isModalOpen = false"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">ชื่อหมวดหมู่</span>
            </label>
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="เช่น อาหาร, เดินทาง"
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">สี</span>
            </label>
            <div class="flex gap-3 flex-wrap">
              <button
                v-for="color in colorPresets"
                :key="color"
                class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                :class="newCategoryColor === color ? 'border-gray-800 scale-110' : 'border-transparent'"
                :style="{ backgroundColor: color }"
                @click="newCategoryColor = color"
              />
            </div>
          </div>

          <div class="modal-action">
            <button 
              class="btn btn-ghost"
              @click="isModalOpen = false"
            >
              ยกเลิก
            </button>
            <button 
              class="btn btn-primary"
              :disabled="!newCategoryName.trim()"
              @click="handleAddCategory"
            >
              เพิ่มหมวดหมู่
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="isModalOpen = false">close</button>
      </form>
    </dialog>
  </div>
</template>
