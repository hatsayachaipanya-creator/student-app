<script setup lang="ts">
import { Users, Plus, Pencil, Trash2, X } from 'lucide-vue-next'
import { useCourseStore } from '~/stores/course'

const courseStore = useCourseStore()

const showForm = ref(false)
const editingId = ref<string | null>(null)
const form = ref({
  studentId: '',
  name: '',
  faculty: '',
})

const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')
const showAlert = ref(false)

const showToast = (message: string, type: 'success' | 'error') => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true
  setTimeout(() => { showAlert.value = false }, 3000)
}

const resetForm = () => {
  form.value = { studentId: '', name: '', faculty: '' }
  editingId.value = null
  showForm.value = false
}

const openAdd = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (student: typeof courseStore.students[0]) => {
  form.value = {
    studentId: student.studentId,
    name: student.name,
    faculty: student.faculty,
  }
  editingId.value = student.id
  showForm.value = true
}

const handleSubmit = () => {
  if (!form.value.studentId || !form.value.name || !form.value.faculty) {
    showToast('กรุณากรอกข้อมูลให้ครบ', 'error')
    return
  }

  let result
  if (editingId.value) {
    result = courseStore.updateStudent(editingId.value, form.value)
  } else {
    result = courseStore.addStudent(form.value)
  }

  showToast(result.message, result.success ? 'success' : 'error')
  if (result.success) resetForm()
}

const handleDelete = (id: string) => {
  const result = courseStore.deleteStudent(id)
  showToast(result.message, result.success ? 'success' : 'error')
}

const handleSelect = (id: string) => {
  courseStore.selectStudent(id)
  showToast('เลือกนักศึกษาแล้ว', 'success')
}

const getStudentCourseCount = (studentId: string): number => {
  return courseStore.registrations.filter((r) => r.studentId === studentId).length
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">จัดการนักศึกษา</h1>
        <p class="text-gray-500 text-sm mt-1">เพิ่ม แก้ไข และเลือกนักศึกษาเพื่อลงทะเบียน</p>
      </div>
      <button class="btn btn-primary btn-sm gap-2" @click="openAdd">
        <Plus class="w-4 h-4" />
        เพิ่มนักศึกษา
      </button>
    </div>

    <!-- Alert Toast -->
    <div v-if="showAlert" class="toast toast-top toast-center z-50">
      <div 
        class="alert shadow-lg"
        :class="{ 'alert-success': alertType === 'success', 'alert-error': alertType === 'error' }"
      >
        <span>{{ alertMessage }}</span>
      </div>
    </div>

    <!-- Add/Edit Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">{{ editingId ? 'แก้ไขนักศึกษา' : 'เพิ่มนักศึกษา' }}</h2>
          <button class="btn btn-ghost btn-sm btn-square" @click="resetForm">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="label"><span class="label-text">รหัสนักศึกษา</span></label>
            <input
              v-model="form.studentId"
              type="text"
              class="input input-bordered w-full"
              placeholder="เช่น 65010001"
            />
          </div>
          <div>
            <label class="label"><span class="label-text">ชื่อ-นามสกุล</span></label>
            <input
              v-model="form.name"
              type="text"
              class="input input-bordered w-full"
              placeholder="เช่น สมชาย ใจดี"
            />
          </div>
          <div>
            <label class="label"><span class="label-text">คณะ</span></label>
            <input
              v-model="form.faculty"
              type="text"
              class="input input-bordered w-full"
              placeholder="เช่น วิศวกรรมศาสตร์"
            />
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button class="btn btn-ghost flex-1" @click="resetForm">ยกเลิก</button>
          <button class="btn btn-primary flex-1" @click="handleSubmit">
            {{ editingId ? 'บันทึก' : 'เพิ่ม' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div v-if="courseStore.students.length > 0" class="overflow-x-auto">
      <table class="table bg-white border border-base-200 rounded-lg">
        <thead>
          <tr class="bg-base-200/50">
            <th>รหัสนักศึกษา</th>
            <th>ชื่อ-นามสกุล</th>
            <th>คณะ</th>
            <th>วิชาที่ลง</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in courseStore.students"
            :key="student.id"
            class="hover"
            :class="{ 'bg-primary/10': courseStore.selectedStudentId === student.id }"
          >
            <td>
              <span class="font-mono text-sm">{{ student.studentId }}</span>
            </td>
            <td class="font-medium">{{ student.name }}</td>
            <td>{{ student.faculty }}</td>
            <td>
              <span class="badge badge-ghost">{{ getStudentCourseCount(student.id) }} วิชา</span>
            </td>
            <td>
              <div class="flex items-center justify-center gap-1">
                <button
                  class="btn btn-success btn-xs"
                  :class="{ 'btn-outline': courseStore.selectedStudentId !== student.id }"
                  @click="handleSelect(student.id)"
                >
                  {{ courseStore.selectedStudentId === student.id ? 'กำลังเลือก' : 'เลือก' }}
                </button>
                <button class="btn btn-ghost btn-xs" @click="openEdit(student)">
                  <Pencil class="w-3 h-3" />
                </button>
                <button class="btn btn-ghost btn-xs text-error" @click="handleDelete(student.id)">
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-base-200 rounded-xl p-12 text-center">
      <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-600">ยังไม่มีนักศึกษา</h3>
      <p class="text-gray-400 text-sm mt-2">เพิ่มนักศึกษาเพื่อเริ่มลงทะเบียนวิชา</p>
      <button class="btn btn-primary btn-sm mt-4 gap-2" @click="openAdd">
        <Plus class="w-4 h-4" />
        เพิ่มนักศึกษา
      </button>
    </div>
  </div>
</template>
