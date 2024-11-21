import { defineQuery, useQuery } from '@pinia/colada'

export const useGetTodos = defineQuery(() => {
  const { state, ...rest } = useQuery({
    key: ['todos'],
    query: () => $fetch(`/api/todos`, { method: 'GET' }),
  })
  return {
    ...rest,
    // we can rename properties for convenience too
    todoList: state,
  }
})
