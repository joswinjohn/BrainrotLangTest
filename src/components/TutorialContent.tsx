import { aliases } from "../aliases";

function TutorialContent() {
  return (
    <>
      <h1 className="text-2xl font-bold pt-6 text-black text-center">
        Tutorial
      </h1>
      <div className="px-6 pt-3">
        <p className="text-md mb-4">
          Welcome to Brainrot Lang! This is a simple programming language based
          on JavaScript that uses brainrot terms instead of JavaScript keywords.
          <br />
          <br />
          Use the keywords listed below in place of their JavaScript equialents
          to write code in brainrot.
        </p>
      </div>
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-black mb-2">Keywords:</h2>
        <ul className="text-md list-disc px-6">
          {Object.entries(aliases).map(([alias, value]) => (
            <li key={alias}>
              <code>
                <span className="font-semibold">{alias}</span> - {value}
              </code>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default TutorialContent;
