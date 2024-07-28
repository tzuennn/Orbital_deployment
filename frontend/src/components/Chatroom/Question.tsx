import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, getDoc, addDoc, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { FaThumbsUp } from 'react-icons/fa';

interface QuestionProps {
  question: {
    id: string;
    question: string;
    topic: string;
    userId: string;
    createdAt: any;
  };
  currentUser: string;
  onAnswerSubmit: (answer: string, questionId: string) => void;
}

interface Answer {
  id: string;
  answer: string;
  userId: string;
  createdAt: any;
  upvotes: number;
}

const Question: React.FC<QuestionProps> = ({ question, currentUser, onAnswerSubmit }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [nickname, setNickname] = useState<string>('');
  const [page, setPage] = useState(0);
  const [userUpvotes, setUserUpvotes] = useState<{ [key: string]: boolean }>({});
  const answersPerPage = 5;

  useEffect(() => {
    const fetchAnswers = () => {
      const answersRef = collection(firestore, "quests", question.id, "answers");
      const q = query(answersRef, orderBy("upvotes", "desc"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ans: Answer[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            answer: data.answer,
            userId: data.userId,
            createdAt: data.createdAt,
            upvotes: data.upvotes,
          };
        });
        setAnswers(ans);
      });

      return () => unsubscribe();
    };

    fetchAnswers();

    const fetchNickname = async () => {
      const userProfileRef = doc(firestore, "profiles", question.userId);
      const userProfileSnap = await getDoc(userProfileRef);
      if (userProfileSnap.exists()) {
        setNickname(userProfileSnap.data().nickname);
      }
    };

    fetchNickname();
  }, [question.id, question.userId]);

  useEffect(() => {
    const fetchUserUpvotes = async () => {
      const upvoteStatus: { [key: string]: boolean } = {};

      for (const answer of answers) {
        const upvoteRef = collection(firestore, "quests", question.id, "answers", answer.id, "upvotes");
        const userUpvoteQuery = query(upvoteRef, where("userId", "==", currentUser));

        const userUpvoteSnapshot = await getDocs(userUpvoteQuery);
        upvoteStatus[answer.id] = !userUpvoteSnapshot.empty;
      }

      setUserUpvotes(upvoteStatus);
    };

    if (answers.length > 0) {
      fetchUserUpvotes();
    }
  }, [answers, question.id, currentUser]);

  const handleUpvote = async (answerId: string) => {
    if (userUpvotes[answerId]) return;

    const answerRef = doc(firestore, "quests", question.id, "answers", answerId);
    const answerDoc = await getDoc(answerRef);
    if (answerDoc.exists()) {
      const currentUpvotes = answerDoc.data().upvotes || 0;
      const upvoteRef = collection(firestore, "quests", question.id, "answers", answerId, "upvotes");
      const userUpvoteQuery = query(upvoteRef, where("userId", "==", currentUser));

      const userUpvoteSnapshot = await getDocs(userUpvoteQuery);
      if (userUpvoteSnapshot.empty) {
        await addDoc(upvoteRef, { userId: currentUser });
        await updateDoc(answerRef, { upvotes: currentUpvotes + 1 });
        setUserUpvotes((prev) => ({ ...prev, [answerId]: true }));
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (newAnswer.trim()) {
      onAnswerSubmit(newAnswer, question.id);
      await grantDailyXP();
      setNewAnswer('');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Singapore'
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(today).split('/').reverse().join('-');
    return formattedDate;
  };

  const grantDailyXP = async () => {
    const today = getTodayDate();
    const rewardsRef = collection(firestore, "rewards");
    const q = query(rewardsRef, where("userId", "==", currentUser), where("date", "==", today));
    console.log('Query:', q);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const rewardDoc = querySnapshot.docs[0];
      const rewardData = rewardDoc.data();
      console.log('Reward Document Data:', rewardData);

      if (!rewardData.hasAnsweredQuestion) {
        await updateDoc(rewardDoc.ref, {
          dailyXP: (rewardData.dailyXP || 0) + 10,
          totalXP: (rewardData.totalXP || 0) + 10,
          hasAnsweredQuestion: true,
        });
        console.log('Updated Reward Document Data:', {
          dailyXP: (rewardData.dailyXP || 0) + 10,
          totalXP: (rewardData.totalXP || 0) + 10,
          hasAnsweredQuestion: true,
        });
      } else {
        console.log('User has already been awarded for answering a question today.');
      }
    } else {
      console.log('No reward document found for today.');
    }
  };

  const paginatedAnswers = answers.slice(page * answersPerPage, (page + 1) * answersPerPage);

  return (
    <div className="p-4 mb-4 border rounded-lg shadow-md bg-white">
      <p className="text-sm font-semibold mb-1">{nickname}</p>
      <p className="font-bold mb-2">{question.topic}</p>
      <p className="mb-4">{question.question}</p>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Your answer..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full p-2 border rounded-md mb-2"
        />
        <button onClick={handleSubmitAnswer} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700">
          Submit Answer
        </button>
      </div>
      <div>
        {paginatedAnswers.map((ans) => (
          <div key={ans.id} className="mb-2">
            <p>{ans.answer}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Upvotes: {ans.upvotes}</span>
              <button
                onClick={() => handleUpvote(ans.id)}
                className={`${userUpvotes[ans.id] ? "text-gray-500" : "text-blue-500"} hover:${userUpvotes[ans.id] ? "text-gray-700" : "text-blue-700"}`}
                disabled={userUpvotes[ans.id]}
              >
                <FaThumbsUp />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {page > 0 && (
          <button onClick={() => setPage(page - 1)} className="text-blue-500 hover:text-blue-700">
            Previous
          </button>
        )}
        {answers.length > (page + 1) * answersPerPage && (
          <button onClick={() => setPage(page + 1)} className="text-blue-500 hover:text-blue-700">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Question;
