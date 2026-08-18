import { Box } from "@mui/material"
import type { Book } from "../models/book"
import BookCard from "./BookCard"

type Props = {
    books: Book[]
}

export default function BookList({books}: Props) {
  return (
    <Box sx={{display: "flex", flexWrap:'wrap', gap: 3, justifyContent:'center'}} >
        {books.map((book) => (
            <BookCard book={book} />
        ))}
      </Box>
  )
}







