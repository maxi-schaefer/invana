import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [msg, setMsg] = useState("")

  const fetchMessage = async () => {
    fetch('/api/hello')
    .then(res => res.text())
    .then(setMsg);
  }

  return (
    <>
      <h1 className='text-2xl'>{msg}</h1>

      <Button onClick={fetchMessage}>Fetch Message</Button>      
    </>
  )
}

export default App
