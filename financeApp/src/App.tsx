import {useEffect, useState} from "react";
import type {Book} from "./models/book";
import LearningResources from "./Components/LearningResources";

function App() {

    // useState hook keeps track of state changes and accepts a variable and a function
    const [books, setBooks] = useState<Book[]>([]);
    
    // useEffect hook lets a component synchronize with something outside React
    useEffect(() => {
        fetch("http://localhost:5278/api/books")
        .then((response) => response.json())
        .then((data) => setBooks(data));
    },[]);

    const addBook = () => {
        setBooks((currentBooks) => {
            const nextId = Math.max(0, ...currentBooks.map((book) => book.id)) + 1;

            return[
                ...currentBooks,
                {id: nextId, title: "Book new", author:"favorite book"}
            ];
        });
    };

    return (
    <>
      <div style={{ fontSize: "1.6rem", color: "green" }}>Finance App</div>
      <LearningResources books={books} addBook={addBook} />
    </>
  );
}
export default App;