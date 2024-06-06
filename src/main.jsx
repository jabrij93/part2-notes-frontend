import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

const notes = ['']

ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)