import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
          console.log(result);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }
    fetchData();
  }, []);
  return (
    <>
    Hello world
    </>
  )
}

export default App
