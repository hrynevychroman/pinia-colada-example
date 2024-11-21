export default eventHandler(async (event) => {
  const { id } = getRouterParams(event)

  // Simulate a slow request
  await new Promise(resolve => setTimeout(resolve, 3000))

  const todo = await useDrizzle().select().from(tables.todos).where(eq(tables.todos.id, Number(id))).get()

  if (todo?.title === 'test') {
    throw createError({
      statusCode: 400,
      message: 'This is a test error',
    })
  }

  const deletedTodo = await useDrizzle().delete(tables.todos).where(and(
    eq(tables.todos.id, Number(id)),
  )).returning().get()

  if (!deletedTodo) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found',
    })
  }

  return deletedTodo
})
