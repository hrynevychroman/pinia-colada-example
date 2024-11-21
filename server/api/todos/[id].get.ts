export default defineEventHandler((event) => {
  const id = Number(event.context.params?.id)
  
  const todos = [
    { id: 1, title: 'Learn Nuxt.js', completed: true },
    { id: 2, title: 'Master Pinia Colada', completed: false },
    { id: 3, title: 'Build awesome apps', completed: false }
  ]

  const todo = todos.find(t => t.id === id)
  if (!todo) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found'
    })
  }

  return todo
})