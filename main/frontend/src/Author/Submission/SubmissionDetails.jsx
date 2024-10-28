import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBox from './StatusBox';
import AuthorBox from './AuthorBox';
import EditAuthorBox from './EditAuthorBox';
import DocumentBox from './DocumentBox';
import EditDocumentBox from './EditDocumentBox';
import { fetchSubmissionById, saveAuthor, putSubmitDraftSubmission } from '../../api';
import { AuthContext } from '../../App';

function SubmissionDetails() {
  const { submissionID } = useParams();
  const navigate = useNavigate();
  const { userID } = useContext(AuthContext); // 从 AuthContext 获取 userID

  const [submission, setSubmission] = useState(null);
  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);

  useEffect(() => {
    console.log("Accessing userID in SubmissionDetails:", userID);
    console.log("Accessing submissionID in SubmissionDetails:", submissionID);
  
    if (!userID || !submissionID) {
      console.error("User ID or Submission ID is undefined");
      return;
    }
  
    const loadSubmission = async () => {
      try {
        console.log("Fetching submission for userID:", userID, "and submissionID:", submissionID);
        const fetchedSubmission = await fetchSubmissionById(userID, submissionID);
        console.log("Fetched Submission:", fetchedSubmission);
        setSubmission(fetchedSubmission);
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };
  
    loadSubmission();
  }, [userID, submissionID]);
  
  


  const handleSubmit = async () => {
    try {
      const submissionData = {
        submissionID: submission.submissionID,
        paperID: submission.paperID,
        title: submission.title,
        track: submission.track,
        userID: submission.userID,
        keywords: Array.isArray(submission.keywords) ? submission.keywords.join(', ') : submission.keywords,
        abstractText: submission.abstractText,
        status: "Unassigned",  // 更新为 "Pending" 状态
        authors: submission.authors.map((author) => ({
          ...author,
          submissionID: submission.submissionID,
        })),
        files: submission.files.map((file) => ({
          ...file,
          submissionID: submission.submissionID,
        }))
      };
  
      console.log("Submitting updated submission:", submissionData); // 调试信息
  
      // 使用格式化后的数据进行 PUT 请求
      await putSubmitDraftSubmission(submissionData);
      alert('Submission status updated to Pending!');
    } catch (error) {
      console.error('Error updating submission status:', error);
      alert('Failed to update submission status.');
    }
  };  
  
  const handleBack = () => {
    navigate(`/user/${userID}/submission`);
  };

  const handleNextAuthor = () => {
    if (currentAuthorIndex < (submission?.authors?.length || 0) - 1) {
      setCurrentAuthorIndex(currentAuthorIndex + 1);
    }
  };

  const handlePreviousAuthor = () => {
    if (currentAuthorIndex > 0) {
      setCurrentAuthorIndex(currentAuthorIndex - 1);
    }
  };

  const handleOnSaveFile = (savedAuthor) => {
    const updatedAuthors = [...submission.authors];
    updatedAuthors[currentAuthorIndex] = savedAuthor;
    setSubmission({ ...submission, authors: updatedAuthors });
    console.log("Updated authors after saving:", updatedAuthors); // 调试
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmission({ ...submission, [name]: value });
  };

  const handleAddAuthor = async () => {
    const newAuthor = {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      organization: '',
      submissionID: submission.submissionID,
    };

    try {
      const savedAuthor = await saveAuthor(newAuthor);
      const updatedAuthors = [...(submission.authors || []), savedAuthor];
      setSubmission({ ...submission, authors: updatedAuthors });
      setCurrentAuthorIndex(updatedAuthors.length - 1); // 切换到新作者
      console.log("New author added:", savedAuthor); // 调试新作者
    } catch (error) {
      console.error('Error adding new author:', error);
      alert('Failed to add a new author.');
    }
  };

  if (!submission) {
    return <div>Loading...</div>;
  }

  const keywords = Array.isArray(submission.keywords)
    ? submission.keywords.join(', ')
    : submission.keywords || 'No Keywords';

  const currentAuthor = submission.authors && submission.authors.length > 0
    ? submission.authors[currentAuthorIndex]
    : null;

  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-4">{'< Back'}</button>
      <h1 className="text-3xl font-bold mb-4">{submission.title || 'No Title'}</h1>
      <p><strong>Submit Date:</strong> {new Date(submission.submitDate).toLocaleDateString()}</p>
      <p><strong>Track:</strong> {submission.track}</p>
      <div className="flex mb-4">
        <StatusBox 
          submission={submission}
          onSubmit={handleSubmit}
          onChange={handleChange}
          className="flex-grow mr-4"
        />
        {submission.status === 'Draft' ? (
          <EditAuthorBox 
            author1={submission.authors} 
            authorCount={submission.authors ? submission.authors.length : 0} 
            currentIndex={currentAuthorIndex}
            onNext={handleNextAuthor}
            onPrevious={handlePreviousAuthor}
            onEdit={() => {}}
            onAdd={handleAddAuthor}
            isDraft={submission.status === 'Draft'}
            submissionID1={submission.submissionID}
            handleOnSaveFile={handleOnSaveFile}
          />
        ) : (
          <AuthorBox 
            author={currentAuthor}
            authorCount={submission.authors ? submission.authors.length : 0} 
            currentIndex={currentAuthorIndex}
            onNext={handleNextAuthor}
            onPrevious={handlePreviousAuthor}
            onEdit={() => {}}
            onAdd={handleAddAuthor}
            isDraft={submission.status === 'Draft'}
            submissionID1={submission.submissionID}
            handleOnSaveFile={handleOnSaveFile}
          />
        )}
      </div>
      {submission.status === 'Draft' ? (
        <DocumentBox files={submission.files || []} submissionID={submissionID} />
      ) : (
        <EditDocumentBox files={submission.files || []} submissionID={submissionID} />
      )}
    </div>
  );
}

export default SubmissionDetails;
