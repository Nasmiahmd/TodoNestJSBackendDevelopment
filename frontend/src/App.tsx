import { Routes, Route } from 'react-router'
import TodoPage from './pages/TodoPage'
import AuthPage from './pages/AuthPage'
function App() {

  return (
    <div className='relative h-full w-full '>
      <Routes>
        <Route path='/' element={<AuthPage />}/>
        <Route path='/todo' element={<TodoPage />} />
      </Routes>
    </div>
  )
}

export default App
