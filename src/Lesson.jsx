// src/Lesson.jsx
import React, { useState, useEffect } from 'react';

export default function Lesson({ dayData, prevDayData, onComplete, onBack, onCheat }) {
  const initialStep = (prevDayData && prevDayData.vocabulary && prevDayData.vocabulary.length > 0) 
                      ? 'vocab-check' : 'learning';
  const [step, setStep] = useState(initialStep);

  const [vocabFailCount, setVocabFailCount] = useState(0);
  const [exerciseFailCount, setExerciseFailCount] = useState(0);

  const [vocabAnswers, setVocabAnswers] = useState({});
  const [vocabError, setVocabError] = useState(false);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isVideoWatched, setIsVideoWatched] = useState(false);

  // ==========================================
  // HỆ THỐNG GIÁM THỊ (ANTI-CHEAT)
  // ==========================================
  useEffect(() => {
    // Bẫy 1: Chuyển Tab hoặc mở app khác
    const handleVisibilityChange = () => {
      // Chỉ phạt nếu học sinh đang làm bài (chưa nộp) mà dám chuyển tab
      if (document.hidden && !submitted) {
        alert("🚨 CẢNH BÁO GIAN LẬN! Bạn đã rời khỏi màn hình làm bài.\nHệ thống hủy bài hiện tại và trừ 5 điểm!");
        if (onCheat) onCheat(); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Bẫy 2: Cố tình F5 tải lại trang hoặc bấm x tắt web
    const handleBeforeUnload = (e) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = "Bạn đang làm bài, thoát ra sẽ bị tính là gian lận!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Dọn dẹp cảm biến khi component bị hủy
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitted, onCheat]);

  // Bẫy 3: Nút Quay lại (Bỏ cuộc giữa chừng)
  const handleQuit = () => {
    if (!submitted) {
      const confirmQuit = window.confirm("CẢNH BÁO: Bỏ cuộc giữa chừng sẽ bị hệ thống đánh giá là gian lận và trừ 5 điểm. Bạn có chắc chắn muốn thoát?");
      if (confirmQuit) {
        if (onCheat) onCheat();
      }
    } else {
      onBack(); // Nếu đã nộp bài (submitted) thì cho về bình thường
    }
  };

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
      setVocabFailCount(prev => prev + 1);
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
        onComplete(dayData.id, vocabFailCount, exerciseFailCount);
      }
    } else {
      setExerciseFailCount(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Nút thoát an toàn kết hợp chống gian lận */}
      <button onClick={handleQuit} className="mb-4 text-blue-500 hover:underline font-medium">
        ← Quay lại Lộ trình
      </button>
      
      <h2 className="text-2xl font-bold mb-4">
        {dayData.isTest ? `Bài Test Lớn (Ngày ${dayData.id})` : `Bài học Ngày ${dayData.id}`}
      </h2>

      {step === 'vocab-check' && (
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-400">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🚧 Trạm Kiểm Tra Khởi Động</h3>
          <p className="text-gray-600 mb-6">Bạn phải nhập chính xác từ tiếng Anh của Ngày {dayData.id - 1}.</p>
          
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
                  <button onClick={() => setIsVideoWatched(true)} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                    Tôi đã xem xong Video!
                  </button>
                </div>
              )}
            </div>
          )}

          {(dayData.isTest || !dayData.videoUrl || isVideoWatched) && (
            <div className="space-y-8">
              {dayData.exercises.map((ex, idx) => (
                <div key={idx} className="p-4 border rounded-lg shadow-sm bg-white relative">
                  <h3 className="font-semibold mb-2">Câu {idx + 1}: {ex.type.toUpperCase()}</h3>
                  
                  {/* Bổ sung hiển thị hình ảnh nếu có */}
                  {ex.image && (
                    <img src={ex.image} alt="Minh họa" className="w-48 rounded-lg mb-4 shadow-sm" />
                  )}

                  {ex.type === 'reading' && <div className="p-3 bg-gray-100 rounded mb-3 italic text-sm">{ex.text}</div>}
                  <p className="mb-3 font-medium">{ex.question}</p>
                  
                  {(ex.type === 'mcq' || ex.type === 'reading') && (
                    <div className="space-y-2">
                      {ex.options.map(opt => (
                        <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`question-${idx}`} 
                            value={opt} 
                            onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                            disabled={submitted && score === dayData.requiredScore}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {ex.type === 'writing' && (
                    <input 
                      type="text" 
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" 
                      value={answers[idx] || ''} 
                      onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                      disabled={submitted && score === dayData.requiredScore}
                      placeholder="Nhập câu trả lời..."
                    />
                  )}
                </div>
              ))}

              <div className="mt-8 sticky bottom-4 bg-white p-4 border rounded-lg shadow-2xl flex flex-col sm:flex-row justify-between items-center z-10 gap-4">
                <div>
                  {submitted && (
                    <p className={`font-bold text-lg ${score === dayData.requiredScore ? 'text-green-600' : 'text-red-500'}`}>
                      Điểm: {score}/{dayData.requiredScore} {score !== dayData.requiredScore && `(Sai ${exerciseFailCount} lần)`}
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleSubmitExercises} 
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition-colors"
                >
                  Nộp bài
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'vocab-reveal' && (
        <div className="bg-green-50 p-8 rounded-xl border border-green-200 shadow-lg text-center mt-8">
          <h3 className="text-3xl font-black text-green-700 mb-2">🎉 Hoàn hảo!</h3>
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