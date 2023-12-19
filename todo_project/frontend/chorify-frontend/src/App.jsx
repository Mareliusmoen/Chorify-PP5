import { useState, useEffect } from 'react';
import './App.css';
import SignIn from './components/signin';

function App() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchShoppingLists() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}shopping-lists/`);
        if (response.ok) {
          const result = await response.json();
          setShoppingLists(result);
        } else {
          throw new Error('Network response was not ok for shopping lists.');
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation for shopping lists:', error);
      }
    }

    // async function fetchTodos() {
    //   try {
    //     const response = await fetch(`${import.meta.env.VITE_API_URL}todos/`);
    //     if (response.ok) {
    //       const result = await response.json();
    //       setTodos(result);
    //     } else {
    //       throw new Error('Network response was not ok for todos.');
    //     }
    //   } catch (error) {
    //     console.error('There has been a problem with your fetch operation for todos:', error);
    //   }
    // }

    fetchShoppingLists();
    // fetchTodos();
  }, []);

  return (
    <>
      <div className="signin-style">
        <SignIn />
      </div>
    </>
  );
}

export default App;