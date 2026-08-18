import { Button } from "@mui/material";
import type { Book } from "../models/book";
import BookList from "./BookList";

type Props = {
  books: Book[];
  addBook: () => void;
};

export default function LearningResources(props: Props) {
  return (
    <>
      <BookList books={props.books} />
      <Button variant="contained" type="button" onClick={props.addBook}>
        Add book
      </Button>
    </>
  );
}
