import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBox from './StatusBox';
import AuthorBox from './AuthorBox';
import EditAuthorWindow from './EditAuthorWindow';
import DocumentBox from './DocumentBox';

function SubmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState({
    id: 1,
    paperName: 'AI in Healthcare',
    track: 'Track 1',
    status: 'draft', // 修改状态以测试不同显示
    authors: [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', country: 'USA', organization: 'University A' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', country: 'Canada', organization: 'University B' },
    ],
    submitDate: '2024-01-31',
    keywords: 'AI, Healthcare',
    abstract: 'This paper discusses the applications of AI in the healthcare industry...',
    review: 'The paper needs more detailed analysis on the use of AI in diagnostics.',
  });

  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
  const [isEditAuthorOpen, setIsEditAuthorOpen] = useState(false);
  const [editAuthorData, setEditAuthorData] = useState(null);

  const handleTrackChange = (newTrack) => {
    setSubmission({ ...submission, track: newTrack });
  };

  const handleKeywordChange = (newKeywords) => {
    setSubmission({ ...submission, keywords: newKeywords });
  };

  const handleAbstractChange = (newAbstract) => {
    setSubmission({ ...submission, abstract: newAbstract });
  };

  const handleSubmit = () => {
    alert('Submission submitted!');
    setSubmission({ ...submission, status: 'submitted' });
  };

  const handleResubmit = () => {
    alert('Submission resubmitted!');
    setSubmission({ ...submission, status: 'submitted' });
  };

  const handleBack = () => {
    navigate('/submission');
  };

  const handleNextAuthor = () => {
    if (currentAuthorIndex < submission.authors.length) {
      setCurrentAuthorIndex(currentAuthorIndex + 1);
    }
  };

  const handlePreviousAuthor = () => {
    if (currentAuthorIndex > 0) {
      setCurrentAuthorIndex(currentAuthorIndex - 1);
    }
  };

  const handleEditAuthor = (author) => {
    setEditAuthorData(author);
    setIsEditAuthorOpen(true);
  };

  const handleAddAuthor = () => {
    setEditAuthorData(null);
    setIsEditAuthorOpen(true);
  };

  const handleSaveAuthor = (updatedAuthor) => {
    const updatedAuthors = [...submission.authors];
    if (updatedAuthor.id) {
      const index = updatedAuthors.findIndex((author) => author.id === updatedAuthor.id);
      if (index !== -1) updatedAuthors[index] = updatedAuthor;
    } else {
      updatedAuthor.id = submission.authors.length + 1;
      updatedAuthors.push(updatedAuthor);
    }
    setSubmission({ ...submission, authors: updatedAuthors });
    setIsEditAuthorOpen(false);
    setCurrentAuthorIndex(updatedAuthors.length - 1);
  };

  const currentAuthor = submission.authors[currentAuthorIndex] || (submission.status === 'draft' ? {} : null);

  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-4">{'< Back'}</button>
      <h1 className="text-3xl font-bold mb-4">{submission.paperName}</h1>
      <p><strong>Submit Date:</strong> {submission.submitDate}</p>
      <p><strong>Track:</strong> {submission.track}</p>
      <div className="flex mb-4">
        <StatusBox 
          status={submission.status}
          track={submission.track}
          keywords={submission.keywords}
          abstract={submission.abstract}
          onTrackChange={handleTrackChange}
          onKeywordChange={handleKeywordChange}
          onAbstractChange={handleAbstractChange}
          onSubmit={handleSubmit}
          onResubmit={handleResubmit}
          review={submission.review}
          className="flex-grow mr-4"
        />
        <AuthorBox 
          author={currentAuthor} 
          authorCount={submission.authors.length} 
          currentIndex={currentAuthorIndex} 
          onNext={handleNextAuthor}
          onPrevious={handlePreviousAuthor}
          onEdit={handleEditAuthor}
          onAdd={handleAddAuthor}
          isDraft={submission.status === 'draft'}
        />
      </div>
      <DocumentBox />
      {isEditAuthorOpen && (
        <EditAuthorWindow 
          author={editAuthorData}
          onSave={handleSaveAuthor}
          onClose={() => setIsEditAuthorOpen(false)}
        />
      )}
    </div>
  );
}

export default SubmissionDetails;
