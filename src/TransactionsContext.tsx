import { type } from 'node:os'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from './services/api'

interface TransactionsProps {
  id: number
  title: string
  amount: number
  category: string
  type: string
  createdAt: string
}

interface TransactionsProviderProps {
  children: ReactNode
}

interface TransactionsContextData {
  transactions: TransactionsProps[]
  createTransaction: (transaction: TransactionInput) => void
}

type TransactionInput = Omit<TransactionsProps, 'id' | 'createdAt'>

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionsProps[]>([])

  useEffect(() => {
    api
      .get('/transactions')
      .then((response) => setTransactions(response.data.transactions))
  }, [])

  function createTransaction(transaction: TransactionInput) {
    api.post('/transactions', transaction)
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
