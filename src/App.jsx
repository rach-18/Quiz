import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // Initialize timeLeft with 5 seconds

  const fetchQuestions = () => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then(res => res.json())
      .then((data) => {
        if (data.response_code === 0) {
          setQuestions(data.results);
        }
      })
      .catch(err => console.log(err));
  }

  const nextQuestion = (answer) => {
    if (answer === questions[index]?.correct_answer) {
      setScore(score + 1);
    }
    if (index < questions.length) {
      setIndex(index + 1);
      setTimeLeft(5); // Reset timeLeft when moving to the next question
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      nextQuestion(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount or timeLeft change
  }, [timeLeft]);

  if (questions.length === 0) {
    return (
      <div className='flex justify-center text-4xl font-bold mt-10'>
        <p>Loading...</p>
      </div>
    );
  }

  if (index >= questions.length) {
    return (
      <div className='flex justify-center items-center h-screen text-4xl font-bold'>
        <p>Final Score: {score} / 10</p>
      </div>
    );
  }

  return (
    <div>
      <p className='text-4xl font-bold text-center my-10'>Quiz App</p>
      <div className='w-1/2 mx-auto flex flex-col gap-3 rounded-xl shadow-lg py-8 px-12'>
        <p className='font-semibold text-2xl'>Question {index + 1}</p>
        <p>{questions[index].question}</p>
        <div className='flex flex-col gap-2'>
          {
            questions[index].incorrect_answers.map((option, idx) => {
              return <p 
                key={idx}
                onClick={() => nextQuestion(option)}
                className='option bg-[#222222] text-white py-3 px-5 cursor-pointer hover:bg-gray-500 rounded-lg'>{option}
              </p>
            })
          }
          <p 
            onClick={() => nextQuestion(questions[index].correct_answer)}
            className='option bg-[#222222] text-white py-3 px-5 cursor-pointer hover:bg-gray-500 rounded-lg'>{questions[index].correct_answer}
          </p>
        </div>
        <p>Time Left: {timeLeft} seconds</p>
        <button 
          onClick={() => nextQuestion(null)}
          className='bg-slate-500 w-[25%] py-2 rounded-lg font-semibold mx-auto'
        >
          Skip Question
        </button>
      </div>
    </div>
  )
}

export default App
