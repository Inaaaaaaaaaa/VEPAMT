import React, { useEffect, useState } from 'react';

function StatusBox({ submission, onSubmit, onChange, className }) {
  const boxStyle = `${className} border p-4 bg-white shadow-md rounded-lg flex-grow`;
  const [storedFinalDecision, setStoredFinalDecision] = useState({ comment: null, decision: null });

  // Normalize the status to uppercase to ensure consistency
  const normalizedStatus = submission.status ? submission.status.toUpperCase() : 'UNKNOWN';

  useEffect(() => {
    if (normalizedStatus === 'COMPLETED') {
      const fetchFinalDecision = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/final-decisions/submission/${submission.submissionID}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setStoredFinalDecision({
                comment: data[0].comment,
                decision: data[0].decision,
              });
            } else {
              setStoredFinalDecision({ comment: 'No comments available.', decision: null });
            }
          } else {
            console.error('Failed to fetch final decision');
            setStoredFinalDecision({ comment: 'Error fetching comments.', decision: null });
          }
        } catch (error) {
          console.error('Error fetching final decision:', error);
          setStoredFinalDecision({ comment: 'Error fetching comments.', decision: null });
        }
      };

      fetchFinalDecision();
    }
  }, [normalizedStatus, submission.id]);

  switch (normalizedStatus) {
    case 'DRAFT':
      return (
        <div className={boxStyle}>
          <h2 className="text-xl font-bold mb-4">Status: Draft</h2>
          <div className="mb-4">
            <label className="block mb-2">Track:</label>
            <select
              name="track"
              value={submission.track}
              onChange={(e) => onChange(e)}
              className="border p-2 w-full rounded"
            >
              <option value="Track 1">Track 1</option>
              <option value="Track 2">Track 2</option>
              <option value="Track 3">Track 3</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Keywords:</label>
            <input
              name="keywords"
              type="text"
              value={submission.keywords}
              onChange={(e) => onChange(e)}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Abstract:</label>
            <textarea
              name="abstractText"
              value={submission.abstractText}
              onChange={(e) => onChange(e)}
              className="border p-2 w-full rounded overflow-y-scroll max-h-32"
              rows="4"
            />
          </div>
          <button onClick={onSubmit} className="bg-blue-500 text-white p-2 rounded">Submit</button>
          <p className="text-red-500 mt-2">Waiting for submit</p>
        </div>
      );

    case 'ASSIGNED':
      return (
        <div className={boxStyle}>
          <h2 className="text-xl font-bold mb-4">Status: Pending</h2>
          <div className="mb-4">
            <label className="block mb-2">Track:</label>
            <p className="border p-2 bg-gray-100 rounded">{submission.track}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Keywords:</label>
            <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{submission.keywords}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Abstract:</label>
            <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{submission.abstractText}</p>
          </div>
          <p className="text-yellow-500 mt-2">Your submission is waiting for review.</p>
        </div>
      );

    case 'UNASSIGNED':
      return (
        <div className={boxStyle}>
          <h2 className="text-xl font-bold mb-4">Status: Pending</h2>
          <div className="mb-4">
            <label className="block mb-2">Track:</label>
            <p className="border p-2 bg-gray-100 rounded">{submission.track}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Keywords:</label>
            <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{submission.keywords}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Abstract:</label>
            <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{submission.abstractText}</p>
          </div>
          <p className="text-yellow-500 mt-2">Your submission is pending review.</p>
        </div>
      );

    case 'COMPLETED':
      return (
        <div className={boxStyle}>
          <h2 className="text-xl font-bold mb-4">Status: Completed</h2>
          <div className="mb-4">
            <label className="block mb-2">Comments:</label>
            {/* 添加 max-h-32 和 overflow-y-auto 以限制高度和启用滚动 */}
            <div className="border p-2 bg-gray-100 rounded max-h-32 max-w-sm overflow-y-auto">
              <p className="whitespace-pre-wrap break-words">
                {storedFinalDecision.comment ? storedFinalDecision.comment : 'Loading comments...'}
              </p>
            </div>
          </div>
          <p className={`mt-2 ${storedFinalDecision.decision === 'Accept' ? 'text-green-500' : 'text-red-500'}`}>
            {storedFinalDecision.decision === 'Accept' ? 'Your submission has been accepted.' : 'Your submission has been rejected.'}
          </p>
        </div>
      );



    default:
      return (
        <div className={boxStyle}>
          <h2 className="text-xl font-bold mb-4">Status: Unknown</h2>
          <p className="text-red-500">No valid status provided for this submission.</p>
        </div>
      );
  }
}

export default StatusBox;
