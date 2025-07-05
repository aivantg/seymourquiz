import { results } from "../constants";
import Url from "../components/Url"
import Image from "next/image";
import { useState } from "react";

export default function Results({
  answers,
  questions
}) {
  let maxValue = undefined
  let bestPerson = undefined
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [username, setUsername] = useState('');
  const [submissionState, setSubmissionState] = useState('idle'); // idle, loading, success, error
  const [submissionMessage, setSubmissionMessage] = useState('');

  if (!answers) {
    return (
      <div>
        no
      </div>
    )
  }
  
  const tallied = Object.entries(answers).reduce((acc, [key, value]) => {
    const questionIndex = Number.parseInt(key, 10);
    const { choices } = questions[questionIndex];
    const [, v] = choices[value];

    const incrementPerson = (person) => {
      acc[person] += 1
      const newValue = acc[person];
      if (maxValue === undefined || newValue > maxValue) {
        maxValue = newValue
        bestPerson = person
      }
    }

    if (Array.isArray(v)) {
      v.map((p) => {
        incrementPerson(p)
      })
    } else {
      incrementPerson(v)
    }
    
    return acc;
  }, {
    jack: 0,
    grace: 0,
    drew: 0,
    aivant: 0
  })

  const handleSubmitAnswers = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setSubmissionState('error');
      setSubmissionMessage('Please enter your name');
      return;
    }

    setSubmissionState('loading');
    setSubmissionMessage('');

    try {
      const response = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          answers,
          questions, // Include the original questions array for context
          results: {
            bestPerson,
            tallied,
            total
          }
        }),
      });

      if (response.ok) {
        setSubmissionState('success');
        setSubmissionMessage('Thank you! Your answers have been submitted.');
        setUsername('');
      } else {
        const errorData = await response.json();
        setSubmissionState('error');
        setSubmissionMessage(errorData.message || 'Failed to submit answers');
      }
    } catch (error) {
      setSubmissionState('error');
      setSubmissionMessage('Network error. Please try again.');
    }
  };

  const total = Object.values(answers).length
  const { description, image } = results[bestPerson]
  return (
    <div className="flex flex-col gap-4">
      <Image
        width={300}
        height={200}
        src={`/images/${hoveredPerson === bestPerson ? results[bestPerson].baby ?? image : image}`}
        onMouseEnter={() => setHoveredPerson(bestPerson)}
        onMouseLeave={() => setHoveredPerson(null)}
        alt={bestPerson}
      />
      <div>
        <p><b>you are {bestPerson}</b></p>
        <p><i>{description}</i></p>
      </div>
      <div>
        <p>results:</p>
        {Object.entries(tallied).map(([person, value], index) => (
          <div key={person} className="flex justify-between items-center gap-2">
            <p className="w-[30%]">{person}</p>
            <div className="bg-gray-300 w-full h-3">
              <div
                className="h-full bg-zinc-500"
                style={{
                  width: `${(value / total) * 100}%`,
                }}
              />
            </div>
            <p className="w-[40%]">({value} / {total})</p>
          </div>
        ))}
      </div>
      
      {/* Send us your answer form */}
      <div className="border-t pt-4 mt-4">
        <form onSubmit={handleSubmitAnswers} className="flex flex-col gap-3">
          <p className="text-sm font-medium">Send us your answer</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submissionState === 'loading'}
            />
            <button
              type="submit"
              disabled={submissionState === 'loading'}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submissionState === 'loading' ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          {submissionMessage && (
            <p className={`text-sm ${submissionState === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {submissionMessage}
            </p>
          )}
        </form>
      </div>

      <div className="flex gap-2 justify-center opacity-50 w-full">
        <p>not satisfied?</p>
        <Url onClick={() => {
          localStorage.clear()
          window.location.reload()
        }}>
          reset
        </Url>
      </div>
    </div>
  )
}