// src/Lesson.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { CheckCircle2, XCircle, RotateCcw, BookPlus, Wrench, AlertOctagon } from 'lucide-react';

export default function Lesson({ dayData, prevDayData, onComplete, onBack, onCheat, isAdmin }) {
  const [selectedCheckVocab, setSelectedCheckVocab] = useState([]);
  
  const initialStep = (prevDayData && prevDayData.vocabulary && prevDayData.vocabulary.length > 0) 
                      ? 'vocab-check' : 'learning';
  const [step, setStep] = useState(initialStep);

  const [vocabFailCount, setVocabFailCount] = useState(0);
  const [exerciseFailCount, setExerciseFailCount] = useState(0);
  const [vocabAnswers, setVocabAnswers] = useState({});
  const [vocabErrors, setVocabErrors] = useState({}); 
  const [savedToNotebook, setSavedToNotebook] = useState({}); 

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isVideoWatched, setIsVideoWatched] = useState(false);

  useEffect(() => {
    if (prevDayData && prevDayData.vocabulary && prevDayData.vocabulary.length > 0) {
      const shuffled = [...prevDayData.vocabulary].sort(() => 0.5 - Math.random());
      setSelectedCheckVocab(shuffled.slice(0, 5));
    }
  }, [prevDayData]);

  useEffect(() => {
    if (isAdmin) return;
    const handleVisibilityChange = () => {
      if (document.hidden && !submitted && step === 'learning') {
        alert("🚨 CẢNH BÁO GIAN LẬN! Bạn đã rời khỏi màn hình làm bài.\nHệ thống hủy bài hiện tại và trừ 5 điểm!");
        if (onCheat) onCheat(); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleBeforeUnload = (e) => {
      if (!submitted && step === 'learning') {
        e.preventDefault();
        e.returnValue = "Bạn đang làm bài, thoát ra sẽ bị tính là gian lận!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitted, onCheat, step, isAdmin]);

  const handleQuit = () => {
    if (isAdmin) {
      onBack();
      return;
    }
    if (!submitted && step === 'learning') {
      const confirmQuit = window.confirm("CẢNH BÁO: Bỏ cuộc giữa chừng sẽ bị hệ thống đánh giá là gian lận và trừ 5 điểm. Bạn có chắc chắn muốn thoát?");
      if (confirmQuit) {
        if (onCheat) onCheat();
      }
    } else {
      onBack();
    }
  };

  const handleVocabCheck = () => {
    let isAllCorrect = true;
    let errors = {};
    selectedCheckVocab.forEach((v, idx) => {
      const userAnswer = (vocabAnswers[idx] || '').toString().trim().toLowerCase();
      const correctAnswer = v.word.toString().trim().toLowerCase();
      if (userAnswer !== correctAnswer) {
        isAllCorrect = false;
        errors[idx] = true; 
      } else {
        errors[idx] = false;
      }
    });

    if (isAllCorrect) {
      setStep('learning');
      setVocabErrors({});
    } else {
      setVocabFailCount(prev => prev + 1);
      setVocabErrors(errors); 
    }
  };

  const handleAddToNotebook = async (idx, wordObj) => {
    if (!auth.currentUser) return;
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        notebook: arrayUnion({
          word: wordObj.word,
          meaning: wordObj.meaning,
          addedAt: new Date().toDateString()
        })
      });
      setSavedToNotebook(prev => ({ ...prev, [idx]: true }));
    } catch (error) {
      console.error("Lỗi lưu sổ tay:", error);
    }
  };

  const handleSubmitExercises = () => {
    let currentScore = 0;
    dayData.exercises.forEach((ex, idx) => {
      const userAnswer = (answers[idx] || '').toString().trim().toLowerCase();
      const correctAnswer = ex.correct.toString().trim().toLowerCase();
      if (userAnswer === correctAnswer) currentScore++;
    });
    setScore(currentScore);
    setSubmitted(true);

    if (currentScore === dayData.requiredScore) {
      if (dayData.vocabulary && dayData.vocabulary.length > 0) {
        setStep('vocab-reveal');
      } else {
        onComplete(dayData.id, vocabFailCount, exerciseFailCount);
      }
    } else {
      const newFailCount = exerciseFailCount + 1;
      setExerciseFailCount(newFailCount);
      
      // XỬ LÝ KHÓA BÀI KHI SAI 3 LẦN
      if (newFailCount >= 3) {
        alert("🚨 BẠN ĐÃ LÀM SAI 3 LẦN!\nHệ thống khóa bài tập. Vui lòng xem đáp án chính xác bên dưới và chấp nhận hình phạt để đi tiếp.");
      }
    }
  };

  // Logic kiểm tra trạng thái khóa bài
  const isExerciseLocked = exerciseFailCount >= 3;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={handleQuit} className="mb-4 text-blue-500 hover:underline font-medium">
        ← Quay lại Lộ trình
      </button>
      
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {dayData.isTest ? `Bài Test Lớn (Ngày ${dayData.id})` : `Bài học Ngày ${dayData.id}`}
        {isAdmin && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Admin Test Mode</span>}
      </h2>

      {step === 'vocab-check' && (
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-400">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🚧 Trạm Kiểm Tra Khởi Động</h3>
          <p className="text-gray-600 mb-6">Hệ thống bốc ngẫu nhiên 5 từ của Ngày {dayData.id - 1}. Hãy hoàn thành chính xác.</p>
          
          <div className="space-y-4 mb-6">
            {selectedCheckVocab.map((v, idx) => (
              <div key={idx} className="flex flex-col border-b pb-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-lg w-48 text-indigo-700">"{v.meaning}"</span>
                  <input 
                    type="text" 
                    placeholder="Nhập từ tiếng Anh..."
                    className={`flex-1 border p-2 rounded focus:ring-2 outline-none ${vocabErrors[idx] ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'focus:ring-indigo-300'}`}
                    value={vocabAnswers[idx] || ''}
                    onChange={(e) => setVocabAnswers({...vocabAnswers, [idx]: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleVocabCheck()}
                  />
                </div>
                
                {vocabErrors[idx] && (
                  <div className="flex items-center justify-between bg-red-100 p-2 rounded text-sm text-red-700">
                    <span className="flex items-center gap-1"><XCircle size={16} /> Sai rồi! Hãy kiểm tra lại.</span>
                    <button
                      onClick={() => handleAddToNotebook(idx, v)}
                      disabled={savedToNotebook[idx]}
                      className={`flex items-center gap-1 font-bold px-3 py-1 rounded transition-colors ${savedToNotebook[idx] ? 'bg-green-600 text-white' : 'bg-white text-red-600 hover:bg-red-200 border border-red-300'}`}
                    >
                      <BookPlus size={14} />
                      {savedToNotebook[idx] ? "Đã vào sổ tay ✔" : "Thêm vào sổ tay"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button onClick={handleVocabCheck} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 shadow transition">Xác nhận</button>

          {isAdmin && (
            <button onClick={() => setStep('learning')} className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-black flex items-center justify-center gap-2">
              <Wrench size={18} /> [Admin] Bỏ qua kiểm tra từ vựng
            </button>
          )}
        </div>
      )}

      {step === 'learning' && (
        <div>
          {!dayData.isTest && dayData.videoUrl && (
            <div className="mb-8">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
                <iframe width="100%" height="100%" src={dayData.videoUrl} frameBorder="0" allowFullScreen></iframe>
              </div>
              {!isVideoWatched && (
                <div className="mt-6 text-center">
                  <button onClick={() => setIsVideoWatched(true)} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                    Tôi đã xem xong Video!
                  </button>
                </div>
              )}
            </div>
          )}

          {(dayData.isTest || !dayData.videoUrl || isVideoWatched) && (
            <div className="space-y-8">
              {dayData.exercises.map((ex, idx) => {
                // Biến phụ trợ cho khâu hiển thị đáp án
                const isWritingError = isExerciseLocked && (answers[idx] || '').toString().trim().toLowerCase() !== ex.correct.toString().trim().toLowerCase();
                const isWritingCorrect = isExerciseLocked && !isWritingError;

                return (
                  <div key={idx} className={`p-4 border-2 rounded-lg shadow-sm relative ${isWritingError ? 'bg-red-50 border-red-200' : isExerciseLocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                    <h3 className="font-semibold mb-2 text-gray-700">Câu {idx + 1}: {ex.type.toUpperCase()}</h3>
                    {ex.image && <img src={ex.image} alt="Minh họa" className="w-48 rounded-lg mb-4 shadow-sm" />}
                    {ex.type === 'reading' && <div className="p-3 bg-gray-100 rounded mb-3 italic text-sm border">{ex.text}</div>}
                    <p className="mb-3 font-medium text-lg text-gray-900">{ex.question}</p>
                    
                    {(ex.type === 'mcq' || ex.type === 'reading') && (
                      <div className="space-y-2">
                        {ex.options.map(opt => {
                          const isCorrectChoice = opt.toString().trim().toLowerCase() === ex.correct.toString().trim().toLowerCase();
                          const isUserChoice = (answers[idx] || '').toString().trim().toLowerCase() === opt.toString().trim().toLowerCase();
                          
                          return (
                            <label key={opt} className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${isExerciseLocked && isCorrectChoice ? 'bg-green-100 border-green-400' : isExerciseLocked && isUserChoice && !isCorrectChoice ? 'bg-red-100 border-red-400' : isExerciseLocked ? 'bg-white opacity-50 border-transparent' : 'bg-gray-50 border-transparent hover:border-blue-200 cursor-pointer'}`}>
                              <input 
                                type="radio" 
                                name={`question-${idx}`} 
                                value={opt} 
                                onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                                disabled={submitted && (score === dayData.requiredScore || isExerciseLocked)} 
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className={`text-base ${isExerciseLocked && isCorrectChoice ? 'text-green-700 font-bold' : isExerciseLocked && isUserChoice && !isCorrectChoice ? 'text-red-500 line-through' : 'text-gray-700'}`}>
                                {opt}
                              </span>
                              {isExerciseLocked && isCorrectChoice && <CheckCircle2 size={20} className="text-green-600 ml-auto" />}
                              {isExerciseLocked && isUserChoice && !isCorrectChoice && <XCircle size={20} className="text-red-500 ml-auto" />}
                            </label>
                          )
                        })}
                      </div>
                    )}

                    {ex.type === 'writing' && (
                      <div>
                        <input 
                          type="text" 
                          className={`w-full border-2 p-3 rounded-lg outline-none font-medium ${isWritingError ? 'bg-white border-red-400 text-red-600 line-through' : isWritingCorrect ? 'bg-white border-green-400 text-green-700' : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`} 
                          value={answers[idx] || ''} 
                          onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                          disabled={submitted && (score === dayData.requiredScore || isExerciseLocked)} 
                          placeholder="Nhập câu trả lời..."
                        />
                        {isWritingError && (
                          <div className="mt-3 bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg flex items-center gap-2 font-bold text-sm shadow-inner">
                            <CheckCircle2 size={20} /> Đáp án đúng: {ex.correct}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="mt-8 sticky bottom-4 bg-white p-4 border rounded-xl shadow-2xl flex flex-col sm:flex-row justify-between items-center z-10 gap-4">
                <div className="flex-1">
                  {submitted && (
                    <p className={`font-bold text-lg flex items-center gap-2 ${score === dayData.requiredScore ? 'text-green-600' : 'text-red-500'}`}>
                      {score === dayData.requiredScore ? <CheckCircle2/> : <AlertOctagon/>}
                      Điểm: {score}/{dayData.requiredScore} 
                      {score !== dayData.requiredScore && ` (Sai ${exerciseFailCount}/3 lần)`}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {isAdmin && !submitted && (
                    <button onClick={() => {
                      if(dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
                      else onComplete(dayData.id, 0, 0);
                    }} className="w-full sm:w-auto bg-gray-800 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-black transition-colors flex items-center justify-center gap-2">
                      <Wrench size={18} /> Auto-Pass
                    </button>
                  )}
                  
                  {isExerciseLocked ? (
                    <button 
                      onClick={() => {
                        if (dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
                        else onComplete(dayData.id, vocabFailCount, exerciseFailCount);
                      }} 
                      className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-transform hover:-translate-y-0.5 animate-bounce"
                    >
                      Chấp nhận phạt & Tiếp tục
                    </button>
                  ) : score !== dayData.requiredScore ? (
                    <button onClick={handleSubmitExercises} className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-transform hover:-translate-y-0.5">
                      Nộp bài
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'vocab-reveal' && (
        <div className="bg-green-50 p-8 rounded-xl border border-green-200 shadow-lg text-center mt-8">
          <h3 className="text-3xl font-black text-green-700 mb-2">🎉 Hoàn thành chặng đường!</h3>
          <p className="text-green-600 mb-6">Bạn đã mở khóa bộ từ vựng của ngày hôm nay. Hãy ghi nhớ chúng nhé!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left mt-6">
            {dayData.vocabulary.map((v, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="font-bold text-xl text-gray-800">{v.word}</span>
                <span className="text-gray-500 italic mt-1 sm:mt-0">{v.meaning}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onComplete(dayData.id, vocabFailCount, exerciseFailCount)} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-xl transition-colors shadow-lg">
            Kết thúc Ngày {dayData.id}
          </button>
        </div>
      )}
    </div>
  );
}