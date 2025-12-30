// Transaction interface for type safety
export interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string // ISO format
  categoryId?: string
}

const STORAGE_KEY = 'money-tracker-transactions'

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const useTransactions = () => {
  // Reactive state - starts empty to avoid hydration mismatch
  const transactions = useState<Transaction[]>('transactions', () => [])
  const isLoaded = useState<boolean>('transactions-loaded', () => false)

  // Load from localStorage on client-side only
  const loadFromStorage = () => {
    if (import.meta.client && !isLoaded.value) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          transactions.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Error loading transactions:', error)
      }
      isLoaded.value = true
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions.value))
      } catch (error) {
        console.error('Error saving transactions:', error)
      }
    }
  }

  // Add new transaction
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...tx,
      id: generateId(),
    }
    transactions.value = [newTransaction, ...transactions.value]
    saveToStorage()
  }

  // Delete transaction by ID
  const deleteTransaction = (id: string) => {
    transactions.value = transactions.value.filter(tx => tx.id !== id)
    saveToStorage()
  }

  // Computed values
  const totalIncome = computed(() => {
    return transactions.value
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)
  })

  const totalExpense = computed(() => {
    return transactions.value
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)
  })

  const totalBalance = computed(() => {
    return totalIncome.value - totalExpense.value
  })

  // Sorted transactions (newest first)
  const sortedTransactions = computed(() => {
    return [...transactions.value].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })

  return {
    transactions,
    isLoaded,
    loadFromStorage,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    totalBalance,
    sortedTransactions,
  }
}
