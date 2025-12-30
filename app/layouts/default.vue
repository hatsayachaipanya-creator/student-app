<script setup lang="ts">
import { LayoutDashboard, PlusCircle, Tags, Menu, X, Wallet } from 'lucide-vue-next'

const route = useRoute()
const isSidebarOpen = ref(false)

const menuItems = [
  { 
    path: '/', 
    name: 'แดชบอร์ด', 
    icon: LayoutDashboard 
  },
  { 
    path: '/transactions', 
    name: 'บันทึกรายการ', 
    icon: PlusCircle 
  },
  { 
    path: '/categories', 
    name: 'หมวดหมู่', 
    icon: Tags 
  },
]

const isActive = (path: string) => route.path === path

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white" data-theme="moneytracker">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <button 
            class="btn btn-ghost btn-sm btn-square text-white"
            @click="isSidebarOpen = true"
          >
            <Menu class="w-6 h-6" />
          </button>
          <div class="flex items-center gap-2">
            <Wallet class="w-5 h-5" />
            <span class="font-bold">Money Tracker</span>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Mobile Backdrop -->
      <div 
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeSidebar"
      />

      <!-- Sidebar -->
      <aside 
        class="fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-base-200 shadow-lg z-50 transform transition-transform duration-300 lg:transform-none"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <!-- Sidebar Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-white/20 rounded-lg p-2">
                <Wallet class="w-6 h-6" />
              </div>
              <div>
                <h1 class="font-bold text-lg">Money Tracker</h1>
                <p class="text-emerald-100 text-xs">รายรับ-รายจ่าย</p>
              </div>
            </div>
            <button 
              class="btn btn-ghost btn-sm btn-square text-white lg:hidden"
              @click="closeSidebar"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="p-4 space-y-2">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            :class="[
              isActive(item.path) 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
            ]"
            @click="closeSidebar"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5"
              :class="isActive(item.path) ? 'text-white' : ''"
            />
            <span class="font-medium">{{ item.name }}</span>
          </NuxtLink>
        </nav>

        <!-- Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-base-200">
          <p class="text-center text-xs text-gray-400">© 2024 Money Tracker</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-h-screen lg:ml-0">
        <div class="container mx-auto px-4 py-6 max-w-4xl">
          <slot />
        </div>
      </main>
    </div>

    <!-- Toast Container -->
    <Toast />
  </div>
</template>
