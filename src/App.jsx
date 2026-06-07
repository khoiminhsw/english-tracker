// src/App.jsx
import React, { useState, useEffect } from 'react';
import { courseData } from './data';
import Lesson from './Lesson';
import VocabularyReview from './VocabularyReview';
import { Flame, Lock, CheckCircle2, Calendar, Target, LogOut, Info, X, Gamepad2, BookOpen, Crown, Medal, Activity, Award, Star, Coins, Store, Shield, Ticket, Lightbulb, PackageOpen } from 'lucide-react';

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
  const [totalScore, setTotalScore] = useState(100); // 🎓 ĐIỂM HỌC TẬP (Khởi điểm 100)
  const [coins, setCoins] = useState(0); // 🪙 TIỀN TỆ MUA SẮM (Khởi điểm 0)
  const [inventory, setInventory] = useState({ shields: 0, skips: 0, hints: 0, tickets: 0 });
  
  const [showSetup, setShowSetup] = useState(false);
  const [tempSchedule, setTempSchedule] = useState([]);
  const [streak, setStreak] = useState(0);
  const [calendarDay, setCalendarDay] = useState(1);
  const [lastCompletedDate, setLastCompletedDate] = useState(null); 
  const [startDateStr, setStartDateStr] = useState(null);
  
  const [showRules, setShowRules] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShop, setShowShop] = useState(false); 
  const [notebook, setNotebook] = useState([]);
  
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState(0);
  const [lastPlayedWords, setLastPlayedWords] = useState([]);
  const [activityLog, setActivityLog] = useState([]); 
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0); 
  const [claimedAchievements, setClaimedAchievements] = useState([]); 
  const [achievementPopup, setAchievementPopup] = useState(null); 

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
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      const todayStr = new Date().toDateString();

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUnlockedDay(data.unlockedDay || 1);
        setTotalScore(data.score !== undefined ? data.score : 100);
        setCoins(data.coins !== undefined ? data.coins : 0); // Lấy xu lưu trên mây
        
        setInventory(data.inventory || { shields: 0, skips: 0, hints: 0, tickets: 0 });
        setClaimedAchievements(data.claimedAchievements || []);
        setStreak(data.streak || 0);
        setLastPlayedWords(data.lastPlayedWords || []);
        setNotebook(data.notebook || []);
        setLastCompletedDate(data.lastCompletedDate || null);
        setActivityLog(data.activityLog || []);
        setTotalGamesPlayed(data.totalGamesPlayed || 0);
        setStartDateStr(data.startDate || todayStr);
        
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
           const diffTimeCalendar = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
           setCalendarDay(diffTimeCalendar); 
        }
      } else {
        const newProfile = {
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
          unlockedDay: 1,
          score: 100, // New user có 100 điểm
          coins: 0,   // Nhưng vốn là 0 xu
          inventory: { shields: 0, skips: 0, hints: 0, tickets: 0 },
          claimedAchievements: [],
          streak: 1,
          startDate: todayStr,
          lastLogin: todayStr,
          dailyGamesPlayed: 0,
          lastGameDate: todayStr,
          lastPlayedWords: [],
          notebook: [],
          activityLog: [todayStr],
          totalGamesPlayed: 0,
          lastCompletedDate: null,
          createdAt: new Date()
        };
        await setDoc(userRef, newProfile);
        setTotalScore(100);
        setCoins(0);
        setInventory({ shields: 0, skips: 0, hints: 0, tickets: 0 });
        setStartDateStr(todayStr);
        setActivityLog([todayStr]);
        setShowSetup(true);
        setCalendarDay(1);
        setStreak(1);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleMissedDays = async (data, userRef, todayStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = data.streak || 0;
    let newScore = data.score !== undefined ? data.score : 100;
    let newCoins = data.coins !== undefined ? data.coins : 0;
    let currentInventory = data.inventory || { shields: 0, skips: 0, hints: 0, tickets: 0 };
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
        let missedDaysCount = 0;
        let checkDate = new Date(lastDate);
        checkDate.setDate(checkDate.getDate() + 1);

        while (checkDate < today) {
          if (data.schedule && data.schedule.includes(checkDate.getDay())) {
            missedDaysCount++;
          }
          checkDate.setDate(checkDate.getDate() + 1);
        }

        if (missedDaysCount > 0) {
          // XỬ LÝ STREAK SHIELD
          if (currentInventory.shields > 0) {
            currentInventory.shields -= 1;
            alert(`🛡️ Streak Shield Tự Động Kích Hoạt!\nChuỗi ngày học rực lửa của bạn đã được bảo vệ, NHƯNG Điểm và Coin vẫn bị trừ vì tội lười biếng.`);
            needsUpdate = true;
          } else {
            newStreak = 0; // Gãy chuỗi
            needsUpdate = true;
          }

          const pointPenalty = missedDaysCount * 5;
          const coinPenalty = pointPenalty * 2; // COIN PHẠT NHÂN ĐÔI
          
          newScore -= pointPenalty;
          newCoins -= coinPenalty;
          
          if (newScore < 0) newScore = 0;
          if (newCoins < 0) newCoins = 0;
          
          alert(`CẢNH BÁO BỎ HỌC!\nBạn đã vắng mặt ${missedDaysCount} buổi.\nPhạt ${pointPenalty} Điểm Kỷ Luật và ${coinPenalty} Coins!`);
          needsUpdate = true;

        } else {
          newStreak = 0; 
          needsUpdate = true;
        }
      }
    }

    let newActivityLog = data.activityLog || [];
    if (!newActivityLog.includes(todayStr)) {
      newActivityLog = [...newActivityLog, todayStr];
      needsUpdate = true;
    }

    await updateDoc(userRef, {
      lastLogin: todayStr,
      activityLog: newActivityLog,
      ...(needsUpdate && { streak: newStreak, score: newScore, coins: newCoins, inventory: currentInventory })
    });

    setActivityLog(newActivityLog);
    setStreak(newStreak);
    setTotalScore(newScore);
    setCoins(newCoins);
    setInventory(currentInventory);
  };

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  const saveSchedule = async () => {
    if (tempSchedule.length === 0) return alert("Bạn phải chọn ít nhất 1 ngày học trong tuần!");
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { schedule: tempSchedule });
    setSchedule(tempSchedule);
    setShowSetup(false);
  };

  const toggleDay = (dayIndex) => {
    if (tempSchedule.includes(dayIndex)) setTempSchedule(tempSchedule.filter(d => d !== dayIndex));
    else setTempSchedule([...tempSchedule, dayIndex]);
  };

  const consumeItem = async (itemName) => {
    if (inventory[itemName] > 0) {
      const newInv = { ...inventory, [itemName]: inventory[itemName] - 1 };
      setInventory(newInv);
      await updateDoc(doc(db, 'users', user.uid), { inventory: newInv });
      return true;
    }
    return false;
  };

  const handleCompleteLesson = async (dayId, vocabFailCount, exerciseFailCount) => {
    let pointPenalty = 0;
    let pointBonus = 0;
    let message = "Tổng kết bài học của bạn:";

    if (vocabFailCount > 3) { pointPenalty += 2; message += `\n- Phạt 2 Điểm & 4 Coins: Sai từ vựng đầu giờ.`; }
    if (exerciseFailCount >= 3) { pointPenalty += 2; message += `\n- Phạt 2 Điểm & 4 Coins: Sai bài tập.`; }
    if (exerciseFailCount === 0) { pointBonus += 5; message += `\n⭐ THƯỞNG NÓNG: +5 Điểm & +10 Coins vì làm đúng 100% lần đầu!`; }

    let newScore = totalScore - pointPenalty + pointBonus;
    let newCoins = coins - (pointPenalty * 2) + (pointBonus * 2); // NHÂN ĐÔI COIN LÀM TIỀN TỆ
    
    if (newScore < 0) newScore = 0;
    if (newCoins < 0) newCoins = 0;

    const nextDay = (dayId === unlockedDay && dayId < 48) ? dayId + 1 : unlockedDay;
    const todayStr = new Date().toDateString();
    const newActivityLog = activityLog.includes(todayStr) ? activityLog : [...activityLog, todayStr];

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      score: newScore,
      coins: newCoins,
      unlockedDay: nextDay,
      lastCompletedDate: todayStr,
      activityLog: newActivityLog
    });

    setTotalScore(newScore);
    setCoins(newCoins);
    setUnlockedDay(nextDay);
    setLastCompletedDate(todayStr);
    setActivityLog(newActivityLog);
    setActiveLesson(null);

    if (pointPenalty === 0 && pointBonus === 0) message = "Tuyệt vời! Bạn đã hoàn thành bài học mà không bị phạt gì cả.";
    alert(message);
  };

  const handleGameComplete = async (isWin, playedWords) => {
    const todayStr = new Date().toDateString();
    let newScore = totalScore;
    let newCoins = coins;
    let newDailyGames = dailyGamesPlayed + 1;
    let newTotalGames = totalGamesPlayed + 1;

    if (isWin) {
      newScore += 1;
      newCoins += 2;
    }

    const newActivityLog = activityLog.includes(todayStr) ? activityLog : [...activityLog, todayStr];

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { 
      score: newScore,
      coins: newCoins,
      dailyGamesPlayed: newDailyGames,
      totalGamesPlayed: newTotalGames,
      lastGameDate: todayStr,
      lastPlayedWords: playedWords,
      activityLog: newActivityLog
    });

    setTotalScore(newScore);
    setCoins(newCoins);
    setDailyGamesPlayed(newDailyGames);
    setTotalGamesPlayed(newTotalGames);
    setLastPlayedWords(playedWords);
    setActivityLog(newActivityLog);
    setIsPlayingVocab(false); 
    
    if (isWin) alert("🎮 Chúc mừng! Bạn nhận được +1 Điểm và +2 Coins.");
  };

  const getLearnedVocab = () => {
    let vocabPool = [];
    courseData.forEach(day => {
      if (day.id < unlockedDay && day.vocabulary && day.vocabulary.length > 0) vocabPool = [...vocabPool, ...day.vocabulary];
    });
    return vocabPool;
  };

  const totalLearnedWords = getLearnedVocab().length;
  const estimatedExercises = (unlockedDay - 1) * 5; 

  const achievementsList = [
    { id: "streak_7", title: "Khởi động", desc: "Học liên tục 7 ngày", achieved: streak >= 7, rewardCoins: 20, icon: "🔥", color: "text-orange-500", bg: "bg-orange-100" },
    { id: "streak_30", title: "Kỷ luật thép", desc: "Học liên tục 30 ngày", achieved: streak >= 30, rewardCoins: 100, icon: "🔥", color: "text-red-500", bg: "bg-red-100" },
    { id: "streak_100", title: "Kỷ luật kim cương", desc: "Học liên tục 100 ngày", achieved: streak >= 100, rewardCoins: 1000, icon: "💎", color: "text-cyan-500", bg: "bg-cyan-100" },
    
    { id: "exercises_100", title: "Chăm chỉ", desc: "Hoàn thành 100 bài tập", achieved: estimatedExercises >= 100, rewardCoins: 40, icon: "📝", color: "text-blue-500", bg: "bg-blue-100" },
    { id: "exercises_250", title: "Học giả", desc: "Hoàn thành 250 bài tập", achieved: estimatedExercises >= 250, rewardCoins: 400, icon: "🎓", color: "text-blue-600", bg: "bg-blue-200" },
    
    { id: "words_100", title: "Tân binh", desc: "Nhớ 100 từ vựng", achieved: totalLearnedWords >= 100, rewardCoins: 30, icon: "🧠", color: "text-purple-500", bg: "bg-purple-100" },
    { id: "words_500", title: "Từ điển sống", desc: "Nhớ 500 từ vựng", achieved: totalLearnedWords >= 500, rewardCoins: 150, icon: "📚", color: "text-indigo-500", bg: "bg-indigo-100" },
    { id: "words_1000", title: "Chuyên gia", desc: "Nhớ 1000 từ vựng", achieved: totalLearnedWords >= 1000, rewardCoins: 600, icon: "👑", color: "text-fuchsia-500", bg: "bg-fuchsia-100" },
    
    { id: "games_10", title: "Game Thủ", desc: "Chơi mini-game 10 lần", achieved: totalGamesPlayed >= 10, rewardCoins: 20, icon: "🎮", color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: "games_50", title: "Kẻ hủy diệt", desc: "Chơi mini-game 50 lần", achieved: totalGamesPlayed >= 50, rewardCoins: 300, icon: "⚔️", color: "text-teal-600", bg: "bg-teal-100" },
  ];

  useEffect(() => {
    if (!user || loading) return;
    const checkAchievements = async () => {
      let newCoins = coins;
      let newClaimed = [...claimedAchievements];
      let hasNew = false;
      let popupData = null;

      for (let ach of achievementsList) {
        if (ach.achieved && !newClaimed.includes(ach.id)) {
          newClaimed.push(ach.id);
          newCoins += ach.rewardCoins;
          hasNew = true;
          popupData = ach; 
        }
      }

      if (hasNew) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { coins: newCoins, claimedAchievements: newClaimed });
        setCoins(newCoins);
        setClaimedAchievements(newClaimed);
        setAchievementPopup(popupData);
      }
    };
    checkAchievements();
  }, [streak, totalLearnedWords, totalGamesPlayed, estimatedExercises]);

  const buyItem = async (itemName, cost, key) => {
    if (coins < cost) return alert("Bạn không đủ Coins!");
    const confirmBuy = window.confirm(`Xác nhận dùng ${cost} Coins để mua ${itemName}?`);
    if (!confirmBuy) return;

    let newCoins = coins - cost;
    let newScore = totalScore;
    const newInv = { ...inventory };

    if (key === 'box') {
      const rand = Math.random();
      let prize = "";
      if (rand < 0.25) { newInv.skips += 1; prize = "🎟️ 1 Thẻ Skip"; }
      else if (rand < 0.5) { newInv.hints += 1; prize = "💡 1 Gợi ý (Hint)"; }
      else if (rand < 0.75) { newInv.tickets += 1; prize = "🎟️ 1 Vé Mini-game"; }
      else { newScore += 5; prize = "🎯 TẶNG HOÀN LẠI 5 ĐIỂM HỌC LỰC!"; } 
      alert(`🎁 BẠN MỞ HỘP VÀ NHẬN ĐƯỢC: ${prize}`);
    } else {
      newInv[key] += 1;
      alert(`✅ Mua thành công: ${itemName}`);
    }

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: newCoins, score: newScore, inventory: newInv });
    setCoins(newCoins);
    setTotalScore(newScore);
    setInventory(newInv);
  };

  const renderHeatMap = () => {
    const squares = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDateObj = new Date(startDateStr);
    startDateObj.setHours(0, 0, 0, 0);
    const totalDaysSinceStart = Math.floor((today - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
    const missedDays = Math.max(0, totalDaysSinceStart - activityLog.length);

    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      
      let statusClass = "bg-gray-100 border-gray-200"; 
      if (activityLog.includes(dateStr)) statusClass = "bg-emerald-400 border-emerald-500 shadow-sm"; 
      else if (d < startDateObj) statusClass = "bg-gray-50 border-gray-100 opacity-50"; 
      else if (d < today) statusClass = "bg-red-50 border-red-100"; 

      squares.push(<div key={i} title={dateStr} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border ${statusClass} transition-all hover:scale-110`}></div>);
    }
    return { squares, missedDays, activeDays: activityLog.length };
  };

  const handleCheat = async () => {
    if (isAdmin) return setActiveLesson(null);
    let newScore = totalScore - 5;
    let newCoins = coins - 10;
    if (newScore < 0) newScore = 0;
    if (newCoins < 0) newCoins = 0;
    await updateDoc(doc(db, 'users', user?.uid), { score: newScore, coins: newCoins });
    setTotalScore(newScore);
    setCoins(newCoins);
    setActiveLesson(null); 
  };

  const openNotebook = async () => {
    if (user) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setNotebook(docSnap.data().notebook || []);
    }
    setShowNotebook(true);
  };

  // ==========================================
  // RENDER UI CHÍNH
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
    return <Lesson dayData={dayData} prevDayData={prevDayData} onComplete={handleCompleteLesson} onBack={() => setActiveLesson(null)} onCheat={handleCheat} isAdmin={isAdmin} inventory={inventory} consumeItem={consumeItem} />;
  }

  if (isPlayingVocab) {
    const learnedVocab = getLearnedVocab();
    return <VocabularyReview learnedVocab={learnedVocab} lastPlayedWords={lastPlayedWords} onBack={() => setIsPlayingVocab(false)} onCompleteGame={handleGameComplete} dailyGamesPlayed={dailyGamesPlayed} isAdmin={isAdmin} />;
  }

  const currentDayOfWeek = new Date().getDay();
  const isScheduledToday = schedule ? schedule.includes(currentDayOfWeek) : false;
  const heatmapData = renderHeatMap();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 relative">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 gap-6 relative overflow-hidden">
          <div className="flex-1 w-full z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 break-words tracking-tight flex items-center gap-2">
              Chào {user.displayName} 👋
              {isAdmin && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md border border-purple-200 flex items-center gap-1"><Crown size={14}/> Admin</span>}
            </h1>
            <div className="flex items-center gap-2 mt-3">
              {isAdmin ? (
                <><span className="w-3 h-3 rounded-full bg-purple-500"></span><span className="text-gray-500 font-medium text-sm sm:text-base">Đã tắt mọi giới hạn khóa học.</span></>
              ) : isScheduledToday ? (
                <><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span><span className="text-gray-600 font-medium text-sm sm:text-base">Hôm nay có lịch học. Cố lên!</span></>
              ) : (
                <><span className="w-3 h-3 rounded-full bg-red-400"></span><span className="text-gray-500 font-medium text-sm sm:text-base">Hôm nay không có lịch học. Nghỉ ngơi nhé.</span></>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end z-10">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowShop(true)} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg">
                <Store size={18} />
                <span className="hidden sm:inline text-sm sm:text-base">Cửa hàng</span>
              </button>

              <button onClick={() => setShowProfile(true)} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 transition-all shadow-sm hover:bg-gray-50 hover:-translate-y-0.5" title="Bảng Thành Tựu">
                <Medal size={18} className="text-amber-500"/>
              </button>

              <button 
                onClick={() => {
                  if (isAdmin || dailyGamesPlayed < 3) setIsPlayingVocab(true);
                  else if (inventory.tickets > 0) {
                    if (window.confirm("Bạn đã hết lượt. Dùng 1 Vé Mini-game để chơi tiếp?")) {
                      consumeItem('tickets').then(() => setIsPlayingVocab(true));
                    }
                  } else alert("Bạn đã hết lượt chơi và không có Vé Mini-game!");
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm ${isAdmin || dailyGamesPlayed < 3 || inventory.tickets > 0 ? 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                <Gamepad2 size={18} /> 
              </button>

              <button onClick={openNotebook} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5">
                <BookOpen size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 px-4 py-2.5 rounded-xl font-bold border border-orange-200 shadow-inner" title="Chuỗi ngày học liên tục">
                <Flame size={18} className="text-orange-500" /> 
                <span className="text-sm sm:text-base">{streak}</span>
              </div>
              
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-600 px-4 py-2.5 rounded-xl font-black border border-yellow-200 shadow-inner" title="Coins (Dùng để mua sắm)">
                <Coins size={18} className="text-yellow-500" /> 
                <span className="text-sm sm:text-base">{coins}</span>
              </div>
              
              <div className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2.5 rounded-xl font-bold border border-blue-200 shadow-inner" title="Điểm kỷ luật (Học lực)">
                <Target size={18} className="text-blue-500" /> 
                <span className="text-sm sm:text-base">{totalScore}</span>
                <button onClick={() => setShowRules(true)} className="ml-1 text-blue-400 hover:text-blue-700 transition-transform hover:scale-110"><Info size={18} /></button>
              </div>
            </div>

            <button onClick={logout} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-auto sm:ml-0"><LogOut size={20} /></button>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity size={20} className="text-emerald-500"/> Hoạt động 35 ngày qua</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start mb-6">
            {heatmapData.squares}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100 border-t pt-4">
            <div><p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Đã học</p><p className="text-2xl font-black text-emerald-600">{heatmapData.activeDays} <span className="text-sm font-semibold text-gray-400">ngày</span></p></div>
            <div><p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Chuỗi Streak</p><p className="text-2xl font-black text-orange-500">{streak} <span className="text-sm font-semibold text-gray-400">ngày</span></p></div>
            <div><p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Bỏ lỡ</p><p className="text-2xl font-black text-red-500">{heatmapData.missedDays} <span className="text-sm font-semibold text-gray-400">ngày</span></p></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {courseData.map((day) => {
            const todayStr = new Date().toDateString();
            const isCompleted = day.id < unlockedDay;
            const isAcademicallyNext = day.id === unlockedDay;
            const hasNotStudiedToday = lastCompletedDate !== todayStr;
            const isUnlocked = isAdmin || (isAcademicallyNext && isScheduledToday && hasNotStudiedToday);
            const isWaitingForTomorrow = !isAdmin && isAcademicallyNext && (!isScheduledToday || !hasNotStudiedToday);

            return (
              <button key={day.id} disabled={!isUnlocked} onClick={() => setActiveLesson(day.id)} className={`relative p-4 h-32 rounded-xl flex flex-col justify-center items-center border-2 transition-all ${isCompleted && !isAdmin ? 'bg-green-50 border-green-500 text-green-700' : isWaitingForTomorrow ? 'bg-orange-50 border-orange-300 text-orange-600 cursor-not-allowed opacity-80' : !isUnlocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : day.isTest ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md hover:scale-105 animate-pulse' : 'bg-white border-blue-500 text-blue-700 shadow-md hover:scale-105 animate-pulse'}`}>
                {!isUnlocked && !isCompleted && !isWaitingForTomorrow && <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-300" />}
                {!isScheduledToday && isAcademicallyNext && !isCompleted && !isWaitingForTomorrow && !isAdmin && <Calendar className="absolute top-2 right-2 w-4 h-4 text-orange-400" />}
                {isWaitingForTomorrow && <Calendar className="absolute top-2 right-2 w-5 h-5 text-orange-400" title="Đã hết lượt học hôm nay / Chưa đến ngày" />}
                {isCompleted && !isAdmin && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />}
                <span className="text-sm font-semibold opacity-80">{day.isTest ? 'MAJOR TEST' : 'DAY'}</span>
                <span className="text-3xl font-black">{day.id}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {achievementPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-500">
            <div className="text-6xl mb-4 animate-bounce">{achievementPopup.icon}</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Huy hiệu mới!</h2>
            <h3 className={`text-xl font-bold mb-4 ${achievementPopup.color}`}>{achievementPopup.title}</h3>
            <p className="text-gray-600 mb-6 font-medium">{achievementPopup.desc}</p>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-600 font-bold mb-1">Phần thưởng</p>
              <p className="text-2xl font-black text-yellow-500 flex items-center justify-center gap-2"><Coins size={24}/> +{achievementPopup.rewardCoins} Coins</p>
            </div>
            <button onClick={() => setAchievementPopup(null)} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">Tuyệt vời!</button>
          </div>
        </div>
      )}

      {showShop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-2"><Store size={28} /> Cửa Hàng Vật Phẩm</h3>
                <p className="font-medium text-yellow-100 flex items-center gap-2 mt-1">Sức mua hiện tại: <span className="bg-black/20 px-2 py-1 rounded flex items-center gap-1"><Coins size={16}/> {coins} Coins</span></p>
              </div>
              <button onClick={() => setShowShop(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center"><Shield size={24}/></div>
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm">Đang có: {inventory.shields}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Streak Shield</h4>
                  <p className="text-sm text-gray-500 font-medium mb-4">Bảo vệ chuỗi ngày nếu bạn lỡ quên học.</p>
                </div>
                <button onClick={() => buyItem("Streak Shield", 50, 'shields')} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 50 Coins</button>
              </div>

              <div className="border-2 border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-xl flex items-center justify-center"><Ticket size={24}/></div>
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm">Đang có: {inventory.skips}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Thẻ Skip Từ Vựng</h4>
                  <p className="text-sm text-gray-500 font-medium mb-4">Bỏ qua trạm kiểm tra từ vựng đầu giờ để học ngay bài mới.</p>
                </div>
                <button onClick={() => buyItem("Thẻ Skip", 35, 'skips')} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 35 Coins</button>
              </div>

              <div className="border-2 border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:border-yellow-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-xl flex items-center justify-center"><Lightbulb size={24}/></div>
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm">Đang có: {inventory.hints}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Gợi ý (Hint)</h4>
                  <p className="text-sm text-gray-500 font-medium mb-4">Hệ thống sẽ điền giúp bạn 1 đáp án đúng khi đang làm bài.</p>
                </div>
                <button onClick={() => buyItem("Hint", 20, 'hints')} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 20 Coins</button>
              </div>

              <div className="border-2 border-purple-200 bg-purple-50/50 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-400 transition-colors">
                <div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-3"><PackageOpen size={24}/></div>
                  <h4 className="text-xl font-bold text-purple-900 mb-1">Hộp Quà Bí Ẩn</h4>
                  <p className="text-sm text-purple-700 font-medium mb-4">Mở ngẫu nhiên: Thẻ Skip, Hint, Vé Mini-game hoặc Tặng hoàn lại 5 Điểm học lực!</p>
                </div>
                <button onClick={() => buyItem("Hộp Quà Bí Ẩn", 40, 'box')} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 40 Coins</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500"><Award size={24}/></div>
                <div>
                  <h3 className="text-xl font-black text-gray-800">Bảng Thành Tựu</h3>
                  <p className="text-sm text-gray-500 font-medium">Bộ sưu tập huy hiệu của {user.displayName}</p>
                </div>
              </div>
              <button onClick={() => setShowProfile(false)} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {achievementsList.map((ach, idx) => (
                    <div key={idx} className={`relative p-4 rounded-xl border-2 transition-all ${ach.achieved ? `border-transparent ${ach.bg} shadow-sm` : 'border-gray-200 bg-gray-50 opacity-60 grayscale'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3 bg-white shadow-sm ${ach.achieved ? ach.color : 'text-gray-400'}`}>{ach.icon}</div>
                      <h5 className={`font-bold ${ach.achieved ? 'text-gray-800' : 'text-gray-500'}`}>{ach.title}</h5>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{ach.desc} <span className="text-yellow-600 font-bold block mt-1">(+{ach.rewardCoins} Coins)</span></p>
                      {ach.achieved && <div className="absolute top-3 right-3 text-amber-400"><CheckCircle2 size={18}/></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotebook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold flex items-center gap-2"><BookOpen size={24} /> Sổ Tay Từ Vựng Cá Nhân</h3>
              <button onClick={() => setShowNotebook(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              {notebook.length === 0 ? (
                <div className="text-center py-10 text-gray-500"><BookOpen size={48} className="mx-auto mb-4 opacity-50 text-emerald-600" /><p className="text-lg font-bold mb-2">Sổ tay của bạn hiện đang trống.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notebook.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col"><span className="font-bold text-lg text-emerald-800">{item.word}</span><span className="text-gray-600 font-medium mb-2">{item.meaning}</span><span className="text-xs text-gray-400 mt-auto text-right border-t border-dashed pt-2">Đã thêm: {item.addedAt}</span></div>
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
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">🎁 Điểm & Tiền Tệ (Coins)</h4>
                <ul className="text-sm text-green-800 list-disc list-inside space-y-2">
                  <li><span className="font-bold">+5 Điểm & +10 Coins:</span> Nộp đúng 100% bài tập ở lần đầu.</li>
                  <li><span className="font-bold">+1 Điểm & +2 Coins:</span> Thắng 1 ván Mini-game ôn tập.</li>
                  <li><span className="font-bold">Đạt Huy Hiệu:</span> Nhận thưởng lớn từ 10 - 1000 Coins.</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">⚔️ Phạt Kỷ Luật</h4>
                <ul className="text-sm text-red-800 list-disc list-inside space-y-2">
                  <li><span className="font-bold">-5 Điểm & -10 Coins:</span> Vắng học, hoặc có hành vi gian lận (Chuyển tab, tua quá mức quy định).</li>
                  <li><span className="font-bold">-2 Điểm & -4 Coins:</span> Làm sai bài tập 3 lần (buộc khóa bài), hoặc sai kiểm tra từ vựng.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}