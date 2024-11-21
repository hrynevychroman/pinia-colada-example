import { defineMutation, useMutation, useQueryCache } from '@pinia/colada'
import type { Todo } from '~/server/database/schema'

export const useCreateTodo = defineMutation(() => {
  const queryCache = useQueryCache()
  const toast = useToast()

  const { mutateAsync: createTodo, ...mutation } = useMutation({
    key: ['createTodo'],

    mutation: (title: string) =>
      $fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title }),
      }),

    onMutate(text) {
      // save the current todo list
      const oldTodoList = queryCache.getQueryData<Todo[]>(['todos'])

      // keep track of the new todo item
      const newTodoItem: Todo = {
        title: text,
        createdAt: new Date().toISOString(),
        completed: false,
        id: (oldTodoList?.at(-1)?.id || 0) + 1,
      }

      // create a copy of the current todo list with the new todo
      const newTodoList: Todo[] = [
        ...(oldTodoList || []),
        newTodoItem,
      ]
      // update the cache with the new todo list
      queryCache.setQueryData(['todos'], newTodoList)

      // we cancel (without refetching) all queries that depend on the todo list
      // to prevent them from updating the cache with an outdated value
      queryCache.cancelQueries({ key: ['todos'] })

      // pass the old and new todo list to the other hooks
      // to handle rollbacks
      return { newTodoList, oldTodoList, newTodoItem }
    },

    onError(err, _title, { oldTodoList, newTodoList }) {
      // before applying the rollback, we need to check if the value in the cache is the same
      // because the cache could have been updated by another mutation or query
      if (newTodoList === queryCache.getQueryData(['todos'])) {
        queryCache.setQueryData(['todos'], oldTodoList)
      }

      // handle the error
      console.error('An error occurred when creating a todo:', err)

      toast.add({
        title: 'Error',
        description: 'An error occurred when creating a todo 😕',
        color: 'red',
      })
    },

    onSuccess(todoItem, _vars, { newTodoItem }) {
      // update the todo with the information from the server
      // since we are invalidating queries, this allows us to progressively
      // update the todo list even if the user is submitting multiple mutations
      // successively
      const todoList = queryCache.getQueryData<Todo[]>(['todos']) || []

      // find the todo we added in `onMutate()` and replace it with the one from the server
      const todoIndex = todoList.findIndex(t => t.id === newTodoItem.id)

      if (todoIndex >= 0) {
        // Replace the whole array to trigger a reactivity update
        // we could also use `.toSpliced()` in modern environments
        const copy = todoList.slice()
        copy.splice(todoIndex, 1, todoItem)
        queryCache.setQueryData(['todos'], copy)
      }

      toast.add({
        title: 'Success',
        description: 'Todo created successfully 🎉',
        color: 'green',
      })
    },
  })

  return {
    ...mutation,
    createTodo,
  }
})

export const useDeleteTodo = defineMutation(() => {
  const queryClient = useQueryCache()
  const toast = useToast()

  const { mutateAsync: deleteTodo, ...mutation } = useMutation({
    key: ['deleteTodo'],

    mutation: (id: number) => $fetch(`/api/todos/${id}`, { method: 'DELETE' }),

    onMutate(id) {
      const oldTodoList = queryClient.getQueryData<Todo[]>(['todos'])
      const newTodoList = oldTodoList?.filter(todo => todo.id !== id)

      return { oldTodoList, newTodoList }
    },

    onSuccess(_, _id, { newTodoList }) {
      queryClient.setQueryData(['todos'], newTodoList)

      toast.add({
        title: 'Success',
        description: 'Todo deleted successfully 🎉',
        color: 'green',
      })
    },

    onError(err, _id, { oldTodoList }) {
      queryClient.setQueryData(['todos'], oldTodoList)
      console.error('An error occurred when deleting a todo:', err)

      toast.add({
        title: 'Error',
        description: 'An error occurred when deleting a todo 😕',
        color: 'red',
      })
    },
  })

  return {
    ...mutation,
    deleteTodo,
  }
})

export const useUpdateTodo = defineMutation(() => {
  const queryClient = useQueryCache()
  const toast = useToast()

  const { mutateAsync: updateTodo, ...mutation } = useMutation({
    key: ['updateTodo'],

    mutation: ({ id, completed }: Pick<Todo, 'id' | 'completed'>) =>
      $fetch(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify({ completed }) }),

    onMutate(data) {
      const oldTodoList = queryClient.getQueryData<Todo[]>(['todos'])
      const newTodoList = oldTodoList?.map(todo => todo.id === data.id ? { ...todo, completed: data.completed } : todo)

      queryClient.setQueryData(['todos'], newTodoList)

      return { oldTodoList, newTodoList }
    },

    onError(err, _data, { oldTodoList }) {
      queryClient.setQueryData(['todos'], oldTodoList)
      console.error('An error occurred when updating a todo:', err)

      toast.add({
        title: 'Error',
        description: 'An error occurred when updating a todo 😕',
        color: 'red',
      })
    },

    onSuccess(_, _data, { newTodoList }) {
      queryClient.setQueryData(['todos'], newTodoList)

      toast.add({
        title: 'Success',
        description: 'Todo updated successfully 🎉',
        color: 'green',
      })
    },
  })

  return {
    ...mutation,
    updateTodo,
  }
})
