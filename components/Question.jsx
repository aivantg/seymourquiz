export default function Question({
  question,
  existingChoiceIndex,
  handleAnswer,
}) {
  const { title, choices } = question;
  return (
    <div className="flex flex-col">
      <p>
        <b>{title}</b>
      </p> 
      <div className="ml-2 mt-2">
        {choices.map((choice, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`${
                index === existingChoiceIndex
                  ? `bg-zinc-500 text-white`
                  : undefined
              } hover:bg-black hover:text-white cursor-pointer flex-1`}
              onClick={() => handleAnswer(index)}
            >
              {index + 1}. {choice[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
