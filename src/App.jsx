// src/App.jsx
import React, { useState, useEffect } from 'react';
import { courseData } from './data';
import Lesson from './Lesson';
import VocabularyReview from './VocabularyReview';
import { Flame, Lock, CheckCircle2, Calendar, Target, LogOut, Info, X, Gamepad2, BookOpen, Crown } from 'lucide-react';

import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "nguyenminhkhoi230407@gmail.com"; 
  const isAdmin = user && user.email === ADMIN_EMAIL;

  const [unlockedDay, setUnlockedDay] = useState(1);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isPlayingVocab, setIsPlayingVocab] = useState(false); 

  const [schedule, setSchedule] = useState(null);
  const [totalScore, setTotalScore] = useState(100);
  const [showSetup, setShowSetup] = useState(false);
  const [tempSchedule, setTempSchedule] = useState([]);
  const [streak, setStreak] = useState(0);
  const [calendarDay, setCalendarDay] = useState(1);
  const [lastCompletedDate, setLastCompletedDate] = useState(null); 
  
  const [showRules, setShowRules] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [notebook, setNotebook] = useState([]);
  
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState(0);
  const [lastPlayedWords, setLastPlayedWords] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser.uid);
      } else {
        setLoading(false); 
      }
    });
    return unsubscribe;
  }, []);

  const loadUserData = async (uid) => {
    setLoading(true);
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    const todayStr = new Date().toDateString();

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUnlockedDay(data.unlockedDay || 1);
      setTotalScore(data.score !== undefined ? data.score : 100);
      setStreak(data.streak || 0);
      setLastPlayedWords(data.lastPlayedWords || []);
      setNotebook(data.notebook || []);
      setLastCompletedDate(data.lastCompletedDate || null);
      
      if (data.lastGameDate === todayStr) {
        setDailyGamesPlayed(data.dailyGamesPlayed || 0);
      } else {
        setDailyGamesPlayed(0); 
      }

      if (data.schedule) {
        setSchedule(data.schedule);
        if (!isAdmin) handleMissedDays(data, userRef, todayStr);
      } else {
        setShowSetup(true); 
      }
      
      if(data.startDate){
         const startDate = new Date(data.startDate);
         const currentDate = new Date(todayStr);
         const diffTimeCalendar = currentDate - startDate;
         const diffDaysCalendar = Math.floor(diffTimeCalendar / (1000 * 60 * 60 * 24)) + 1;
         setCalendarDay(diffDaysCalendar);
      }
    } else {
      await setDoc(userRef, {
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        unlockedDay: 1,
        score: 100,
        streak: 1,
        startDate: todayStr,
        lastLogin: todayStr,
        dailyGamesPlayed: 0,
        lastGameDate: todayStr,
        lastPlayedWords: [],
        notebook: [],
        lastCompletedDate: null,
        createdAt: new Date()
      });
      setShowSetup(true);
      setCalendarDay(1);
      setStreak(1);
      setLastCompletedDate(null);
    }
    setLoading(false);
  };

  const handleMissedDays = async (data, userRef, todayStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = data.streak || 0;
    let newScore = data.score !== undefined ? data.score : 100;
    let needsUpdate = false;

    if (data.lastLogin) {
      let lastDate = new Date(data.lastLogin);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffTimeStreak = Math.abs(today - lastDate);
      const diffDaysStreak = Math.ceil(diffTimeStreak / (1000 * 60 * 60 * 24));

      if (diffDaysStreak === 1) {
        newStreak += 1;
        needsUpdate = true;
      } else if (diffDaysStreak > 1) {
        newStreak = 0;
        needsUpdate = true;
      }

      if (diffDaysStreak > 0) {
        let missedDays = 0;
        let checkDate = new Date(lastDate);
        checkDate.setDate(checkDate.getDate() + 1);

        while (checkDate < today) {
          if (data.schedule && data.schedule.includes(checkDate.getDay())) {
            missedDays++;
          }
          checkDate.setDate(checkDate.getDate() + 1);
        }

        if (missedDays > 0) {
          const penalty = missedDays * 5;
          newScore -= penalty;
          if (newScore < 0) newScore = 0;
          needsUpdate = true;
          alert(`CẢNH BÁO BỎ HỌC!\nBạn đã vắng mặt ${missedDays} buổi theo lịch trình.\nHệ thống trừ của bạn ${penalty} điểm tích lũy!`);
        }
      }
    }

    await updateDoc(userRef, {
      lastLogin: todayStr,
      ...(needsUpdate && { streak: newStreak, score: newScore })
    });

    setStreak(newStreak);
    setTotalScore(newScore);
  };

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  const saveSchedule = async () => {
    if (tempSchedule.length === 0) {
      alert("Bạn phải chọn ít nhất 1 ngày học trong tuần!");
      return;
    }
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { schedule: tempSchedule });
    setSchedule(tempSchedule);
    setShowSetup(false);
  };

  const toggleDay = (dayIndex) => {
    if (tempSchedule.includes(dayIndex)) {
      setTempSchedule(tempSchedule.filter(d => d !== dayIndex));
    } else {
      setTempSchedule([...tempSchedule, dayIndex]);
    }
  };

  const handleCompleteLesson = async (dayId, vocabFailCount, exerciseFailCount) => {
    let penalty = 0;
    let bonus = 0;
    let message = "Tổng kết bài học của bạn:";

    if (vocabFailCount > 3) { penalty += 2; message += `\n- Phạt 2 điểm: Sai từ vựng đầu giờ quá 3 lần.`; }
    
    // CƠ CHẾ MỚI: Bị khóa bài (Fail 3 lần) thì lập tức trừ 2 điểm
    if (exerciseFailCount >= 3) { 
      penalty += 2; 
      message += `\n- Phạt 2 điểm: Làm sai bài tập 3 lần.`; 
    }
    
    if (exerciseFailCount === 0) {
      bonus = 5;
      message += `\n⭐ THƯỞNG NÓNG: +5 điểm vì làm đúng 100% bài tập ngay lần đầu tiên!`;
    }

    let newScore = totalScore - penalty + bonus;
    if (newScore < 0) newScore = 0;

    const nextDay = (dayId === unlockedDay && dayId < 48) ? dayId + 1 : unlockedDay;
    const todayStr = new Date().toDateString();

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      score: newScore,
      unlockedDay: nextDay,
      lastCompletedDate: todayStr
    });

    setTotalScore(newScore);
    setUnlockedDay(nextDay);
    setLastCompletedDate(todayStr);
    setActiveLesson(null);

    if (penalty === 0 && bonus === 0) {
      message = "Tuyệt vời! Bạn đã hoàn thành bài học mà không bị trừ điểm nào.";
    }
    alert(message);
  };

  const handleCheat = async () => {
    if (isAdmin) {
      alert("Admin thoát tự do, không bị trừ điểm cheat!");
      setActiveLesson(null);
      return;
    }
    let newScore = totalScore - 5;
    if (newScore < 0) newScore = 0;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { score: newScore });
    setTotalScore(newScore);
    setActiveLesson(null); 
  };

  const getLearnedVocab = () => {
    let vocabPool = [];
    courseData.forEach(day => {
      if (day.id < unlockedDay && day.vocabulary && day.vocabulary.length > 0) {
        vocabPool = [...vocabPool, ...day.vocabulary];
      }
    });
    return vocabPool;
  };

  const handleGameComplete = async (isWin, playedWords) => {
    const todayStr = new Date().toDateString();
    let newScore = totalScore;
    let newDailyGames = dailyGamesPlayed + 1;

    if (isWin) {
      newScore += 1;
    }

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { 
      score: newScore,
      dailyGamesPlayed: newDailyGames,
      lastGameDate: todayStr,
      lastPlayedWords: playedWords
    });

    setTotalScore(newScore);
    setDailyGamesPlayed(newDailyGames);
    setLastPlayedWords(playedWords);
    setIsPlayingVocab(false); 
  };

  const openNotebook = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setNotebook(docSnap.data().notebook || []);
      }
    }
    setShowNotebook(true);
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Đang tải dữ liệu...</div>;
  
  if (!user) return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
          <h1 className="text-3xl font-black mb-2 text-indigo-700">Tracker 48 Ngày</h1>
          <p className="text-gray-500 mb-8">Nền tảng học Tiếng Anh cá nhân hóa.</p>
          <button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2">Đăng nhập bằng Google</button>
        </div>
      </div>
  );

  if (showSetup) return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Ký cam kết kỷ luật ✍️</h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[{ id: 1, name: 'Thứ 2' }, { id: 2, name: 'Thứ 3' }, { id: 3, name: 'Thứ 4' }, { id: 4, name: 'Thứ 5' }, { id: 5, name: 'Thứ 6' }, { id: 6, name: 'Thứ 7' }, { id: 0, name: 'Chủ Nhật' }].map(d => (
              <button key={d.id} onClick={() => toggleDay(d.id)} className={`p-3 rounded border-2 font-bold ${tempSchedule.includes(d.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600'}`}>{d.name}</button>
            ))}
          </div>
          <button onClick={saveSchedule} className="w-full bg-black text-white py-3 rounded-lg font-bold">Xác nhận</button>
        </div>
      </div>
  );

  if (activeLesson) {
    const dayData = courseData.find(d => d.id === activeLesson);
    const prevDayData = activeLesson > 1 ? courseData.find(d => d.id === activeLesson - 1) : null;
    return (
      <Lesson 
        dayData={dayData} 
        prevDayData={prevDayData} 
        onComplete={handleCompleteLesson} 
        onBack={() => setActiveLesson(null)} 
        onCheat={handleCheat} 
        isAdmin={isAdmin}
      />
    );
  }

  if (isPlayingVocab) {
    const learnedVocab = getLearnedVocab();
    return <VocabularyReview learnedVocab={learnedVocab} lastPlayedWords={lastPlayedWords} onBack={() => setIsPlayingVocab(false)} onCompleteGame={handleGameComplete} />;
  }

  const currentDayOfWeek = new Date().getDay();
  const isScheduledToday = schedule ? schedule.includes(currentDayOfWeek) : false;

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 gap-6 relative overflow-hidden">
          <div className="flex-1 w-full z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 break-words tracking-tight flex items-center gap-2">
              Chào {user.displayName} 👋
              {isAdmin && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md border border-purple-200 flex items-center gap-1"><Crown size={14}/> Admin Mode</span>}
            </h1>
            <div className="flex items-center gap-2 mt-3">
              {isAdmin ? (
                <>
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span className="text-gray-500 font-medium text-sm sm:text-base">Mọi giới hạn khóa học đã được tắt.</span>
                </>
              ) : isScheduledToday ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Hôm nay có lịch học. Cố lên!</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="text-gray-500 font-medium text-sm sm:text-base">Hôm nay không có lịch học. Nghỉ ngơi nhé.</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end z-10">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => (isAdmin || dailyGamesPlayed < 3) ? setIsPlayingVocab(true) : alert("Bạn đã hết lượt chơi!")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm ${isAdmin || dailyGamesPlayed < 3 ? 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                <Gamepad2 size={18} /> 
                <span className="text-sm sm:text-base">Ôn tập {isAdmin ? '(Vô hạn)' : `(${3 - dailyGamesPlayed}/3)`}</span>
              </button>

              <button 
                onClick={openNotebook}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5"
              >
                <BookOpen size={18} />
                <span className="hidden sm:inline text-sm sm:text-base">Sổ tay</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 px-4 py-2.5 rounded-xl font-bold border border-orange-200 shadow-inner">
                <Flame size={18} className="text-orange-500" /> 
                <span className="text-sm sm:text-base">{streak}</span>
              </div>
              
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2.5 rounded-xl font-bold border border-blue-200 shadow-inner">
                <Target size={18} className="text-blue-500" /> 
                <span className="text-sm sm:text-base">{totalScore}/100</span>
                <button 
                  onClick={() => setShowRules(true)} 
                  className="ml-1 text-blue-400 hover:text-blue-700 transition-transform hover:scale-110"
                >
                  <Info size={18} />
                </button>
              </div>
            </div>

            <button 
              onClick={logout} 
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 ml-auto sm:ml-0" 
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {courseData.map((day) => {
            const todayStr = new Date().toDateString();
            
            const isCompleted = day.id < unlockedDay;
            const isAcademicallyNext = day.id === unlockedDay;
            const hasNotStudiedToday = lastCompletedDate !== todayStr;
            
            const isUnlocked = isAdmin || (isAcademicallyNext && isScheduledToday && hasNotStudiedToday);
            
            const isWaitingForTomorrow = !isAdmin && isAcademicallyNext && (!isScheduledToday || !hasNotStudiedToday);
            
            const isTest = day.isTest;

            return (
              <button key={day.id} disabled={!isUnlocked} onClick={() => setActiveLesson(day.id)} className={`relative p-4 h-32 rounded-xl flex flex-col justify-center items-center border-2 transition-all ${isCompleted && !isAdmin ? 'bg-green-50 border-green-500 text-green-700' : isWaitingForTomorrow ? 'bg-orange-50 border-orange-300 text-orange-600 cursor-not-allowed opacity-80' : !isUnlocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : isTest ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md hover:scale-105 animate-pulse' : 'bg-white border-blue-500 text-blue-700 shadow-md hover:scale-105 animate-pulse'}`}>
                {!isUnlocked && !isCompleted && !isWaitingForTomorrow && <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-300" />}
                {!isScheduledToday && isAcademicallyNext && !isCompleted && !isWaitingForTomorrow && !isAdmin && <Calendar className="absolute top-2 right-2 w-4 h-4 text-orange-400" />}
                {isWaitingForTomorrow && <Calendar className="absolute top-2 right-2 w-5 h-5 text-orange-400" title="Đã hết lượt học hôm nay / Chưa đến ngày" />}
                {isCompleted && !isAdmin && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />}
                <span className="text-sm font-semibold opacity-80">{isTest ? 'MAJOR TEST' : 'DAY'}</span>
                <span className="text-3xl font-black">{day.id}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {showNotebook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold flex items-center gap-2"><BookOpen size={24} /> Sổ Tay Từ Vựng Cá Nhân</h3>
              <button onClick={() => setShowNotebook(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              {notebook.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50 text-emerald-600" />
                  <p className="text-lg font-bold mb-2">Sổ tay của bạn hiện đang trống.</p>
                  <p className="text-sm">Những từ bạn làm sai ở trạm kiểm tra và bấm "Thêm vào sổ tay" sẽ được lưu trữ tại đây để dễ dàng ôn tập.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notebook.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col">
                      <span className="font-bold text-lg text-emerald-800">{item.word}</span>
                      <span className="text-gray-600 font-medium mb-2">{item.meaning}</span>
                      <span className="text-xs text-gray-400 mt-auto text-right border-t border-dashed pt-2">Đã thêm: {item.addedAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRules && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold flex items-center gap-2"><Target size={24} /> Sổ Tay Kỷ Luật</h3>
              <button onClick={() => setShowRules(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">🎁 Thưởng (Cà rốt)</h4>
                <ul className="text-sm text-green-800 list-disc list-inside space-y-2">
                  <li><span className="font-bold">+5 điểm:</span> Làm đúng 100% bài tập lần đầu.</li>
                  <li><span className="font-bold">+1 điểm:</span> Thắng mini-game ôn tập từ vựng. Tối đa 3 lượt/ngày.</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">⚔️ Phạt (Cây gậy)</h4>
                <ul className="text-sm text-red-800 list-disc list-inside space-y-2">
                  <li><span className="font-bold">-5 điểm:</span> Vắng mặt vào ngày có lịch học, hoặc có hành vi gian lận.</li>
                  <li><span className="font-bold">-2 điểm:</span> Gõ sai từ vựng đầu giờ quá 3 lần, hoặc nộp sai bài tập 3 lần (buộc khóa bài).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}