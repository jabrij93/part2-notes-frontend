import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css';

const notes = ['']

ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)