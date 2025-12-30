<script setup lang="ts">
import { BookOpen, Clock, User, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { useCourseStore } from '~/stores/course'

const courseStore = useCourseStore()

const alertMessage = ref('')
const alertType = ref<'success' | 'error' | 'warning'>('success')
const showAlert = ref(false)

const handleRegister = (course: typeof courseStore.availableCourses[0]) => {
  const result = courseStore.register(course)
  alertMessage.value = result.message
  alertType.value = result.success ? 'success' : 'error'
  showAlert.value = true
  
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">รายวิชาที่เปิดสอน</h1>
      <p class="text-gray-500 text-sm mt-1">เลือกวิชาที่ต้องการลงทะเบียน (สูงสุด 22 หน่วยกิต)</p>
    </div>

    <!-- No Student Selected Warning -->
    <div v-if="!courseStore.selectedStudent" class="alert alert-warning mb-6">
      <AlertCircle class="w-5 h-5" />
      <span>กรุณาเลือกนักศึกษาก่อนลงทะเบียน</span>
      <NuxtLink to="/students" class="btn btn-sm">ไปหน้านักศึกษา</NuxtLink>
    </div>

    <!-- Alert Toast -->
    <div v-if="showAlert" class="toast toast-top toast-center z-50">
      <div 
        class="alert shadow-lg"
        :class="{
          'alert-success': alertType === 'success',
          'alert-error': alertType === 'error',
          'alert-warning': alertType === 'warning'
        }"
      >
        <span>{{ alertMessage }}</span>
      </div>
    </div>

    <!-- Course Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="course in courseStore.availableCourses" 
        :key="course.id"
        class="card bg-white border border-base-200 hover:shadow-md transition-shadow"
      >
        <div class="card-body p-4">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <span class="badge badge-primary font-mono text-xs">{{ course.code }}</span>
            <span class="text-sm text-gray-500">{{ course.credit }} หน่วยกิต</span>
          </div>

          <!-- Course Name -->
          <h2 class="font-semibold text-gray-800 mt-2 line-clamp-2">{{ course.name }}</h2>

          <!-- Details -->
          <div class="mt-3 space-y-1 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <User class="w-3.5 h-3.5 text-gray-400" />
              <span>{{ course.professor }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Clock class="w-3.5 h-3.5 text-gray-400" />
              <span class="text-xs">{{ course.time }}</span>
            </div>
          </div>

          <!-- Button -->
          <div class="mt-4">
            <button 
              v-if="courseStore.isRegistered(course.id)"
              class="btn btn-success btn-sm w-full gap-2"
              disabled
            >
              <CheckCircle class="w-4 h-4" />
              ลงทะเบียนแล้ว
            </button>
            <button 
              v-else
              class="btn btn-primary btn-sm w-full"
              :disabled="!courseStore.selectedStudent"
              @click="handleRegister(course)"
            >
              ลงทะเบียน
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="courseStore.availableCourses.length === 0" class="text-center py-16">
      <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">ไม่มีวิชาที่เปิดสอน</p>
    </div>
  </div>
</template>
