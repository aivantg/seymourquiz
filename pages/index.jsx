import { useState, useEffect, useRef } from "react";
import Question from "../components/Question";
import Url from "../components/Url";
import Results from "./Results";
import { questions, results } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function Home() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [randomizedQuestions, setRandomizedQuestions] = useState(undefined);
  const [emotes, setEmotes] = useState(undefined);
  const emotesIntervalIdRef = useRef(null);

  useEffect(() => {
    const savedIndex = localStorage.getItem("questionIndex");
    const savedAnswers = localStorage.getItem("questionAnswers");
    const savedQuestions = localStorage.getItem("randomizedQuestions");

    if (savedIndex && savedAnswers && savedQuestions) {
      setIndex(Number.parseInt(savedIndex, 10));
      setAnswers(JSON.parse(savedAnswers));
      setRandomizedQuestions(JSON.parse(savedQuestions));
    } else {
      // randomize questions if no saved state
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setRandomizedQuestions(shuffled);
      localStorage.setItem("randomizedQuestions", JSON.stringify(shuffled));
    }

    return () => {
      if (emotesIntervalIdRef.current) {
        clearTimeout(emotesIntervalIdRef.current);
      }
    };
  }, []);

  // save state to local storage whenever it changes
  useEffect(() => {
    if (randomizedQuestions) {
      localStorage.setItem("questionIndex", index);
      localStorage.setItem("questionAnswers", JSON.stringify(answers));
    }
  }, [index, answers, randomizedQuestions]);

  if (!randomizedQuestions) {
    return "loading...";
  }

  // results
  const question = randomizedQuestions[index];
  if (!question) {
    return <Results answers={answers} questions={randomizedQuestions} />;
  }

  const existingChoiceIndex = answers[index];

  const handleGoBack = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleGoNext = () => {
    if (index < randomizedQuestions.length) {
      setIndex(index + 1);
    }
  };

  const handleAnswer = (choiceIndex) => {
    setAnswers((oldAnswers) => {
      return {
        ...oldAnswers,
        [index]: choiceIndex,
      };
    });

    // show emotes temporarily
    if (emotesIntervalIdRef.current) {
      clearTimeout(emotesIntervalIdRef.current);
    }
    
    const people = randomizedQuestions[index].choices[choiceIndex][1];
    const peopleArray = Array.isArray(people) ? people : [people];
    const peoplesEmotes = peopleArray.map((person) => results[person]?.emote);
    setEmotes(peoplesEmotes);
    
    // use setTimeout instead of setInterval since we only need to run once
    emotesIntervalIdRef.current = setTimeout(() => {
      setEmotes(undefined);
      emotesIntervalIdRef.current = null;
    }, 750);

    // increment
    setIndex(index + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex text-sm gap-2 opacity-75">
        <Url disabled={index <= 0} onClick={handleGoBack}>
          {"<"}
        </Url>
        <p>
          question {index + 1} of {randomizedQuestions.length}
        </p>
        <Url
          disabled={existingChoiceIndex === undefined}
          onClick={handleGoNext}
        >
          {">"}
        </Url>
      </div>
      <Question
        question={question}
        existingChoiceIndex={existingChoiceIndex}
        handleAnswer={handleAnswer}
      />
      <AnimatePresence
        mode="wait"
      >
        {emotes && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed p-2 bottom-0 right-0 pointer-events-none flex gap-2"
          >
            {emotes.map((emote) => (
              <Image
                key={emote}
                width={100}
                height={100}
                src={`/images/${emote}`}
                alt="emote"
                className="inset-2 object-contain"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
