import { z } from "zod"
 
export const linkSchema = z.object({
  link: z.string().url()
})

export const noteSchema = z.object({
    content: z.string().min(3, "Note should be min of 3 characters.")
})

export const messageSchema = z.object({
  message: z.string().min(3, "Message should be min. of 3 characters.")
})

export type LinkSchemaType = z.infer<typeof linkSchema>
export type NoteSchemaType = z.infer<typeof noteSchema>
export type MessageSchemaType = z.infer<typeof messageSchema>