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

  if (!answers) {
    return (
      <div>
        no
      </div>
    )
  }
  
  const tallied = Object.entries(answers).reduce((acc, [key, value]) => {
    const { choices } = questions[key]
    const [, v] = choices[value]

    const incrementPerson = (person) => {
      acc[person] += 1
      const newValue = acc[v]
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
      <div className="flex gap-2 justify-center  opacity-50 w-full">
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