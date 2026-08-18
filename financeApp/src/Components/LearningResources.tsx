import type { Book } from "../models/book";

type Props = {
    books: Book[];
    addBook: () => void;
}


export default function LearningResources(props: Props) {
  return (
    <>
      <ul>
        {props.books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
      <button type="button" onClick={props.addBook}>
        Add book
      </button>
    </>
  );
}
