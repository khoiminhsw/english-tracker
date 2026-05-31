import React, { useState } from 'react';

export default function Lesson({ dayData, prevDayData, onComplete, onBack }) {
  const initialStep = (prevDayData && prevDayData.vocabulary && prevDayData.vocabulary.length > 0) 
                      ? 'vocab-check' : 'learning';
  const [step, setStep] = useState(initialStep);

  // BỘ ĐẾM SỐ LẦN SAI
  const [vocabFailCount, setVocabFailCount] = useState(0);
  const [exerciseFailCount, setExerciseFailCount] = useState(0);

  const [vocabAnswers, setVocabAnswers] = useState({});
  const [vocabError, setVocabError] = useState(false);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isVideoWatched, setIsVideoWatched] = useState(false);

  const handleVocabCheck = () => {
    let isAllCorrect = true;
    prevDayData.vocabulary.forEach((v, idx) => {
      const userAnswer = (vocabAnswers[idx] || '').toString().trim().toLowerCase();
      const correctAnswer = v.word.toString().trim().toLowerCase();
      if (userAnswer !== correctAnswer) {
        isAllCorrect = false;
      }
    });

    if (isAllCorrect) {
      setStep('learning');
      setVocabError(false);
    } else {
      setVocabFailCount(prev => prev + 1); // Tăng biến đếm sai từ vựng
      setVocabError(true);
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
        // Truyền thêm số lần sai về cho App.jsx xử lý trừ điểm
        onComplete(dayData.id, vocabFailCount, exerciseFailCount);
      }
    } else {
      setExerciseFailCount(prev => prev + 1); // Tăng biến đếm sai bài tập
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">← Quay lại Lộ trình</button>
      
      <h2 className="text-2xl font-bold mb-4">
        {dayData.isTest ? `Bài Test Lớn (Ngày ${dayData.id})` : `Bài học Ngày ${dayData.id}`}
      </h2>

      {step === 'vocab-check' && (
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-400">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🚧 Trạm Kiểm Tra Khởi Động</h3>
          <p className="text-gray-600 mb-6">Kiểm tra từ vựng ngày {dayData.id - 1}.</p>
          
          <div className="space-y-4 mb-6">
            {prevDayData.vocabulary.map((v, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b pb-4">
                <span className="font-semibold text-lg w-48 text-indigo-700">"{v.meaning}"</span>
                <input 
                  type="text" 
                  placeholder="Nhập từ..."
                  className="flex-1 border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none"
                  value={vocabAnswers[idx] || ''}
                  onChange={(e) => setVocabAnswers({...vocabAnswers, [idx]: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleVocabCheck()}
                />
              </div>
            ))}
          </div>
          {vocabError && <p className="text-red-500 font-bold mb-4">Sai rồi! (Số lần sai: {vocabFailCount})</p>}
          <button onClick={handleVocabCheck} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 shadow transition">Xác nhận</button>
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
                  <button onClick={() => setIsVideoWatched(true)} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold">Miu đã xem xong Video! Làm bài tập</button>
                </div>
              )}
            </div>
          )}

          {(dayData.isTest || !dayData.videoUrl || isVideoWatched) && (
            <div className="space-y-8">
              {dayData.exercises.map((ex, idx) => (
                <div key={idx} className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="font-semibold mb-2">Câu {idx + 1}: {ex.type.toUpperCase()}</h3>
                  {ex.type === 'reading' && <div className="p-3 bg-gray-100 rounded mb-3 italic">{ex.text}</div>}
                  <p className="mb-3">{ex.question}</p>
                  {(ex.type === 'mcq' || ex.type === 'reading') && (
                    <div className="space-y-2">
                      {ex.options.map(opt => (
                        <label key={opt} className="flex items-center space-x-2">
                          <input type="radio" name={`question-${idx}`} value={opt} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted && score === dayData.requiredScore}/>
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {ex.type === 'writing' && (
                    <input type="text" className="w-full border p-2 rounded" value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} disabled={submitted && score === dayData.requiredScore}/>
                  )}
                </div>
              ))}

              <div className="mt-8 sticky bottom-4 bg-white p-4 border rounded-lg shadow-xl flex justify-between items-center z-10">
                <div>
                  {submitted && (
                    <p className={`font-bold ${score === dayData.requiredScore ? 'text-green-600' : 'text-red-500'}`}>
                      Điểm: {score}/{dayData.requiredScore} {score !== dayData.requiredScore && `(Sai ${exerciseFailCount} lần)`}
                    </p>
                  )}
                </div>
                <button onClick={handleSubmitExercises} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700">Nộp bài</button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'vocab-reveal' && (
        <div className="bg-green-50 p-8 rounded-xl border border-green-200 shadow-lg text-center">
          <h3 className="text-3xl font-black text-green-700 mb-2">🎉 Hoàn hảo!</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left mt-6">
            {dayData.vocabulary.map((v, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex justify-between items-center">
                <span className="font-bold text-xl text-gray-800">{v.word}</span>
                <span className="text-gray-500 italic">{v.meaning}</span>
              </div>
            ))}
          </div>
          {/* Gửi báo cáo lỗi về cho App xử lý */}
          <button onClick={() => onComplete(dayData.id, vocabFailCount, exerciseFailCount)} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl">
            Kết thúc Ngày {dayData.id}
          </button>
        </div>
      )}
    </div>
  );
}