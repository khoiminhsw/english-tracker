// src/Lesson.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { CheckCircle2, XCircle, BookPlus, Wrench, AlertOctagon, Lightbulb, Ticket, PlayCircle, Clock, ShieldAlert, BookOpen } from 'lucide-react';

const getYouTubeID = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getGoogleDriveID = (url) => {
  if (!url) return null;
  const regExp = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?id=)([a-zA-Z0-9_-]{25,35})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export default function Lesson({ dayData, prevDayData, onComplete, onBack, onCheat, isAdmin, inventory, consumeItem, onUpdateWordProgress }) {
  const initialStep = (prevDayData && prevDayData.vocabulary && prevDayData.vocabulary.length > 0) 
      ? 'vocab-check' 
      : (dayData.isTest ? 'test-intro' : (dayData.videoUrl ? 'video-learning' : 'exercises'));
      
  const [step, setStep] = useState(initialStep);

  const [selectedCheckVocab, setSelectedCheckVocab] = useState([]);
  const [vocabFailCount, setVocabFailCount] = useState(0);
  const [exerciseFailCount, setExerciseFailCount] = useState(0);
  const [vocabAnswers, setVocabAnswers] = useState({});
  const [vocabErrors, setVocabErrors] = useState({}); 
  const [savedToNotebook, setSavedToNotebook] = useState({}); 
  const [hasPassedVocab, setHasPassedVocab] = useState(false);

  // LOGIC BÀI TEST LỚN: TỐI ĐA SAI 5 LẦN THEO YÊU CẦU
  const maxFails = dayData.isTest ? 5 : 3;
  const [testTimeLeft, setTestTimeLeft] = useState(3600); // 60 phút = 3600 giây
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  const rawUrl = dayData.videoUrl || '';
  const ytId = getYouTubeID(rawUrl);
  const driveId = getGoogleDriveID(rawUrl);
  
  const isYouTube = !!ytId; 
  const isDrive = !!driveId; 

  const REQUIRED_TIME = 900; 
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

  // ANTI-CHEAT: Chống mở tab khác
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
      if (!submitted && (step === 'exercises' || step === 'video-learning' || step === 'test-intro')) {
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

  // ==========================================
  // ĐỘNG CƠ ĐẾM NGƯỢC SIÊU MƯỢT (FIXED)
  // ==========================================
  // Luồng 1: Chỉ chuyên đếm ngược trừ thời gian (Không bị reset)
  useEffect(() => {
    if (step !== 'exercises' || !dayData.isTest || submitted || isAdmin) return;

    const timerId = setInterval(() => {
      setTestTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [step, dayData.isTest, submitted, isAdmin]); 

  // Luồng 2: Lắng nghe sự kiện hết giờ (Để nộp bài mà không làm sập UI)
  useEffect(() => {
    if (step === 'exercises' && dayData.isTest && testTimeLeft === 0 && !submitted && !isAdmin) {
      setSubmitted(true);
      setExerciseFailCount(maxFails); 
      // Dùng setTimeout 100ms để tách biệt luồng thông báo, tránh lỗi màn hình trắng (White Screen of Death)
      setTimeout(() => {
        alert("⏰ ĐÃ HẾT THỜI GIAN LÀM BÀI 60 PHÚT!\nHệ thống tự động thu bài và khóa bài thi.");
      }, 100);
    }
  }, [testTimeLeft, step, dayData.isTest, submitted, isAdmin, maxFails]);

  const handleQuit = () => {
    if (isAdmin) return onBack();
    if (!submitted && (step === 'exercises' || step === 'video-learning' || step === 'test-intro')) {
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
      setStep(dayData.isTest ? 'test-intro' : (rawUrl ? 'video-learning' : 'exercises'));
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
      setStep(dayData.isTest ? 'test-intro' : (rawUrl ? 'video-learning' : 'exercises'));
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

  useEffect(() => {
    if (isAdmin || step !== 'video-learning' || isVideoWatched) return;

    const timer = setInterval(() => {
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
    for (let i = 0; i < (dayData.exercises || []).length; i++) {
      const ex = dayData.exercises[i];
      const currentAns = (answers[i] || '').toString().trim().toLowerCase();
      const correctAns = (ex.correct || '').toString().trim().toLowerCase();
      
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
    (dayData.exercises || []).forEach((ex, idx) => {
      const userAnswer = (answers[idx] || '').toString().trim().toLowerCase();
      const correctAnswer = (ex.correct || '').toString().trim().toLowerCase();
      if (userAnswer === correctAnswer) currentScore++;
    });
    setScore(currentScore);

    if (currentScore === dayData.requiredScore) {
      setSubmitted(true);
      if (dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
      else onComplete(dayData.id, vocabFailCount, exerciseFailCount);
    } else {
      
      // ĐẶC QUYỀN NỘP NHÁP LẦN 1 (+15 PHÚT = 900 GIÂY) CHO BÀI TEST LỚN
      if (dayData.isTest && !hasSubmittedOnce && testTimeLeft > 0) {
         setHasSubmittedOnce(true);
         setTestTimeLeft(prev => prev + 900); 
         const newFailCount = exerciseFailCount + 1;
         setExerciseFailCount(newFailCount); 
         alert("⚠️ BÀI LÀM CÒN SAI SÓT!\n\nBạn đã dùng quyền Nộp bài lần 1. Hệ thống đã tặng thêm cho bạn 15 phút để rà soát và sửa lại những câu sai.");
         return; 
      }

      const newFailCount = exerciseFailCount + 1;
      setExerciseFailCount(newFailCount);

      if (newFailCount >= maxFails) {
        setSubmitted(true); 
        alert(`🚨 BẠN ĐÃ LÀM SAI QUÁ ${maxFails} LẦN!\nHệ thống khóa bài. Xem đáp án và chấp nhận nộp phạt Điểm & Coins để đi tiếp.`);
      } else {
        alert(`❌ Sai rồi! Bạn đã sai ${newFailCount}/${maxFails} lần.`);
      }
    }
  };

  const isExerciseLocked = exerciseFailCount >= maxFails || (dayData.isTest && testTimeLeft <= 0 && submitted);

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <button onClick={handleQuit} className="mb-4 text-blue-500 hover:underline font-medium">← Quay lại Lộ trình</button>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {dayData.isTest ? `Bài Test Lớn (Ngày ${dayData.id})` : `Bài học Ngày ${dayData.id}`}
        {isAdmin && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Admin Mode</span>}
      </h2>

      {/* ĐỒNG HỒ NỔI CHO BÀI TEST TỰ ĐỘNG ĐẾM NGƯỢC */}
      {dayData.isTest && step === 'exercises' && (
        <div className={`fixed top-4 right-4 sm:top-8 sm:right-8 bg-white/95 backdrop-blur-md border-[5px] p-4 sm:p-5 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-50 flex flex-col items-center justify-center animate-in slide-in-from-top-10 transition-colors ${testTimeLeft < 300 ? 'border-red-500 text-red-600 animate-pulse' : 'border-[#6366f1] text-[#4f46e5]'}`}>
           <span className="text-sm font-black uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={18} className="stroke-[3px]"/> Thời gian</span>
           <div className="text-5xl sm:text-6xl font-black font-mono tracking-wider leading-none">
              {Math.floor(testTimeLeft / 60).toString().padStart(2, '0')}:{(testTimeLeft % 60).toString().padStart(2, '0')}
           </div>
           {hasSubmittedOnce && <span className="text-[13px] bg-[#dcfce7] text-[#166534] px-4 py-1.5 rounded-full mt-3 font-black uppercase shadow-sm animate-bounce">+15 Phút Bonus</span>}
        </div>
      )}

      {/* MÀN HÌNH CHUẨN BỊ (TEST INTRO) VỚI ĐIỀU KIỆN 5 LẦN SAI - 15 PHÚT BONUS */}
      {step === 'test-intro' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border-t-8 border-red-600 max-w-2xl mx-auto text-center animate-in zoom-in duration-300 mt-10">
           <div className="inline-block p-5 bg-red-100 rounded-full mb-6 animate-pulse shadow-inner">
             <AlertOctagon size={70} className="text-red-600"/>
           </div>
           <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 tracking-tight uppercase">Bài Kiểm Tra Quan Trọng</h2>
           
           <div className="bg-red-50 p-6 sm:p-8 rounded-2xl border border-red-200 mb-8 text-left space-y-5 shadow-sm">
              <p className="text-red-800 font-black text-lg flex items-center gap-2">
                 <ShieldAlert size={24}/> Bạn đã sẵn sàng để làm bài chưa?
              </p>
              <ul className="text-red-700 space-y-4 font-medium text-base">
                 <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full shrink-0"></span>
                    <span>Thời gian làm bài: <b className="text-red-900 bg-white px-2 py-1 rounded-lg shadow-sm border border-red-100">60 Phút</b> đếm ngược.</span>
                 </li>
                 <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full shrink-0"></span>
                    <span>Sai quá <b className="text-red-900">5 lần</b> hệ thống sẽ tự động khóa bài và nộp phạt kỷ luật.</span>
                 </li>
                 <li className="flex items-start gap-3 bg-red-100/50 p-4 rounded-xl border border-red-200">
                    <span className="text-xl">🎁</span>
                    <span className="leading-relaxed"><b className="text-red-900">Đặc quyền:</b> Nộp bài lần đầu tiên (nếu có lỗi sai) sẽ được tự động cộng thêm <b className="text-red-900 font-black">15 phút</b> để rà soát lại.</span>
                 </li>
              </ul>
           </div>
           
           <button onClick={() => setStep('exercises')} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all active:scale-95 flex items-center justify-center gap-3">
             <PlayCircle size={28}/> BẮT ĐẦU LÀM BÀI NGAY
           </button>
        </div>
      )}

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
          {isAdmin && <button onClick={() => setStep(dayData.isTest ? 'test-intro' : (rawUrl ? 'video-learning' : 'exercises'))} className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-black flex items-center justify-center gap-2"><Wrench size={18} /> [Admin] Bỏ qua kiểm tra</button>}
        </div>
      )}

      {step === 'video-learning' && (
        <div className="bg-white p-6 rounded-xl shadow-lg border relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><PlayCircle className="text-blue-600"/> Video Bài Giảng</h3>
            {isAdmin && <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded">Admin Mode: Xem tự do</span>}
          </div>

          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md relative flex items-center justify-center">
            {isYouTube ? (
              <iframe 
                width="100%" height="100%" 
                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`} 
                title="YouTube video player" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                className="absolute top-0 left-0"
              ></iframe>
            ) : isDrive ? (
              <iframe
                width="100%" height="100%"
                src={`https://drive.google.com/file/d/${driveId}/preview`}
                title="Google Drive video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                className="absolute top-0 left-0"
              ></iframe>
            ) : rawUrl ? (
              <video src={rawUrl} controls width="100%" height="100%" className="absolute top-0 left-0"/>
            ) : (
              <span className="text-red-500 font-bold">Lỗi: Không tìm thấy đường dẫn Video.</span>
            )}
          </div>
          
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
          {(dayData.exercises || []).map((ex, idx) => {
            const isWritingError = isExerciseLocked && (answers[idx] || '').toString().trim().toLowerCase() !== (ex.correct || '').toString().trim().toLowerCase();
            const isWritingCorrect = isExerciseLocked && !isWritingError;
            const isHinted = hintedQuestions.includes(idx);

            let cardClass = `p-5 border-2 rounded-2xl relative transition-all duration-500 ease-out shadow-sm `;
            if (isWritingError) cardClass += 'bg-red-50 border-red-200';
            else if (isExerciseLocked) cardClass += 'bg-green-50 border-green-200';
            else if (isHinted) cardClass += 'bg-green-50 border-green-400 ring-4 ring-green-100 scale-[1.02]';
            else cardClass += 'bg-white border-gray-200 hover:shadow-md';

            return (
              <div key={idx} id={`exercise-${idx}`} className={cardClass}>
                <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2 text-lg border-b pb-2">
                  Câu {idx + 1}: {(ex.type || '').toUpperCase()}
                  {isHinted && <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse ml-auto"><Lightbulb size={14}/> Đã dùng gợi ý</span>}
                </h3>
                
                {ex.image && <img src={ex.image} alt="Minh họa" className="w-48 rounded-lg mb-5 shadow-sm border border-gray-100" />}
                
                {ex.type === 'reading' && (
                  <div className="mb-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner overflow-hidden">
                     <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2 font-bold text-slate-700">
                       <BookOpen size={20} className="text-blue-500"/>
                       Nội dung bài đọc
                     </div>
                     <div className="p-6 text-slate-800 text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap text-justify font-medium">
                       {ex.text}
                     </div>
                  </div>
                )}
                
                <p className="mb-5 font-semibold text-lg text-gray-900 leading-snug">{ex.question}</p>
                
                {(ex.type === 'mcq' || ex.type === 'reading') && (
                  <div className="space-y-3">
                    {(ex.options || []).map(opt => {
                      const isCorrectChoice = opt.toString().trim().toLowerCase() === (ex.correct || '').toString().trim().toLowerCase();
                      const isUserChoice = (answers[idx] || '').toString().trim().toLowerCase() === opt.toString().trim().toLowerCase();
                      
                      let optionClass = `flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer select-none `;
                      if (isExerciseLocked && isCorrectChoice) optionClass += 'bg-green-100 border-green-500 shadow-inner';
                      else if (isExerciseLocked && isUserChoice && !isCorrectChoice) optionClass += 'bg-red-100 border-red-400';
                      else if (isExerciseLocked) optionClass += 'bg-gray-50 opacity-50 border-transparent cursor-not-allowed';
                      else if (isHinted && isCorrectChoice) optionClass += 'bg-green-100 border-green-500 shadow-inner ring-2 ring-green-200'; 
                      else optionClass += isUserChoice ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50';

                      return (
                        <label key={opt} className={optionClass}>
                          <input 
                            type="radio" name={`question-${idx}`} value={opt} checked={isUserChoice}
                            onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                            disabled={submitted && (score === dayData.requiredScore || isExerciseLocked)} 
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-base font-medium flex-1 ${(isExerciseLocked || isHinted) && isCorrectChoice ? 'text-green-800 font-bold' : isExerciseLocked && isUserChoice && !isCorrectChoice ? 'text-red-600 line-through' : 'text-gray-800'}`}>{opt}</span>
                          {(isExerciseLocked || isHinted) && isCorrectChoice && <CheckCircle2 size={24} className="text-green-600 shrink-0" />}
                          {isExerciseLocked && isUserChoice && !isCorrectChoice && <XCircle size={24} className="text-red-500 shrink-0" />}
                        </label>
                      )
                    })}
                  </div>
                )}
                {ex.type === 'writing' && (
                  <div>
                    <input 
                      type="text" 
                      className={`w-full border-2 p-4 rounded-xl outline-none font-medium text-lg transition-all ${isWritingError ? 'bg-white border-red-400 text-red-600 line-through shadow-sm' : isWritingCorrect || isHinted ? 'bg-green-50 border-green-500 text-green-800 ring-2 ring-green-200 shadow-inner' : 'bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`} 
                      value={answers[idx] || ''} 
                      onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })} 
                      disabled={submitted && (score === dayData.requiredScore || isExerciseLocked)} 
                      placeholder="Nhập câu trả lời..."
                    />
                    {isWritingError && <div className="mt-4 bg-green-100 border-2 border-green-400 text-green-900 p-4 rounded-xl flex items-center gap-3 font-bold text-base shadow-sm"><CheckCircle2 size={24} className="text-green-600"/> Đáp án đúng: {ex.correct}</div>}
                  </div>
                )}
              </div>
            )
          })}

          <div className="mt-10 sticky bottom-4 bg-white/95 backdrop-blur-md p-5 border-2 border-gray-200 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col md:flex-row justify-between items-center z-10 gap-5">
            <div className="flex-1 w-full text-center md:text-left">
              {submitted ? (
                <div className={`inline-flex items-center justify-center md:justify-start gap-3 px-5 py-3 rounded-xl font-black text-xl border-2 ${score === dayData.requiredScore ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                  {score === dayData.requiredScore ? <CheckCircle2 size={28}/> : <AlertOctagon size={28}/>}
                  Đúng: {score}/{dayData.requiredScore} câu
                  {score !== dayData.requiredScore && <span className="text-sm bg-red-200 text-red-800 px-3 py-1 rounded-full ml-2">Sai {exerciseFailCount}/{maxFails} lần</span>}
                </div>
              ) : (
                <button onClick={handleUseHint} className="text-yellow-700 bg-yellow-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-100 transition-colors border-2 border-yellow-300 shadow-sm w-full md:w-auto active:scale-95 text-lg">
                  <Lightbulb size={22}/> Dùng Gợi Ý ({inventory?.hints || 0})
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {isAdmin && !submitted && (
                <button onClick={() => {
                  if(dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
                  else onComplete(dayData.id, 0, 0);
                }} className="w-full sm:w-auto bg-gray-800 text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors flex items-center justify-center gap-2 text-lg">
                  <Wrench size={22} /> Auto-Pass
                </button>
              )}
              {isExerciseLocked ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {(inventory?.immortals > 0) && (
                    <button onClick={async () => {
                       const success = await consumeItem('immortals');
                       if (success) {
                          alert("🛡️ KÍCH HOẠT THẺ BẤT TỬ!\nBạn đã được miễn trừ hình phạt trừ điểm cho bài tập này.");
                          setExerciseFailCount(1); // Miễn phạt 
                          if (dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
                          else onComplete(dayData.id, vocabFailCount, 1);
                       }
                    }} className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-rose-600 text-white px-8 py-4 rounded-xl font-black shadow-[0_0_15px_rgba(225,29,72,0.5)] hover:opacity-90 animate-pulse flex items-center justify-center gap-2 text-lg">
                      <ShieldAlert size={24}/> Kích hoạt Thẻ Bất Tử ({inventory.immortals})
                    </button>
                  )}
                  <button onClick={() => {
                    if (dayData.vocabulary && dayData.vocabulary.length > 0) setStep('vocab-reveal');
                    else onComplete(dayData.id, vocabFailCount, exerciseFailCount);
                  }} className="w-full sm:w-auto bg-gray-800 text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-black transition-colors text-lg">
                    Chấp nhận phạt & Đi tiếp
                  </button>
                </div>
              ) : score !== dayData.requiredScore ? (
                <button onClick={handleSubmitExercises} className="w-full sm:w-auto bg-blue-600 text-white px-12 py-4 rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all text-xl tracking-wide">
                  NỘP BÀI
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {step === 'vocab-reveal' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-10 rounded-3xl border-2 border-green-200 shadow-xl text-center mt-10">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4 animate-bounce"><CheckCircle2 size={48} className="text-green-600"/></div>
          <h3 className="text-4xl font-black text-green-800 mb-3 tracking-tight">Hoàn thành xuất sắc!</h3>
          <p className="text-green-700 mb-8 font-medium text-lg">Bạn đã mở khóa bộ từ vựng của ngày hôm nay. Hãy ghi nhớ chúng nhé!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 text-left">
            {(dayData.vocabulary || []).map((v, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 flex flex-col hover:border-green-300 hover:shadow-md transition-all">
                <span className="font-black text-2xl text-gray-900 mb-1">{v.word}</span>
                <span className="text-gray-500 font-medium text-base">{v.meaning}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onComplete(dayData.id, vocabFailCount, exerciseFailCount)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-lg hover:shadow-green-500/30 hover:-translate-y-1">
            Nhận Thưởng & Kết Thúc Ngày {dayData.id}
          </button>
        </div>
      )}
    </div>
  );
}