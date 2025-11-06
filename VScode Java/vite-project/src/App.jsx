
import { useState, useEffect } from 'react'
function App() {
 
  // In the final step we added time to the state
  // This will be null unless we're editing an entry
  const [time, setTime] = useState(null)
  const [mood, setMood] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [sleep, setSleep] = useState('')
  const [journal, setJournal] = useState([])
  const [text, setText] = useState('')
  const [image, setimage] = useState()
  useEffect(() => {
    const storedJournal = localStorage.getItem('journal')
    if (storedJournal) {
      setJournal(JSON.parse(storedJournal))
    }
}, [])
 
  // Using the map function to create JSX elements from the journal array
  const journalJSX = journal.map((entry, index) => {
    
    // Converting the time value to a date object and then to a string
    const date = new Date(entry.time)
    const dateString = date.toDateString()
    const timeString = date.toLocaleTimeString()
 
    // Returning a div element for each journal entry
    return (
      <div key={index} className="m-2 p-2 w-100">
        <div className="text-md text-gray-500">{dateString}: {timeString}</div>
        <div className="text-lg">{entry.content}</div>
        <div className="text-md text-purple-800">Gratitude: {entry.gratitude}</div>
        <div className="text-md text-blue-800">Hours sleep: {entry.sleep}</div>
        <div className="text-md text-orange-800">Mood: {entry.mood}</div>
        {entry.image && (
      <img src={entry.image} className="w-32 h-32" alt="journal" />
    )}
        <div>
          <button 
            className="m-1 px-2 bg-slate-100 border rounded text-black"
            onClick={ () => handleEdit(entry) }
          >Edit</button>
          <button 
            className="m-1 px-2 bg-slate-100 border rounded text-black"
            onClick={ () => handleDelete(entry.time) }
          >Delete</button>
        </div>
      </div>
    )
  })
 
  // Function to delete a journal entry
  // This uses the filter function to create a new array
  const handleDelete = function(time) {
    const newJournal = journal.filter( entry => entry.time !== time)
    setJournal(newJournal)
    localStorage.setItem('journal', JSON.stringify(newJournal))
  }
 
  // Function to edit a journal entry
  // This sets the state values for the form fields
  // and then removes the entry from the journal array
  const handleEdit = function(entry) {
    setText(entry.content)
    setGratitude(entry.gratitude)
    setSleep(entry.sleep)
    setMood(entry.mood)
    setTime(entry.time)
    const newJournal = journal.filter( item => item.time !== entry.time)
    setJournal(newJournal)
    localStorage.setItem('journal', JSON.stringify(newJournal))
  }

  
 
  const updateJournal = function() {
    // If we have a time value, we're updating an existing entry
    // Otherwise, we're adding a new entry
    let timestamp = (time) ? time : Date.now()
    let content = text
    let newEntry = {time: timestamp, content: content, gratitude: gratitude, sleep: sleep, mood: mood}
    if (image) {
  newEntry.image = image
}
    // The approach we're taking means we need to 
    // sort the journal entries by time, in descending order
    let newJournal = [ newEntry, ...journal ]
    newJournal.sort((a, b) => b.time - a.time)
    setJournal(newJournal)
    localStorage.setItem('journal', JSON.stringify(newJournal))
    setText('')
    setGratitude('')
    setSleep('')
    setMood('')
    setimage('')
    
    // Reset the time value to null
    setTime(null)
  }
 
  // Handles typing in the textarea
  const handleText = function(event) {
    setText(event.target.value)
  }
 
  // Handles typing in the gratitude input
  const handleGratitude = function(event) {
    setGratitude(event.target.value)
  }
 
  // Handles typing in the sleep input
  const handleSleep = function(event) {
    setSleep(event.target.value)
  }
 
  // Handles selecting a mood
  const handleMood = function(event) {
    setMood(event.target.value)
  }
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
   
    const maxSize = 250000; // 250KB (0.25MB) limit
   
    if (file.size > maxSize) {
      // Ideally, you would show a message to the user
      // For this example, we'll just log it to the console
      console.log("File size must be less than 250KB!");
      return;
    }
   
    if (file) {
      reader.readAsDataURL(file)
    }
   
    reader.onloadend = () => {
      // Ideally, you would save the image to the journal entry
      console.log('Image uploaded:', reader.result)
      setimage(reader.result)
    }
    
  }
 
  // At the final step we added conditonal rendering to the button
  // If we have a time value, we're editing an entry
  // Otherwise, we're adding a new entry
return (
  <div className="min-h-screen bg-emerald-900 text-white p-4">
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center mb-6">SoulScript</h1>
      
      <div className="space-y-3 bg-emerald-800 p-4 rounded-2xl shadow-lg">
        <label className="block text-lg font-medium">Journal:</label>
        <textarea 
          className="w-full h-24 p-3 rounded-md bg-white text-black border border-gray-300 resize-none"
          value={text} 
          onChange={handleText}
        />

        <label className="block text-lg font-medium">Today I am grateful for:</label>
        <input 
          type="text" 
          className="w-full p-3 rounded-md bg-white text-black border border-gray-300"
          value={gratitude}
          onChange={handleGratitude}
        />

        <label className="block text-lg font-medium">Number of hours slept:</label>
        <input 
          type="number" 
          className="w-full p-3 rounded-md bg-white text-black border border-gray-300"
          value={sleep}
          onChange={handleSleep}
        />

        <label className="block text-lg font-medium">Upload image:</label>
        <input 
          type="file" 
          className="w-full p-3 rounded-md bg-white text-black border border-gray-300"
          onChange={handleImageUpload} 
        />

        <label className="block text-lg font-medium">Mood:</label>
        <select
          className="w-full p-3 rounded-md bg-white text-black border border-gray-300"
          value={mood}
          onChange={handleMood}
        >
          <option value="">Select mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="excited">Excited</option>
          <option value="tired">Tired</option>
          <option value="relaxed">Relaxed</option>
          <option value="stressed">Stressed</option>
          <option value="confused">Confused</option>
        </select>

        <button 
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
          onClick={updateJournal}
          title="Add a journal entry"
        >
          {time ? "Update Entry" : "Add Entry"}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {journal.map((entry, index) => {
          const date = new Date(entry.time)
          const dateString = date.toDateString()
          const timeString = date.toLocaleTimeString()

          return (
            <div key={index} className="bg-white text-black rounded-xl p-4 shadow-md space-y-2">
              <div className="text-sm text-gray-500">{dateString} @ {timeString}</div>
              <div className="text-lg font-semibold">{entry.content}</div>
              <div className="text-sm text-purple-700">Gratitude: {entry.gratitude}</div>
              <div className="text-sm text-blue-700">Sleep: {entry.sleep} hours</div>
              <div className="text-sm text-orange-700">Mood: {entry.mood}</div>
              {entry.image && (
                <img src={entry.image} alt="journal" className="w-32 h-32 object-cover rounded-md" />
              )}
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-md text-black"
                  onClick={() => handleEdit(entry)}
                >
                  Edit
                </button>
                <button 
                  className="px-3 py-1 bg-red-200 hover:bg-red-300 rounded-md text-black"
                  onClick={() => handleDelete(entry.time)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)
}
 
export default App