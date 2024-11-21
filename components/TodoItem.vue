<script setup lang="ts">
import { useDeleteTodo } from '~/mutations/todos'
import type { Todo } from '~/server/database/schema'

defineProps<{
  todo: Todo
  isCreating?: boolean
}>()

defineEmits<{
  toggle: [id: number, completed: boolean]
  delete: [id: number]
}>()

const { isLoading: isDeleting, variables: todoId } = useDeleteTodo()
</script>

<template>
  <div
    :class="cn('flex items-center gap-2 p-3 bg-gray-50 rounded-lg dark:bg-gray-900 relative overflow-clip isolate', {
      'opacity-75 animate-pulse pointer-events-none': (isDeleting && todoId === todo.id) || isCreating,
    })"
  >
    <span
      :class="cn('w-full h-full absolute inset-0 bg-gradient-to-r from-transparent from-10% to-90% to-transparent animate-shimmer -z-10', {
        'via-red-500/30': isDeleting && todoId === todo.id,
        'via-green-500/30': isCreating,
      })"
    />

    <UCheckbox
      :model-value="todo.completed"
      @update:model-value="(value: boolean) => $emit('toggle', todo.id, value)"
    />
    <span :class="{ 'line-through text-gray-500': todo.completed }">
      {{ todo.title }}
    </span>

    <UButton
      variant="ghost"
      size="xs"
      class="ms-auto shrink-0"
      color="red"
      square
      @click="$emit('delete', todo.id)"
    >
      <UIcon name="i-heroicons-trash" />
    </UButton>
  </div>
</template>
