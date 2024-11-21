<script setup lang="ts">
import { useCreateTodo, useDeleteTodo, useUpdateTodo } from '~/mutations/todos'
import { useGetTodos } from '~/queries/todos'

const { todoList, isLoading } = useGetTodos()
const { deleteTodo } = useDeleteTodo()
const { updateTodo } = useUpdateTodo()

const { isLoading: isCreatingTodo } = useCreateTodo()

const [parent, enable] = useAutoAnimate()

watch(isCreatingTodo, (value) => {
  nextTick(() => {
    enable(!value)
  })
})
</script>

<template>
  <div
    :class="cn('mt-0 transition-all duration-300', {
      'mt-6': todoList?.data?.length,
    })"
  >
    <div v-if="isLoading" class="text-center py-4">
      Loading...
    </div>

    <div
      v-else-if="todoList"
      ref="parent"
      :class="cn('flex gap-4 flex-col')"
    >
      <TodoItem
        v-for="(todo, index) in todoList.data"
        :key="todo.id"
        :todo="todo"
        :is-creating="isCreatingTodo && index === (todoList.data?.length || 0) - 1"
        @delete="deleteTodo"
        @toggle="(id: number, completed: boolean) => updateTodo({ id, completed })"
      />
    </div>
  </div>
</template>
