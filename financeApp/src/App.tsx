import { useEffect, useState } from "react"
import type { Book } from "./models/book";

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch('http://localhost:5278/api/books')
    .then(response => response.json())
    .then(data => setBooks(data))
  }, [])

  return (
    <>
      <div style={{fontSize: '1.6rem', color:'green'}}>Finance App</div>
      <ul>
        {books.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </>
  )
}

export default App