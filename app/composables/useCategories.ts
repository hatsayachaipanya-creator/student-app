// Category interface
export interface Category {
  id: string
  name: string
  color: string
}

// Default categories
export const defaultCategories: Category[] = [
  { id: '1', name: 'อาหาร', color: '#f59e0b' },
  { id: '2', name: 'เดินทาง', color: '#3b82f6' },
  { id: '3', name: 'ช้อปปิ้ง', color: '#ec4899' },
  { id: '4', name: 'ค่าน้ำ-ค่าไฟ', color: '#8b5cf6' },
  { id: '5', name: 'เงินเดือน', color: '#22c55e' },
  { id: '6', name: 'รายได้พิเศษ', color: '#10b981' },
  { id: '7', name: 'บันเทิง', color: '#ef4444' },
  { id: '8', name: 'สุขภาพ', color: '#06b6d4' },
]

const STORAGE_KEY = 'money-tracker-categories'

export const useCategories = () => {
  const categories = useState<Category[]>('categories', () => [])
  const isLoaded = useState<boolean>('categories-loaded', () => false)

  // Load from localStorage
  const loadFromStorage = () => {
    if (import.meta.client && !isLoaded.value) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          categories.value = JSON.parse(stored)
        } else {
          categories.value = [...defaultCategories]
          saveToStorage()
        }
      } catch (error) {
        categories.value = [...defaultCategories]
      }
      isLoaded.value = true
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.value))
    }
  }

  // Add category
  const addCategory = (name: string, color: string) => {
    const newCat: Category = {
      id: Date.now().toString(),
      name,
      color,
    }
    categories.value.push(newCat)
    saveToStorage()
    return newCat
  }

  // Update category
  const updateCategory = (id: string, name: string, color: string) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { id, name, color }
      saveToStorage()
    }
  }

  // Delete category
  const deleteCategory = (id: string) => {
    categories.value = categories.value.filter(c => c.id !== id)
    saveToStorage()
  }

  // Get category by ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.value.find(c => c.id === id)
  }

  // Reset to defaults
  const resetToDefaults = () => {
    categories.value = [...defaultCategories]
    saveToStorage()
  }

  return {
    categories,
    isLoaded,
    loadFromStorage,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    resetToDefaults,
  }
}
