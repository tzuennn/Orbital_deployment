import React from 'react';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="question-modal-overlay" onClick={onClose} />
      <div className="question-modal-content">
        {children}
      </div>
      <style jsx>{`
        .question-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
        }
        .question-modal-content {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          z-index: 1001;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default QuestionModal;
