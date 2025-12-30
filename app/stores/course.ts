import { defineStore } from 'pinia'

export interface Course {
  id: string
  code: string
  name: string
  credit: number
  professor: string
  time: string
}

export interface Student {
  id: string
  studentId: string
  name: string
  faculty: string
}

export interface Registration {
  studentId: string
  courseId: string
}

export const useCourseStore = defineStore('course', {
  state: () => ({
    availableCourses: [
      {
        id: '1',
        code: 'CS101',
        name: 'Introduction to Computer Science',
        credit: 3,
        professor: 'Dr. Smith',
        time: 'Mon, Wed 09:00-10:30',
      },
      {
        id: '2',
        code: 'CS201',
        name: 'Data Structures and Algorithms',
        credit: 3,
        professor: 'Dr. Johnson',
        time: 'Tue, Thu 10:00-11:30',
      },
      {
        id: '3',
        code: 'CS301',
        name: 'Database Systems',
        credit: 3,
        professor: 'Dr. Williams',
        time: 'Mon, Wed 13:00-14:30',
      },
      {
        id: '4',
        code: 'CS401',
        name: 'Software Engineering',
        credit: 3,
        professor: 'Dr. Brown',
        time: 'Tue, Thu 14:00-15:30',
      },
      {
        id: '5',
        code: 'MATH101',
        name: 'Calculus I',
        credit: 3,
        professor: 'Dr. Davis',
        time: 'Mon, Wed, Fri 08:00-09:00',
      },
      {
        id: '6',
        code: 'MATH201',
        name: 'Linear Algebra',
        credit: 3,
        professor: 'Dr. Miller',
        time: 'Tue, Thu 08:00-09:30',
      },
      {
        id: '7',
        code: 'ENG101',
        name: 'English Composition',
        credit: 3,
        professor: 'Dr. Wilson',
        time: 'Mon, Wed 10:00-11:30',
      },
      {
        id: '8',
        code: 'PHY101',
        name: 'Physics I',
        credit: 4,
        professor: 'Dr. Moore',
        time: 'Tue, Thu, Fri 13:00-14:00',
      },
      {
        id: '9',
        code: 'CS501',
        name: 'Machine Learning',
        credit: 3,
        professor: 'Dr. Taylor',
        time: 'Mon, Wed 15:00-16:30',
      },
      {
        id: '10',
        code: 'CS502',
        name: 'Web Development',
        credit: 3,
        professor: 'Dr. Anderson',
        time: 'Tue, Thu 15:00-16:30',
      },
    ] as Course[],
    students: [] as Student[],
    selectedStudentId: null as string | null,
    registrations: [] as Registration[],
  }),

  getters: {
    selectedStudent: (state): Student | null => {
      if (!state.selectedStudentId) return null
      return state.students.find((s) => s.id === state.selectedStudentId) || null
    },

    currentStudentCourses: (state): Course[] => {
      if (!state.selectedStudentId) return []
      const courseIds = state.registrations
        .filter((r) => r.studentId === state.selectedStudentId)
        .map((r) => r.courseId)
      return state.availableCourses.filter((c) => courseIds.includes(c.id))
    },

    currentStudentCredits(): number {
      return this.currentStudentCourses.reduce((sum, course) => sum + course.credit, 0)
    },

    currentStudentCourseCount(): number {
      return this.currentStudentCourses.length
    },

    isRegistered: (state) => {
      return (courseId: string): boolean => {
        if (!state.selectedStudentId) return false
        return state.registrations.some(
          (r) => r.studentId === state.selectedStudentId && r.courseId === courseId
        )
      }
    },
  },

  actions: {
    // Student Management
    addStudent(student: Omit<Student, 'id'>): { success: boolean; message: string } {
      if (this.students.some((s) => s.studentId === student.studentId)) {
        return { success: false, message: 'รหัสนักศึกษานี้มีอยู่แล้ว' }
      }
      const newStudent: Student = {
        ...student,
        id: Date.now().toString(),
      }
      this.students.push(newStudent)
      return { success: true, message: `เพิ่มนักศึกษา ${student.name} สำเร็จ` }
    },

    updateStudent(id: string, data: Partial<Omit<Student, 'id'>>): { success: boolean; message: string } {
      const index = this.students.findIndex((s) => s.id === id)
      if (index === -1) {
        return { success: false, message: 'ไม่พบนักศึกษา' }
      }
      // Check duplicate studentId
      if (data.studentId && data.studentId !== this.students[index]!.studentId) {
        if (this.students.some((s) => s.studentId === data.studentId)) {
          return { success: false, message: 'รหัสนักศึกษานี้มีอยู่แล้ว' }
        }
      }
      this.students[index] = { ...this.students[index]!, ...data }
      return { success: true, message: 'แก้ไขข้อมูลสำเร็จ' }
    },

    deleteStudent(id: string): { success: boolean; message: string } {
      const index = this.students.findIndex((s) => s.id === id)
      if (index === -1) {
        return { success: false, message: 'ไม่พบนักศึกษา' }
      }
      const student = this.students[index]!
      // Remove all registrations for this student
      this.registrations = this.registrations.filter((r) => r.studentId !== id)
      // Deselect if currently selected
      if (this.selectedStudentId === id) {
        this.selectedStudentId = null
      }
      this.students.splice(index, 1)
      return { success: true, message: `ลบนักศึกษา ${student.name} สำเร็จ` }
    },

    selectStudent(id: string | null): void {
      this.selectedStudentId = id
    },

    // Course Registration
    register(course: Course): { success: boolean; message: string } {
      if (!this.selectedStudentId) {
        return { success: false, message: 'กรุณาเลือกนักศึกษาก่อน' }
      }

      // Check for duplicates
      if (this.registrations.some(
        (r) => r.studentId === this.selectedStudentId && r.courseId === course.id
      )) {
        return { success: false, message: 'นักศึกษาลงทะเบียนวิชานี้แล้ว' }
      }

      // Check credit limit (22 credits max)
      if (this.currentStudentCredits + course.credit > 22) {
        return {
          success: false,
          message: `ไม่สามารถลงทะเบียนได้ เกิน 22 หน่วยกิต (ปัจจุบัน: ${this.currentStudentCredits})`,
        }
      }

      this.registrations.push({
        studentId: this.selectedStudentId,
        courseId: course.id,
      })
      return { success: true, message: `ลงทะเบียน ${course.code} สำเร็จ` }
    },

    drop(courseId: string): { success: boolean; message: string } {
      if (!this.selectedStudentId) {
        return { success: false, message: 'กรุณาเลือกนักศึกษาก่อน' }
      }

      const index = this.registrations.findIndex(
        (r) => r.studentId === this.selectedStudentId && r.courseId === courseId
      )
      if (index === -1) {
        return { success: false, message: 'ไม่พบวิชาที่ต้องการถอน' }
      }

      const course = this.availableCourses.find((c) => c.id === courseId)
      this.registrations.splice(index, 1)
      return { success: true, message: `ถอนวิชา ${course?.code || ''} สำเร็จ` }
    },
  },

  persist: {
    pick: ['students', 'selectedStudentId', 'registrations'],
  },
})
