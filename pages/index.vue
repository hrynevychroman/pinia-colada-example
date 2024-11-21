<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="container mx-auto px-4 max-w-2xl">
      <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Todo List
      </h1>

      <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <TodoForm />
        <TodoList />
      </div>
    </div>
  </div>
</template>
