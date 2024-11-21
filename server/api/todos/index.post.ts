import { todoSchema } from '~/server/database/schema'

export default eventHandler(async (event) => {
  const { data, success } = await readValidatedBody(event, todoSchema.pick({ title: true }).safeParse)

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  // Simulate a slow request
  await new Promise(resolve => setTimeout(resolve, 3000))

  if (data.title === 'error') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Don\'t name your todo \'error\'',
    })
  }

  const todo = await useDrizzle().insert(tables.todos).values({
    title: data.title,
    createdAt: new Date(),
  }).returning().get()

  return todo
})
