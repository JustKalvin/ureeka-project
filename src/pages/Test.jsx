import { useEffect, useState } from "react"
import axios from "axios"

const Test = () => {
  const [text, setText] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      try{
        const response = await axios.get("http://127.0.0.1:8000/datasekolah")
        setData(data => (response.data))
        console.log(response.data)
      }
      catch(error) {
        console.log("ERROR!")
      }
    }
    getData()
  }, [])

  useEffect(() => {
      const fetchAPI = async () => {
        if(!question) return
        try{
          const response = await axios.post("http://localhost:5678/webhook/ask-ai", {
            question : `Berdasarkan data berikut : ${JSON.stringify(data)}, jawab pertanyaan ini ${question}`
          })
          console.log(response)
          setAnswer(answer => (response.data.Answer))
        }
        catch(error) {
          console.log("ERROR")
        }
      }
      fetchAPI()
  }, [question])

  const handleText = (event) => {
    setText(text => (event.target.value))
  }

  const handleClick = () => {
    setQuestion(question => (text))
  }
  return(
    <div>
      <input onChange={handleText} type="text" />
      <p>{text}</p>
      <button onClick={() => handleClick()}>Send</button>
      {answer ? <p>{answer}</p> : <div></div>}
    </div>
  )
}
export default Test