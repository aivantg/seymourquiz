import { useState, useEffect } from 'react';
import Image from 'next/image';
import { results } from '../constants';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/quiz-results');
      const data = await response.json();
      setSubmissions(data.results);
    } catch (err) {
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuestionAnswer = (submission, questionIndex) => {
    const choiceIndex = submission.answers[questionIndex];
    if (choiceIndex === undefined) return null;
    
    const question = submission.questions[questionIndex];
    return question?.choices[choiceIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {!selectedSubmission ? (
          /* Submissions List View */
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Quiz Admin Dashboard</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                All Submissions ({submissions.length})
              </h2>
              
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <button
                    key={submission.id}
                    type="button"
                    onClick={() => setSelectedSubmission(submission)}
                    className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={`/images/${results[submission.results.bestPerson]?.image}`}
                          alt={submission.results.bestPerson}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 text-lg">
                            {submission.username}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Result: <span className="font-medium">{submission.results.bestPerson}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Object.values(submission.answers).length} questions answered
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatDate(submission.createdAt)}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          {Object.entries(submission.results.tallied).map(([person, count]) => (
                            <div key={person} className="flex items-center gap-1">
                              <Image
                                src={`/images/${results[person]?.image}`}
                                alt={person}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                              <span className="text-xs text-gray-500">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Submission Details View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <span>←</span>
                <span>Back to all submissions</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedSubmission.username}'s Quiz Results
              </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={`/images/${results[selectedSubmission.results.bestPerson]?.image}`}
                    alt={selectedSubmission.results.bestPerson}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedSubmission.results.bestPerson}</h2>
                    <p className="text-gray-600">
                      {Object.values(selectedSubmission.answers).length} questions answered
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted on {formatDate(selectedSubmission.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-4">Results Breakdown:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedSubmission.results.tallied).map(([person, count]) => (
                    <div key={person} className="text-center">
                      <div className="flex justify-center mb-2">
                        <Image
                          src={`/images/${results[person]?.image}`}
                          alt={person}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <p className="font-medium capitalize">{person}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(count / selectedSubmission.results.total) * 100}%`
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{count}/{selectedSubmission.results.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions and Answers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6">Question-by-Question Review</h3>
              <div className="space-y-6">
                {selectedSubmission.questions.map((question, index) => {
                  const answer = getQuestionAnswer(selectedSubmission, index);
                  
                  return (
                    <div key={`question-${index}-${question.title.slice(0, 20)}`} className="border-l-4 border-gray-200 pl-6 py-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        Q{index + 1}: {question.title}
                      </h4>
                      
                      <div className="space-y-2">
                        {question.choices.map((choice, choiceIndex) => {
                          const isSelected = selectedSubmission.answers[index] === choiceIndex;
                          const [choiceText, choicePerson] = choice;
                          
                          return (
                            <div
                              key={`choice-${choiceIndex}-${choiceText.slice(0, 15)}`}
                              className={`p-3 rounded-lg ${
                                isSelected
                                  ? 'bg-blue-100 border-2 border-blue-500'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className={`flex-1 ${isSelected ? 'font-medium' : ''}`}>
                                  {choiceText}
                                </span>
                                <span className={`text-sm ml-4 ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                  → {Array.isArray(choicePerson) ? choicePerson.join(', ') : choicePerson}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 