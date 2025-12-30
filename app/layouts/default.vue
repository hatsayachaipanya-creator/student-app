<script setup lang="ts">
import { BookOpen, Calendar, Users, GraduationCap, User } from 'lucide-vue-next'
import { useCourseStore } from '~/stores/course'

const route = useRoute()
const courseStore = useCourseStore()

const menuItems = [
  { path: '/students', name: 'นักศึกษา', icon: Users },
  { path: '/', name: 'รายวิชา', icon: BookOpen },
  { path: '/schedule', name: 'ตารางเรียน', icon: Calendar, badge: true },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="min-h-screen bg-gray-50" data-theme="studentreg">
    <!-- Navbar -->
    <nav class="navbar bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div class="bg-primary text-white p-2 rounded-lg">
            <GraduationCap class="w-5 h-5" />
          </div>
          <span class="font-bold text-lg text-gray-800 hidden sm:inline">ระบบลงทะเบียนเรียน</span>
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="flex items-center gap-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="btn btn-ghost btn-sm gap-2"
            :class="isActive(item.path) ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-gray-800'"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span class="hidden sm:inline">{{ item.name }}</span>
            <span 
              v-if="item.badge && courseStore.currentStudentCourseCount > 0" 
              class="badge badge-primary badge-xs"
            >
              {{ courseStore.currentStudentCourseCount }}
            </span>
          </NuxtLink>
        </div>

        <!-- Selected Student & Credits -->
        <div class="flex items-center gap-2 pl-3 border-l border-gray-200">
          <template v-if="courseStore.selectedStudent">
            <div class="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
              <User class="w-4 h-4 text-primary" />
              <span class="text-sm font-medium text-gray-700 hidden md:inline">{{ courseStore.selectedStudent.name }}</span>
              <span class="badge badge-primary badge-sm">{{ courseStore.currentStudentCredits }}/22</span>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/students" class="btn btn-primary btn-xs gap-1">
              <Users class="w-3 h-3" />
              เลือกนักศึกษา
            </NuxtLink>
          </template>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 max-w-6xl">
      <slot />
    </main>
  </div>
</template>
