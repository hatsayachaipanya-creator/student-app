<script setup lang="ts">
import { Calendar, Trash2, BookX, AlertCircle } from 'lucide-vue-next'
import { useCourseStore } from '~/stores/course'

const courseStore = useCourseStore()

const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')
const showAlert = ref(false)

const handleDrop = (courseId: string) => {
  const result = courseStore.drop(courseId)
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
      <h1 class="text-2xl font-bold text-gray-800">ตารางเรียนของฉัน</h1>
      <p class="text-gray-500 text-sm mt-1">รายวิชาที่ลงทะเบียนแล้ว</p>
    </div>

    <!-- No Student Selected Warning -->
    <div v-if="!courseStore.selectedStudent" class="alert alert-warning mb-6">
      <AlertCircle class="w-5 h-5" />
      <span>กรุณาเลือกนักศึกษาก่อนดูตารางเรียน</span>
      <NuxtLink to="/students" class="btn btn-sm">ไปหน้านักศึกษา</NuxtLink>
    </div>

    <template v-else>
      <!-- Alert Toast -->
      <div v-if="showAlert" class="toast toast-top toast-center z-50">
        <div 
          class="alert shadow-lg"
          :class="{
            'alert-success': alertType === 'success',
            'alert-error': alertType === 'error'
          }"
        >
          <span>{{ alertMessage }}</span>
        </div>
      </div>

      <!-- Student Info & Summary Card -->
      <div class="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-5 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">นักศึกษา</p>
            <p class="text-xl font-bold mt-1">{{ courseStore.selectedStudent.name }}</p>
            <p class="text-sm opacity-70">{{ courseStore.selectedStudent.studentId }} • {{ courseStore.selectedStudent.faculty }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm opacity-80">หน่วยกิตรวม</p>
            <p class="text-3xl font-bold mt-1">{{ courseStore.currentStudentCredits }}<span class="text-lg opacity-70">/22</span></p>
          </div>
        </div>
        <progress 
          class="progress progress-warning w-full mt-4" 
          :value="courseStore.currentStudentCredits" 
          max="22"
        />
      </div>

      <!-- Courses Table -->
      <div v-if="courseStore.currentStudentCourses.length > 0" class="overflow-x-auto">
        <table class="table bg-white border border-base-200 rounded-lg">
          <thead>
            <tr class="bg-base-200/50">
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>หน่วยกิต</th>
              <th>อาจารย์ผู้สอน</th>
              <th class="hidden md:table-cell">เวลาเรียน</th>
              <th class="text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courseStore.currentStudentCourses" :key="course.id" class="hover">
              <td>
                <span class="badge badge-primary badge-sm font-mono">{{ course.code }}</span>
              </td>
              <td class="font-medium">{{ course.name }}</td>
              <td>{{ course.credit }}</td>
              <td>{{ course.professor }}</td>
              <td class="hidden md:table-cell text-sm text-gray-500">{{ course.time }}</td>
              <td class="text-center">
                <button 
                  class="btn btn-error btn-xs gap-1"
                  @click="handleDrop(course.id)"
                >
                  <Trash2 class="w-3 h-3" />
                  ถอน
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white border border-base-200 rounded-xl p-12 text-center">
        <BookX class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-600">ยังไม่มีวิชาที่ลงทะเบียน</h3>
        <p class="text-gray-400 text-sm mt-2">ไปที่หน้ารายวิชาเพื่อเลือกลงทะเบียน</p>
        <NuxtLink to="/" class="btn btn-primary btn-sm mt-4">
          ดูรายวิชา
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
