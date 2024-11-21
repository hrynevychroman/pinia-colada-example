<script setup lang="ts">
import type { H3Error } from 'h3'
import { configure } from 'vee-validate'
import { useCreateTodo } from '~/mutations/todos'
import { todoSchema } from '~/server/database/schema'

configure({
  validateOnBlur: false,
})

const { handleSubmit, resetForm, setFieldError, isSubmitting } = useForm({
  validationSchema: toTypedSchema(todoSchema.pick({ title: true })),
})

const { createTodo, isLoading } = useCreateTodo()

const onSubmit = handleSubmit(async (values) => {
  try {
    await createTodo(values.title)
    resetForm()
  }
  catch (error: unknown) {
    const _error = error as H3Error
    setFieldError('title', _error.statusMessage)
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <form class="flex gap-2" @submit="onSubmit">
      <VeeField v-slot="{ componentField }" name="title">
        <UInput v-bind="componentField" placeholder="Add a new todo..." class="flex-1" :disabled="isSubmitting" />
      </VeeField>

      <UButton type="submit" :loading="isLoading">
        Add
      </UButton>
    </form>

    <VeeErrorMessage name="title" class="text-red-500 text-sm" />
  </div>
</template>
