

import './App.css'
import {BrowserRouter , Routes, Route} from 'react-router-dom'
import Videop2p from './components/Videop2p'
import Loby from './components/Loby'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loby />} />
          <Route path="/room/:roomid" element={<Videop2p />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
