// src/Lesson.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { CheckCircle2, XCircle, BookPlus, Wrench, AlertOctagon, Lightbulb, Ticket, PlayCircle, Clock } from 'lucide-react';

// Hàm tự động nhận diện ID của YouTube
const getYouTubeID = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// TÍNH NĂNG MỚI: Tự động bóc tách ID của file video từ Google Drive
const getGoogleDriveID = (url) => {
  if (!url) return null;
  // Hỗ trợ link chia sẻ dạng /file/d/ID/view hoặc uc?id=ID hoặc open?id=ID
  const regExp = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?id=)([a-zA-Z0-9_-]{25,35})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export default function Lesson({ dayData, prevDayData, onComplete, onBack, onCheat, isAdmin, inventory, consumeItem, onUpdateWordProgress }) {
  const initialStep = (prevDayData && prevDayData.vocabulary && prevDayData.vocabulary.length > 0) ? 'vocab-check' : (dayData.videoUrl ? 'video-learning' : 'exercises');
  const [step, setStep] = useState(initialStep);

  const [selectedCheckVocab, setSelectedCheckVocab] = useState([]);
  const [vocabFailCount, setVocabFailCount] = useState(0);
  const [exerciseFailCount, setExerciseFailCount] = useState(0);
  const [vocabAnswers, setVocabAnswers] = useState({});
  const [vocabErrors, setVocabErrors] = useState({}); 
  const [savedToNotebook, setSavedToNotebook] = useState({}); 
  const [hasPassedVocab, setHasPassedVocab] = useState(false);

  // ==========================================
  // HỆ THỐNG XỬ LÝ VIDEO ĐA NỀN TẢNG (YOUTUBE / DRIVE / LOCAL)
  // ==========================================
  const rawUrl = dayData.videoUrl || '';
  const ytId = getYouTubeID(rawUrl);
  const driveId = getGoogleDriveID(rawUrl);
  
  const isYouTube = !!ytId; 
  const isDrive = !!driveId; // Xác định nếu là link Google Drive

  const REQUIRED_TIME = 900; // 15 phút = 900 giây học tập nghiêm túc
  const [watchTime, setWatchTime] = useState(0); 
  const [isVideoWatched, setIsVideoWatched] = useState(false); 

  const [answers, setAnswers] = useState({});
  const [hintedQuestions, setHintedQuestions] = useState([]); 
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (prevDayData && prevDayData.vocabulary && prevDayData.vocabulary.length > 0) {
      const shuffled = [...prevDayData.vocabulary].sort(() => 0.5 - Math.random());
      setSelectedCheckVocab(shuffled.slice(0, 5));
    }
  }, [prevDayData]);

  // HỆ THỐNG ANTI-CHEAT GIAN LẬN
  useEffect(() => {
    if (isAdmin) return;
    const handleVisibilityChange = () => {
      if (document.hidden && !submitted && step === 'exercises') {
        alert("🚨 CẢNH BÁO GIAN LẬN! Bạn rời khỏi màn hình trong lúc làm bài thi.\nHệ thống hủy bài và phạt Điểm & Coins!");
        if (onCheat) onCheat(); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const handleBeforeUnload = (e) => {
      if (!submitted && (step === 'exercises' || step === 'video-learning')) {
        e.preventDefault();
        e.returnValue = "Thoát ra sẽ bị tính là gian lận!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitted, onCheat, step, isAdmin]);

  const handleQuit = () => {
    if (isAdmin) return onBack();
    if (!submitted && (step === 'exercises' || step === 'video-learning')) {
      const confirmQuit = window.confirm("Bỏ cuộc giữa chừng sẽ bị phạt Điểm & Coins. Chắc chắn thoát?");
      if (confirmQuit && onCheat) onCheat();
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
      if (!hasPassedVocab && onUpdateWordProgress) {
        onUpdateWordProgress(selectedCheckVocab.map(v => v.word));
        setHasPassedVocab(true);
      }
      setStep(rawUrl ? 'video-learning' : 'exercises');
      setVocabErrors({});
    } else {
      setVocabFailCount(prev => prev + 1);
      setVocabErrors(errors); 
    }
  };

  const handleUseSkip = async () => {
    const success = await consumeItem('skips');
    if (success) {
      alert("🎟️ Đã dùng 1 thẻ Skip! Bỏ qua kiểm tra từ vựng.");
      setStep(rawUrl ? 'video-learning' : 'exercises');
    } else {
      alert("Bạn không đủ thẻ Skip! Hãy mua trong Cửa hàng.");
    }
  };

  const handleAddToNotebook = async (idx, wordObj) => {
    if (!auth.currentUser) return;
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        notebook: arrayUnion({ word: wordObj.word, meaning: wordObj.meaning, addedAt: new Date().toDateString() })
      });
      setSavedToNotebook(prev => ({ ...prev, [idx]: true }));
    } catch (error) {}
  };

  // ==========================================
  // THUẬT TOÁN ĐẾM GIỜ XEM VIDEO NGẦM (15 PHÚT)
  // ==========================================
  useEffect(() => {
    if (isAdmin || step !== 'video-learning' || isVideoWatched) return;

    const timer = setInterval(() => {
      // Chỉ đếm thời gian khi học viên mở tab này (Chống mở tab nền để treo máy)
      if (!document.hidden) {
        setWatchTime(prev => {
          const newTime = prev + 1;
          if (newTime >= REQUIRED_TIME) {
            setIsVideoWatched(true);
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isAdmin, step, isVideoWatched]);

  const handleUseHint = async () => {
    let targetIdx = -1;
    for (let i = 0; i < dayData.exercises.length; i++) {
      const ex = dayData.exercises[i];
      const currentAns = (answers[i] || '').toString().trim().toLowerCase();
      const correctAns = ex.correct.toString().trim().toLowerCase();
      
      if (currentAns !== correctAns && !hintedQuestions.includes(i)) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx === -1) {
      alert("Bạn đã điền đúng hết rồi, không cần Hint nữa!");
      return; 
    }

    const success = await consumeItem('hints');
    if (success) {
      const correctAns = dayData.exercises[targetIdx].correct;
      setAnswers(prev => ({ ...prev, [targetIdx]: correctAns }));
      setHintedQuestions(prev => [...prev, targetIdx]);
      
      const element = document.getElementById(`exercise-${targetIdx}`);
      if(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      alert("Bạn không đủ Hint! Hãy mua trong Cửa hàng.");
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
      if (dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
      else onComplete(dayData.id, vocabFailCount, exerciseFailCount);
    } else {
      const newFailCount = exerciseFailCount + 1;
      setExerciseFailCount(newFailCount);
      if (newFailCount >= 3) alert("🚨 BẠN ĐÃ LÀM SAI 3 LẦN!\nHệ thống khóa bài. Xem đáp án và chấp nhận nộp phạt Điểm & Coins để đi tiếp.");
    }
  };

  const isExerciseLocked = exerciseFailCount >= 3;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={handleQuit} className="mb-4 text-blue-500 hover:underline font-medium">← Quay lại Lộ trình</button>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {dayData.isTest ? `Bài Test Lớn (Ngày ${dayData.id})` : `Bài học Ngày ${dayData.id}`}
        {isAdmin && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Admin Mode</span>}
      </h2>

      {step === 'vocab-check' && (
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-400">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🚧 Trạm Kiểm Tra Khởi Động</h3>
              <p className="text-gray-600">Hoàn thành 5 từ vựng của Ngày {dayData.id - 1} để đi tiếp.</p>
            </div>
            <button onClick={handleUseSkip} className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-200 shadow-sm border border-orange-200">
              <Ticket size={18}/> Dùng Skip ({inventory?.skips || 0})
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            {selectedCheckVocab.map((v, idx) => (
              <div key={idx} className="flex flex-col border-b pb-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-lg w-48 text-indigo-700">"{v.meaning}"</span>
                  <input type="text" placeholder="Nhập từ tiếng Anh..." className={`flex-1 border p-2 rounded focus:ring-2 outline-none ${vocabErrors[idx] ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'focus:ring-indigo-300'}`} value={vocabAnswers[idx] || ''} onChange={(e) => setVocabAnswers({...vocabAnswers, [idx]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleVocabCheck()} />
                </div>
                {vocabErrors[idx] && (
                  <div className="flex items-center justify-between bg-red-100 p-2 rounded text-sm text-red-700">
                    <span className="flex items-center gap-1"><XCircle size={16} /> Sai rồi! Hãy kiểm tra lại.</span>
                    <button onClick={() => handleAddToNotebook(idx, v)} disabled={savedToNotebook[idx]} className={`flex items-center gap-1 font-bold px-3 py-1 rounded transition-colors ${savedToNotebook[idx] ? 'bg-green-600 text-white' : 'bg-white text-red-600 hover:bg-red-200 border border-red-300'}`}>
                      <BookPlus size={14} />{savedToNotebook[idx] ? "Đã vào sổ tay ✔" : "Thêm vào sổ tay"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleVocabCheck} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 shadow transition">Xác nhận</button>
          {isAdmin && <button onClick={() => setStep(rawUrl ? 'video-learning' : 'exercises')} className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-black flex items-center justify-center gap-2"><Wrench size={18} /> [Admin] Bỏ qua kiểm tra</button>}
        </div>
      )}

      {step === 'video-learning' && (
        <div className="bg-white p-6 rounded-xl shadow-lg border relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><PlayCircle className="text-blue-600"/> Video Bài Giảng</h3>
            {isAdmin && <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded">Admin Mode: Xem tự do</span>}
          </div>

          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md relative flex items-center justify-center">
            
            {/* TỰ ĐỘNG PHÂN LUỒNG TRÌNH PHÁT THEO ĐƯỜNG DẪN INPUT */}
            {isYouTube ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute top-0 left-0"
              ></iframe>
            ) : isDrive ? (
              /* NẾU LÀ DRIVE: Nhúng trực tiếp bằng Iframe dạng Preview bảo mật của Google */
              <iframe
                width="100%"
                height="100%"
                src={`https://drive.google.com/file/d/${driveId}/preview`}
                title="Google Drive video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0"
              ></iframe>
            ) : rawUrl ? (
              <video 
                src={rawUrl}
                controls
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
              />
            ) : (
              <span className="text-red-500 font-bold">Lỗi: Không tìm thấy đường dẫn Video.</span>
            )}
          </div>
          
          {/* ẨN THANH CHẠY VÀ ĐẾM NGƯỢC - THEO DÕI NGẦM 15 PHÚT */}
          <div className="mt-8 text-center min-h-[80px] flex flex-col justify-center items-center">
            {isVideoWatched || isAdmin ? (
              <button onClick={() => setStep('exercises')} className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-xl hover:-translate-y-1 transition-transform animate-bounce flex items-center justify-center gap-2">
                <CheckCircle2 size={24} /> Tiến vào Bài Tập
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200 border-dashed w-full sm:w-auto">
                <p className="text-gray-600 font-bold flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Clock size={20} className="text-blue-500 animate-pulse"/>
                  Hệ thống đang theo dõi sự tập trung của bạn...
                </p>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Tập trung hoàn thành bài học !!!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'exercises' && (
        <div className="space-y-8">
          {dayData.exercises.map((ex, idx) => {
            const isWritingError = isExerciseLocked && (answers[idx] || '').toString().trim().toLowerCase() !== ex.correct.toString().trim().toLowerCase();
            const isWritingCorrect = isExerciseLocked && !isWritingError;
            
            const isHinted = hintedQuestions.includes(idx);

            let cardClass = `p-4 border-2 rounded-xl relative transition-all duration-500 ease-out `;
            if (isWritingError) cardClass += 'bg-red-50 border-red-200 shadow-sm';
            else if (isExerciseLocked) cardClass += 'bg-green-50 border-green-200 shadow-sm';
            else if (isHinted) cardClass += 'bg-green-50 border-green-400 ring-4 ring-green-100 shadow-lg scale-[1.02]';
            else cardClass += 'bg-white border-gray-200 shadow-sm hover:shadow-md';

            return (
              <div key={idx} id={`exercise-${idx}`} className={cardClass}>
                <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2 text-lg">
                  Câu {idx + 1}: {ex.type.toUpperCase()}
                  {isHinted && <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse"><Lightbulb size={14}/> Hinted</span>}
                </h3>
                
                {ex.image && <img src={ex.image} alt="Minh họa" className="w-48 rounded-lg mb-4 shadow-sm" />}
                {ex.type === 'reading' && <div className="p-3 bg-gray-100 rounded mb-3 italic text-sm border">{ex.text}</div>}
                <p className="mb-4 font-medium text-lg text-gray-900">{ex.question}</p>
                
                {(ex.type === 'mcq' || ex.type === 'reading') && (
                  <div className="space-y-2">
                    {ex.options.map(opt => {
                      const isCorrectChoice = opt.toString().trim().toLowerCase() === ex.correct.toString().trim().toLowerCase();
                      const isUserChoice = (answers[idx] || '').toString().trim().toLowerCase() === opt.toString().trim().toLowerCase();
                      
                      let optionClass = `flex items-center space-x-3 p-3 rounded-lg border-2 transition-all `;
                      if (isExerciseLocked && isCorrectChoice) optionClass += 'bg-green-100 border-green-400';
                      else if (isExerciseLocked && isUserChoice && !isCorrectChoice) optionClass += 'bg-red-100 border-red-400';
                      else if (isExerciseLocked) optionClass += 'bg-white opacity-50 border-transparent';
                      else if (isHinted && isCorrectChoice) optionClass += 'bg-green-100 border-green-500 shadow-inner font-bold'; 
                      else optionClass += 'bg-gray-50 border-transparent hover:border-blue-200 cursor-pointer';

                      return (
                        <label key={opt} className={optionClass}>
                          <input 
                            type="radio" 
                            name={`question-${idx}`} 
                            value={opt} 
                            checked={isUserChoice}
                            onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                            disabled={submitted && (score === dayData.requiredScore || isExerciseLocked)} 
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className={`text-base ${(isExerciseLocked || isHinted) && isCorrectChoice ? 'text-green-700 font-bold' : isExerciseLocked && isUserChoice && !isCorrectChoice ? 'text-red-500 line-through' : 'text-gray-700'}`}>{opt}</span>
                          {(isExerciseLocked || isHinted) && isCorrectChoice && <CheckCircle2 size={20} className="text-green-600 ml-auto" />}
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
                      className={`w-full border-2 p-3 rounded-lg outline-none font-medium transition-all ${isWritingError ? 'bg-white border-red-400 text-red-600 line-through' : isWritingCorrect || isHinted ? 'bg-white border-green-500 text-green-700 ring-2 ring-green-100' : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`} 
                      value={answers[idx] || ''} 
                      onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                      disabled={submitted && (score === dayData.requiredScore || isExerciseLocked)} 
                      placeholder="Nhập câu trả lời..."
                    />
                    {isWritingError && <div className="mt-3 bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg flex items-center gap-2 font-bold text-sm shadow-inner"><CheckCircle2 size={20} /> Đáp án đúng: {ex.correct}</div>}
                  </div>
                )}
              </div>
            )
          })}

          <div className="mt-8 sticky bottom-4 bg-white p-4 border rounded-xl shadow-2xl flex flex-col md:flex-row justify-between items-center z-10 gap-4">
            <div className="flex-1 w-full text-center md:text-left">
              {submitted ? (
                <p className={`font-bold text-lg flex items-center justify-center md:justify-start gap-2 ${score === dayData.requiredScore ? 'text-green-600' : 'text-red-500'}`}>
                  {score === dayData.requiredScore ? <CheckCircle2/> : <AlertOctagon/>}
                  Đúng: {score}/{dayData.requiredScore} câu
                  {score !== dayData.requiredScore && ` (Sai ${exerciseFailCount}/3)`}
                </p>
              ) : (
                <button onClick={handleUseHint} className="text-yellow-600 bg-yellow-50 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-100 transition-colors border border-yellow-300 shadow-sm w-full md:w-auto active:scale-95">
                  <Lightbulb size={18}/> Dùng Hint ({inventory?.hints || 0})
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {isAdmin && !submitted && (
                <button onClick={() => {
                  if(dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
                  else onComplete(dayData.id, 0, 0);
                }} className="w-full sm:w-auto bg-gray-800 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-black transition-colors flex items-center justify-center gap-2">
                  <Wrench size={18} /> Auto-Pass
                </button>
              )}
              {isExerciseLocked ? (
                <button onClick={() => {
                  if (dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
                  else onComplete(dayData.id, vocabFailCount, exerciseFailCount);
                }} className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-transform hover:-translate-y-0.5 animate-bounce">
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
            Nhận Thưởng & Kết thúc Ngày {dayData.id}
          </button>
        </div>
      )}
    </div>
  );
}