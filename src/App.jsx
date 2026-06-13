// src/App.jsx
import React, { useState, useEffect } from 'react';
import { courseData } from './data';
import Lesson from './Lesson';
import VocabularyReview from './VocabularyReview';
import { Flame, Lock, CheckCircle2, Calendar, Target, LogOut, Info, X, Gamepad2, BookOpen, Crown, Medal, Award, Coins, Store, Shield, Ticket, Lightbulb, PackageOpen, BrainCircuit, Dices, ShieldAlert } from 'lucide-react';

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
  const [coins, setCoins] = useState(0); 
  const [wordProgress, setWordProgress] = useState({}); 
  const [inventory, setInventory] = useState({ shields: 0, skips: 0, hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 });
  const [shopStats, setShopStats] = useState({ immortalBoughtCount: 0 });
  
  const [checkinState, setCheckinState] = useState({ day: 0, show: false });

  const [showSetup, setShowSetup] = useState(false);
  const [tempSchedule, setTempSchedule] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null); 
  const [startDateStr, setStartDateStr] = useState(null);
  
  const [showRules, setShowRules] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false); 
  const [showVocabMastery, setShowVocabMastery] = useState(false); 
  const [showProfile, setShowProfile] = useState(false); 
  const [showShop, setShowShop] = useState(false); 
  const [showGachaModal, setShowGachaModal] = useState(false); 

  const [notebook, setNotebook] = useState([]);
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState(0);
  const [lastPlayedWords, setLastPlayedWords] = useState([]);
  const [activityLog, setActivityLog] = useState([]); 
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0); 
  const [claimedAchievements, setClaimedAchievements] = useState([]); 
  const [achievementPopup, setAchievementPopup] = useState(null); 

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinIndex, setCurrentSpinIndex] = useState(0);
  const [gachaPrize, setGachaPrize] = useState(null);

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
        setUnlockedDay(Number(data.unlockedDay || 1));
        setTotalScore(Number(data.score !== undefined ? data.score : 100));
        setCoins(Number(data.coins !== undefined ? data.coins : 0));
        setWordProgress(data.wordProgress || {}); 
        
        setInventory(data.inventory || { shields: 0, skips: 0, hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 });
        setShopStats(data.shopStats || { immortalBoughtCount: 0 });

        let cDay = data.checkin?.day || 0;
        let cDate = data.checkin?.lastDate || null;
        let showC = false;

        if (cDate !== todayStr) {
           let yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           if (cDate === yesterday.toDateString()) {
              cDay = (cDay % 7) + 1; 
           } else {
              cDay = 1; 
           }
           showC = true;
        }
        setCheckinState({ day: cDay, show: showC });

        setClaimedAchievements(data.claimedAchievements || []);
        setStreak(Number(data.streak || 0));
        setLastPlayedWords(data.lastPlayedWords || []);
        setNotebook(data.notebook || []);
        setLastCompletedDate(data.lastCompletedDate || null);
        setActivityLog(data.activityLog || []);
        setTotalGamesPlayed(Number(data.totalGamesPlayed || 0));
        setStartDateStr(data.startDate || todayStr);
        
        if (data.lastGameDate === todayStr) {
          setDailyGamesPlayed(Number(data.dailyGamesPlayed || 0));
        } else {
          setDailyGamesPlayed(0); 
        }

        if (data.schedule) {
          setSchedule(data.schedule);
          if (!isAdmin) handleMissedDays(data, userRef, todayStr);
        } else {
          setShowSetup(true); 
        }
      } else {
        const newProfile = {
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
          unlockedDay: 1,
          score: 100, 
          coins: 0,   
          wordProgress: {},
          inventory: { shields: 0, skips: 0, hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 },
          shopStats: { immortalBoughtCount: 0 },
          checkin: { lastDate: null, day: 0 },
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
        setWordProgress({});
        setInventory(newProfile.inventory);
        setShopStats(newProfile.shopStats);
        setCheckinState({ day: 1, show: true });
        setStartDateStr(todayStr);
        setActivityLog([todayStr]);
        setShowSetup(true);
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

    let newStreak = Number(data.streak || 0);
    let newScore = Number(data.score !== undefined ? data.score : 100);
    let newCoins = Number(data.coins !== undefined ? data.coins : 0);
    let currentInventory = data.inventory || { shields: 0, skips: 0, hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 };
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
          if (currentInventory.shields > 0) {
            currentInventory.shields -= 1;
            alert(`🛡️ Streak Shield Tự Động Kích Hoạt!\nChuỗi ngày học rực lửa của bạn đã được bảo vệ.`);
            needsUpdate = true;
          } else {
            newStreak = 0; 
            needsUpdate = true;
          }

          const pointPenalty = missedDaysCount * 5;
          const coinPenalty = missedDaysCount * 10; 
          
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

  const claimCheckinReward = async () => {
    let c = Number(coins);
    let inv = { ...inventory };
    let msg = "";
    
    switch(checkinState.day) {
       case 1: c += 1; msg = "+1 Coin"; break;
       case 2: c += 2; msg = "+2 Coins"; break;
       case 3: inv.tickets = (inv.tickets || 0) + 1; msg = "+1 Lượt chơi game"; break;
       case 4: inv.tickets = (inv.tickets || 0) + 2; msg = "+2 Lượt chơi game"; break;
       case 5: inv.tickets = (inv.tickets || 0) + 3; msg = "+3 Lượt chơi game"; break;
       case 6: inv.gachaTickets = (inv.gachaTickets || 0) + 1; msg = "+1 Vé quay Gacha"; break;
       case 7: inv.immortals = (inv.immortals || 0) + 1; msg = "+1 Thẻ Bất Tử"; break;
       default: break;
    }
    
    const todayStr = new Date().toDateString();
    await updateDoc(doc(db, 'users', user.uid), {
       coins: c,
       inventory: inv,
       checkin: { lastDate: todayStr, day: checkinState.day }
    });
    
    setCoins(c);
    setInventory(inv);
    setCheckinState({ ...checkinState, show: false });
    alert(`🎁 Điểm danh Ngày ${checkinState.day} thành công!\nPhần thưởng: ${msg}`);
  };

  const handleUpdateWordProgress = async (wordsArray) => {
    if (!wordsArray || wordsArray.length === 0) return;
    const newProgress = { ...(wordProgress || {}) }; 
    
    wordsArray.forEach(w => {
      const wordLower = w.toLowerCase();
      if (!newProgress[wordLower]) newProgress[wordLower] = 0;
      if (newProgress[wordLower] < 3) {
        newProgress[wordLower] += 1;
      }
    });

    setWordProgress(newProgress);
    await updateDoc(doc(db, 'users', user.uid), { wordProgress: newProgress });
  };

  const handleCompleteLesson = async (dayId, vocabFailCount, exerciseFailCount) => {
    let pointPenalty = 0;
    let coinPenalty = 0;
    let pointBonus = 0;
    let coinBonus = 0;
    let message = "📊 TỔNG KẾT BÀI HỌC CỦA BẠN:\n\n";

    const isTestDay = courseData.find(d => d.id === dayId)?.isTest;
    const maxExFailsAllowed = isTestDay ? 5 : 3; // BÀI TEST CHỈ ĐƯỢC SAI 5 LẦN

    if (vocabFailCount > 3) { 
      pointPenalty += 2; coinPenalty += 4; 
      message += `❌ PHẠT: -2 Điểm & -4 Coins (Sai từ vựng đầu giờ).\n`; 
    }

    if (exerciseFailCount >= maxExFailsAllowed) { 
      pointPenalty += 2; coinPenalty += 4; 
      message += `❌ PHẠT: -2 Điểm & -4 Coins (Làm sai bài tập vượt quá số lần cho phép).\n`; 
    } else if (exerciseFailCount > 0 && exerciseFailCount < maxExFailsAllowed) {
      message += `✅ HOÀN THÀNH BÀI TẬP.\n⚠️ Lưu ý: Vì có lỗi sai nên bạn không được cộng phần thưởng Tuyệt Đối.\n`;
    }

    const currentUnlocked = Number(unlockedDay);
    const currentDayId = Number(dayId);
    const isFirstTime = currentDayId >= currentUnlocked;

    if (isFirstTime) {
      if (exerciseFailCount === 0) { 
        pointBonus = 5; 
        coinBonus = 10;
        message += `⭐ XUẤT SẮC: +5 Điểm & +10 Coins (Làm đúng 100% lần đầu!).\n`; 
      }
    } else {
      coinBonus += 2; 
      message += `✅ Ôn tập bài cũ thành công: Nhận +2 Coins an ủi.\n`;
    }

    let newScore = Number(totalScore) - pointPenalty + pointBonus;
    let newCoins = Number(coins) - coinPenalty + coinBonus; 
    
    if (newScore < 0) newScore = 0;
    if (newCoins < 0) newCoins = 0;

    const nextDay = (currentDayId === currentUnlocked && currentDayId < 48) ? currentDayId + 1 : currentUnlocked;
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

    alert(message);
  };

  const handleGameComplete = async (isWin, correctlyAnsweredWords) => {
    const todayStr = new Date().toDateString();
    let newScore = Number(totalScore);
    let newCoins = Number(coins);
    let newDailyGames = dailyGamesPlayed + 1;
    let newTotalGames = totalGamesPlayed + 1;

    let earnedScore = 0;
    let rewardCoins = 0;

    if (isWin) {
      earnedScore = 1;
      rewardCoins = 2; 
      newScore += earnedScore;
      newCoins += rewardCoins;
    }

    if (correctlyAnsweredWords && correctlyAnsweredWords.length > 0) {
      handleUpdateWordProgress(correctlyAnsweredWords);
    }

    const newActivityLog = activityLog.includes(todayStr) ? activityLog : [...activityLog, todayStr];

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { 
      score: newScore,
      coins: newCoins,
      dailyGamesPlayed: newDailyGames,
      totalGamesPlayed: newTotalGames,
      lastGameDate: todayStr,
      lastPlayedWords: correctlyAnsweredWords, 
      activityLog: newActivityLog
    });

    setTotalScore(newScore);
    setCoins(newCoins);
    setDailyGamesPlayed(newDailyGames);
    setTotalGamesPlayed(newTotalGames);
    setLastPlayedWords(correctlyAnsweredWords);
    setActivityLog(newActivityLog);
    setIsPlayingVocab(false); 
    
    if (isWin) {
      alert(`🎮 Chiến thắng! Bạn nhận được +${earnedScore} Điểm, +${rewardCoins} Coins.\nTiến độ những từ bạn đánh ĐÚNG đã được lưu lại.`);
    } else {
      alert(`💀 Game Over!\nTuy nhiên, những từ bạn đã trả lời ĐÚNG vẫn được tính tiến độ.`);
    }
  };

  const getLearnedVocab = () => {
    let vocabPool = [];
    courseData.forEach(day => {
      if (day.id < unlockedDay && day.vocabulary && day.vocabulary.length > 0) vocabPool = [...vocabPool, ...day.vocabulary];
    });
    return vocabPool;
  };

  const completedLessons = unlockedDay > 1 ? unlockedDay - 1 : 0;
  const safeWordProgress = wordProgress || {};
  const wordsMasteredCount = Object.values(safeWordProgress).filter(count => typeof count === 'number' && count >= 3).length;
  const masteredWordsList = Object.entries(safeWordProgress).filter(([word, count]) => typeof count === 'number' && count >= 3);

  const achievementsList = [
    { id: "streak_7", title: "Khởi động", desc: "Đăng nhập liên tục 7 ngày", achieved: streak >= 7, rewardCoins: 20, icon: "🔥", color: "text-orange-500", bg: "bg-orange-100" },
    { id: "streak_30", title: "Thói quen", desc: "Đăng nhập liên tục 30 ngày", achieved: streak >= 30, rewardCoins: 100, icon: "🔥", color: "text-red-500", bg: "bg-red-100" },
    { id: "streak_50", title: "Bền bỉ", desc: "Đăng nhập liên tục 50 ngày", achieved: streak >= 50, rewardCoins: 300, icon: "🔥", color: "text-rose-500", bg: "bg-rose-100" },
    { id: "streak_80", title: "Kỷ luật thép", desc: "Đăng nhập liên tục 80 ngày", achieved: streak >= 80, rewardCoins: 500, icon: "💎", color: "text-cyan-500", bg: "bg-cyan-100" },
    
    { id: "lessons_10", title: "Chăm chỉ", desc: "Hoàn thành 10 bài học", achieved: completedLessons >= 10, rewardCoins: 40, icon: "📝", color: "text-blue-500", bg: "bg-blue-100" },
    { id: "lessons_24", title: "Băng rừng", desc: "Hoàn thành 24 bài (Nửa khóa)", achieved: completedLessons >= 24, rewardCoins: 200, icon: "⏳", color: "text-blue-600", bg: "bg-blue-200" },
    { id: "lessons_48", title: "Học giả", desc: "Tốt nghiệp toàn bộ 48 bài", achieved: completedLessons >= 48, rewardCoins: 500, icon: "🎓", color: "text-purple-600", bg: "bg-purple-200" },
    
    { id: "words_50", title: "Tân binh", desc: "Làm chủ 50 từ vựng", achieved: wordsMasteredCount >= 50, rewardCoins: 30, icon: "🧠", color: "text-fuchsia-500", bg: "bg-fuchsia-100" },
    { id: "words_100", title: "Trí nhớ tốt", desc: "Làm chủ 100 từ vựng", achieved: wordsMasteredCount >= 100, rewardCoins: 100, icon: "📚", color: "text-indigo-500", bg: "bg-indigo-100" },
    { id: "words_250", title: "Từ điển sống", desc: "Làm chủ 250 từ vựng", achieved: wordsMasteredCount >= 250, rewardCoins: 300, icon: "👑", color: "text-amber-500", bg: "bg-amber-100" },
    
    { id: "games_10", title: "Game Thủ", desc: "Thắng mini-game 10 lần", achieved: totalGamesPlayed >= 10, rewardCoins: 20, icon: "🎮", color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: "games_30", title: "Kẻ hủy diệt", desc: "Thắng mini-game 30 lần", achieved: totalGamesPlayed >= 30, rewardCoins: 100, icon: "⚔️", color: "text-teal-600", bg: "bg-teal-100" },
    { id: "games_60", title: "Cao thủ", desc: "Thắng mini-game 60 lần", achieved: totalGamesPlayed >= 60, rewardCoins: 200, icon: "🔥", color: "text-orange-600", bg: "bg-orange-100" },
    { id: "games_100", title: "Thần thoại", desc: "Thắng mini-game 100 lần", achieved: totalGamesPlayed >= 100, rewardCoins: 500, icon: "👑", color: "text-yellow-500", bg: "bg-yellow-100" },
    { id: "games_200", title: "Huyền thoại", desc: "Thắng mini-game 200 lần", achieved: totalGamesPlayed >= 200, rewardCoins: 1000, icon: "🌟", color: "text-amber-500", bg: "bg-amber-100" },
  ];

  useEffect(() => {
    if (!user || loading) return;
    const checkAchievements = async () => {
      let newCoins = Number(coins);
      let newScore = Number(totalScore);
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
        await updateDoc(userRef, { coins: newCoins, score: newScore, claimedAchievements: newClaimed });
        setCoins(newCoins);
        setTotalScore(newScore);
        setClaimedAchievements(newClaimed);
        setAchievementPopup(popupData);
      }
    };
    checkAchievements();
  }, [streak, wordsMasteredCount, totalGamesPlayed, completedLessons]);

  const buyItem = async (itemName, baseCost, key) => {
    let cost = baseCost;
    let newShopStats = { ...shopStats };
    
    if (key === 'immortals') {
       cost = 20 + (shopStats.immortalBoughtCount || 0) * 5;
    }

    if (coins < cost) return alert("Bạn không đủ Coins!");
    const confirmBuy = window.confirm(`Xác nhận dùng ${cost} Coins để mua ${itemName}?`);
    if (!confirmBuy) return;

    let newCoins = Number(coins) - cost;
    const newInv = { ...inventory };
    newInv[key] = (newInv[key] || 0) + 1;
    
    if (key === 'immortals') {
       newShopStats.immortalBoughtCount = (newShopStats.immortalBoughtCount || 0) + 1;
    }

    alert(`✅ Mua thành công: ${itemName}`);

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: newCoins, inventory: newInv, shopStats: newShopStats });
    
    setCoins(newCoins);
    setInventory(newInv);
    setShopStats(newShopStats);
  };

  const gachaItems = [
    { id: 'skip', icon: '🎟️', label: "Thẻ Skip", bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" },
    { id: 'hint', icon: '💡', label: "Thẻ Gợi ý", bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-700" },
    { id: 'coins', icon: '💰', label: "50 Coins", bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-700" },
    { id: 'jackpot', icon: '🎯', label: "+5 ĐIỂM", bg: "bg-red-100", border: "border-red-400", text: "text-red-700" }
  ];

  const handleSpinGacha = async () => {
    let useTicket = (inventory.gachaTickets || 0) > 0;
    if (!useTicket && coins < 25) return alert("Bạn không đủ 25 Coins hoặc Vé để quay!");
    
    let newCoins = Number(coins);
    let newInv = { ...inventory };

    if (useTicket) {
       newInv.gachaTickets -= 1;
    } else {
       newCoins -= 25;
    }

    setCoins(newCoins);
    setInventory(newInv);
    setIsSpinning(true);
    setGachaPrize(null);

    const rand = Math.random();
    let prizeKey = '';
    if (rand < 0.25) prizeKey = 'skip';
    else if (rand < 0.50) prizeKey = 'hint';
    else if (rand < 0.80) prizeKey = 'coins'; 
    else prizeKey = 'jackpot'; 

    const targetIndex = gachaItems.findIndex(i => i.id === prizeKey);

    const baseSpins = 32; 
    const stepsToTarget = (targetIndex - currentSpinIndex + 4) % 4;
    const totalSpins = baseSpins + stepsToTarget;

    let currentStep = 0;
    let tempIndex = currentSpinIndex;

    const spinInterval = setInterval(() => {
      currentStep++;
      tempIndex = (tempIndex + 1) % 4;
      setCurrentSpinIndex(tempIndex);

      if (currentStep >= totalSpins) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setGachaPrize(gachaItems[targetIndex]);
        applyGachaPrize(prizeKey, newCoins, newInv);
      }
    }, 100); 
  };

  const applyGachaPrize = async (prizeKey, currentCoinsAfterDeduct, invAfterDeduct) => {
    let updatedCoins = Number(currentCoinsAfterDeduct);
    let updatedScore = Number(totalScore);
    const updatedInv = { ...invAfterDeduct };

    if (prizeKey === 'skip') updatedInv.skips += 1;
    else if (prizeKey === 'hint') updatedInv.hints += 1;
    else if (prizeKey === 'coins') updatedCoins += 50; 
    else if (prizeKey === 'jackpot') updatedScore += 5; 

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: updatedCoins, score: updatedScore, inventory: updatedInv });
    
    setCoins(updatedCoins);
    setTotalScore(updatedScore);
    setInventory(updatedInv);
  };

  const openNotebook = async () => {
    if (user) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setNotebook(docSnap.data().notebook || []);
    }
    setShowNotebook(true);
  };

  const currentImmortalPrice = 20 + (shopStats?.immortalBoughtCount || 0) * 5;

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
    return <Lesson dayData={dayData} prevDayData={prevDayData} onComplete={handleCompleteLesson} onBack={() => setActiveLesson(null)} onCheat={null} isAdmin={isAdmin} inventory={inventory} consumeItem={consumeItem} onUpdateWordProgress={handleUpdateWordProgress} />;
  }

  if (isPlayingVocab) {
    const learnedVocab = getLearnedVocab();
    return <VocabularyReview learnedVocab={learnedVocab} lastPlayedWords={lastPlayedWords} onBack={() => setIsPlayingVocab(false)} onCompleteGame={handleGameComplete} dailyGamesPlayed={dailyGamesPlayed} isAdmin={isAdmin} />;
  }

  const currentDayOfWeek = new Date().getDay();
  const isScheduledToday = schedule ? schedule.includes(currentDayOfWeek) : false;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 relative">
      <div className="max-w-5xl mx-auto space-y-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
           <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2">
                Chào {user.displayName} 👋
                {isAdmin && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md border border-purple-200"><Crown size={14}/> Admin</span>}
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                {isScheduledToday ? "Hôm nay có lịch học. Cố lên!" : "Hôm nay không có lịch học. Nghỉ ngơi nhé."}
              </p>
           </div>
           <button onClick={logout} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-3 rounded-xl transition-colors"><LogOut size={20} /></button>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 px-6 py-3 rounded-xl font-black border border-orange-100 flex-1">
            <Flame size={24} /> <span className="text-lg">Streak: {streak}</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-yellow-50 text-yellow-600 px-6 py-3 rounded-xl font-black border border-yellow-100 flex-1">
            <Coins size={24} /> <span className="text-lg">Coin: {coins}</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-black border border-blue-100 flex-1 relative">
            <Target size={24} /> <span className="text-lg">Điểm: {totalScore}</span>
            <button onClick={() => setShowRules(true)} className="absolute right-3 text-blue-300 hover:text-blue-600 transition-transform hover:scale-110"><Info size={20} /></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <button onClick={() => {
                if (isAdmin || dailyGamesPlayed < 3) setIsPlayingVocab(true);
                else if (inventory.tickets > 0) {
                  if (window.confirm("Bạn đã hết lượt. Dùng 1 Lượt chơi Game dự phòng để chơi tiếp?")) consumeItem('tickets').then(() => setIsPlayingVocab(true));
                } else alert("Bạn đã hết lượt chơi hôm nay. Hãy điểm danh hoặc kiếm thêm Lượt!");
              }} 
              className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors shadow-sm whitespace-nowrap">
            <Gamepad2 size={20} /> Game
          </button>
          <button onClick={() => setShowShop(true)} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-sm whitespace-nowrap">
            <Store size={20} /> Store
          </button>
          <button onClick={openNotebook} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm whitespace-nowrap">
            <BookOpen size={20} /> Library
          </button>
          <button onClick={() => setShowVocabMastery(true)} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors shadow-sm whitespace-nowrap">
            <BrainCircuit size={20} /> Mastered Vocab
          </button>
          <button onClick={() => setShowProfile(true)} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap">
            <Medal size={20} /> Thành Tựu
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
             <span>Progress Bar</span>
             <span className="text-emerald-600">{completedLessons} / 48 Bài</span>
           </div>
           <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden border border-gray-200 shadow-inner">
             <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2" style={{ width: `${(completedLessons / 48) * 100}%` }}>
                {completedLessons > 2 && <span className="text-white text-xs font-black">{Math.round((completedLessons / 48) * 100)}%</span>}
             </div>
           </div>
        </div>

      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
      
      {/* ============================================================== */}
      {/* CÁC MODAL CỦA HỆ THỐNG */}
      {/* ============================================================== */}

      {checkinState.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-indigo-600 mb-2">Quà Điểm Danh 🎁</h2>
            <p className="text-gray-600 mb-6 font-medium">Chuỗi điểm danh 7 ngày liên tiếp</p>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
                {[1,2,3,4,5,6,7].map(d => {
                   let isToday = checkinState.day === d;
                   let isPast = checkinState.day > d;
                   
                   let icon = '🪙'; // Day 1
                   if (d===2) icon = '💰';
                   if (d>=3 && d<=5) icon = '🎟️'; // Tickets
                   if (d===6) icon = '🎲'; // Gacha Ticket
                   if (d===7) icon = '🛡️'; // Thẻ Bất Tử

                   let itemClass = "p-2 rounded-xl flex flex-col items-center justify-center border-2 transition-all ";
                   if (isToday) itemClass += "bg-indigo-100 border-indigo-500 scale-105 shadow-md ring-2 ring-indigo-200 animate-pulse";
                   else if (isPast) itemClass += "bg-green-50 border-green-400 opacity-60";
                   else itemClass += "bg-gray-50 border-gray-200 opacity-80";

                   return (
                     <div key={d} className={itemClass}>
                       <span className={`text-[10px] sm:text-xs font-bold mb-1 ${isToday ? 'text-indigo-700' : isPast ? 'text-green-700' : 'text-gray-500'}`}>Ngày {d}</span>
                       <span className="text-xl sm:text-2xl">{icon}</span>
                       {isPast && <CheckCircle2 size={12} className="text-green-600 absolute bottom-1 right-1"/>}
                     </div>
                   );
                })}
            </div>

            <button onClick={claimCheckinReward} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-lg transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
               Nhận Quà Ngày {checkinState.day}
            </button>
          </div>
        </div>
      )}
      
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-2"><Store size={28} /> Cửa Hàng Vật Phẩm</h3>
                <p className="font-medium text-yellow-100 flex items-center gap-2 mt-1">Sức mua hiện tại: <span className="bg-black/20 px-2 py-1 rounded flex items-center gap-1"><Coins size={16}/> {coins} Coins</span></p>
              </div>
              <button onClick={() => setShowShop(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              <div className="border-2 border-red-200 rounded-2xl p-5 flex flex-col justify-between hover:border-red-400 transition-colors bg-red-50/40 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10"><ShieldAlert size={100}/></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-sm border border-red-200"><ShieldAlert size={24}/></div>
                    <span className="bg-white text-gray-700 font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-gray-100">Đang có: {inventory.immortals || 0}</span>
                  </div>
                  <h4 className="text-xl font-black text-red-900 mb-1">Thẻ Bất Tử</h4>
                  <p className="text-xs text-red-700 font-bold mb-4 bg-white/50 p-2 rounded-lg border border-red-100">Chống trừ điểm khi làm sai bài tập vượt số lần cho phép. (Giá tăng dần sau mỗi lượt mua)</p>
                </div>
                <button onClick={() => buyItem("Thẻ Bất Tử", currentImmortalPrice, 'immortals')} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black py-3 rounded-xl hover:shadow-lg transition-transform active:scale-95 flex justify-center gap-2 relative z-10"><Coins size={20}/> {currentImmortalPrice} Coins</button>
              </div>

              <div className="border-2 border-orange-100 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center"><Shield size={24}/></div>
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm">Đang có: {inventory.shields}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Streak Shield</h4>
                  <p className="text-sm text-gray-500 font-medium mb-4">Bảo vệ chuỗi ngày nếu bạn lỡ quên học.</p>
                </div>
                <button onClick={() => buyItem("Streak Shield", 20, 'shields')} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 20 Coins</button>
              </div>

              <div className="border-2 border-indigo-100 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-xl flex items-center justify-center"><Ticket size={24}/></div>
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm">Đang có: {inventory.skips}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Thẻ Skip Từ Vựng</h4>
                  <p className="text-sm text-gray-500 font-medium mb-4">Bỏ qua trạm kiểm tra từ vựng đầu giờ.</p>
                </div>
                <button onClick={() => buyItem("Thẻ Skip", 15, 'skips')} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 15 Coins</button>
              </div>

              <div className="border-2 border-yellow-100 rounded-2xl p-5 flex flex-col justify-between hover:border-yellow-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-xl flex items-center justify-center"><Lightbulb size={24}/></div>
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm">Đang có: {inventory.hints}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">Gợi ý (Hint)</h4>
                  <p className="text-sm text-gray-500 font-medium mb-4">Điền giúp bạn 1 đáp án đúng khi làm bài tập.</p>
                </div>
                <button onClick={() => buyItem("Hint", 20, 'hints')} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 20 Coins</button>
              </div>

              <div className="border-2 border-purple-200 bg-purple-50/50 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-400 transition-colors sm:col-span-2 md:col-span-2">
                <div>
                  <div className="flex justify-between items-start mb-3">
                     <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Dices size={24}/></div>
                     {(inventory.gachaTickets > 0) && <span className="bg-purple-600 text-white font-black px-3 py-1 rounded-full text-sm shadow-sm animate-pulse">Sẵn sàng: {inventory.gachaTickets} Vé quay</span>}
                  </div>
                  <h4 className="text-xl font-bold text-purple-900 mb-1">Vòng Quay Gacha</h4>
                  <p className="text-sm text-purple-700 font-medium mb-4">Thử vận may! Quay trúng Thẻ Skip, Hint, 50 Coins, hoặc Jackpot +5 Điểm!</p>
                </div>
                <button onClick={() => {setShowShop(false); setShowGachaModal(true);}} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-transform active:scale-95 flex justify-center gap-2 shadow-md">
                   {inventory.gachaTickets > 0 ? <><Ticket size={20}/> Dùng Vé Gacha Miễn Phí</> : <><Coins size={20}/> 25 Coins</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGachaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in zoom-in duration-300">
            <h3 className="text-3xl font-black text-purple-700 mb-2 flex justify-center gap-2"><Dices size={32}/> Vòng Quay Gacha</h3>
            <p className="text-gray-500 font-medium mb-8">25 Coins hoặc 1 Vé / 1 lượt quay</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {gachaItems.map((item, idx) => (
                <div key={item.id} className={`p-4 rounded-xl border-4 transition-all duration-100 flex flex-col items-center justify-center h-28 ${currentSpinIndex === idx ? 'border-purple-500 scale-105 shadow-xl ' + item.bg + ' ' + item.text : 'border-gray-100 bg-gray-50 opacity-50 grayscale'}`}>
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="font-bold text-sm leading-tight">{item.label}</div>
                </div>
              ))}
            </div>

            {gachaPrize ? (
              <div className="mb-8 animate-bounce">
                <p className="text-lg font-bold text-gray-800">Bạn đã quay trúng:</p>
                <p className={`text-3xl font-black mt-1 ${gachaPrize.text} drop-shadow-md`}>{gachaPrize.label}</p>
              </div>
            ) : (
              <div className="mb-8 h-[76px]"></div> 
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowGachaModal(false)} disabled={isSpinning} className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-colors">Đóng</button>
              <button onClick={handleSpinGacha} disabled={isSpinning || (!inventory.gachaTickets && coins < 25)} className="flex-[2] bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black py-4 rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2">
                {isSpinning ? 'Đang quay...' : inventory.gachaTickets > 0 ? <><Ticket size={20}/> Quay (Dùng Vé)</> : <><Coins size={20}/> Quay (25 Coins)</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {achievementsList.map((ach, idx) => (
                    <div key={idx} className={`relative p-4 rounded-xl border-2 transition-all ${ach.achieved ? `border-transparent ${ach.bg} shadow-sm hover:scale-105` : 'border-gray-200 bg-gray-50 opacity-60 grayscale'}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 bg-white shadow-sm ${ach.achieved ? ach.color : 'text-gray-400'}`}>{ach.icon}</div>
                      <h5 className={`font-bold text-lg ${ach.achieved ? 'text-gray-900' : 'text-gray-500'}`}>{ach.title}</h5>
                      <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{ach.desc}</p>
                      <span className="text-yellow-600 font-black block mt-2 text-sm bg-white/60 inline-block px-2 py-1 rounded-md">+{ach.rewardCoins} Coins</span>
                      {ach.achieved && <div className="absolute top-3 right-3 text-amber-400 bg-white rounded-full"><CheckCircle2 size={20}/></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotebook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-[#10b981] to-[#059669] p-5 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold flex items-center gap-2"><BookOpen size={24} /> Ghi Chú Cá Nhân (Library)</h3>
              <button onClick={() => setShowNotebook(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              {notebook.length === 0 ? (
                <div className="text-center py-10 text-gray-500"><BookOpen size={48} className="mx-auto mb-4 opacity-50 text-emerald-600" /><p className="text-lg font-bold mb-2">Sổ tay của bạn hiện đang trống.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notebook.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col hover:border-emerald-300 transition-colors">
                      <span className="font-bold text-lg text-emerald-800">{item.word}</span>
                      <span className="text-gray-600 font-medium mb-2">{item.meaning}</span>
                      <span className="text-[10px] text-gray-400 mt-auto text-right border-t border-dashed pt-2 uppercase tracking-wider font-bold">Đã thêm: {item.addedAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showVocabMastery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-700 p-5 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold flex items-center gap-2"><BrainCircuit size={24} /> Từ Vựng Đã Master</h3>
              <button onClick={() => setShowVocabMastery(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={24} /></button>
            </div>
            
            <div className="bg-fuchsia-50 p-4 border-b border-fuchsia-100 text-sm text-fuchsia-800 font-medium">
              💡 <span className="font-bold">Quy tắc kỷ luật:</span> Hệ thống chỉ hiển thị những từ vựng bạn đã trả lời ĐÚNG ít nhất 3 lần. Những từ chưa đủ mốc 3 lần sẽ bị ẩn để bạn tập trung luyện thêm.
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              {masteredWordsList.length === 0 ? (
                <div className="text-center py-10 text-gray-500"><BrainCircuit size={48} className="mx-auto mb-4 opacity-50 text-fuchsia-600" /><p className="text-lg font-bold">Chưa có từ vựng nào đạt mốc 3 lần đúng.</p></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {masteredWordsList.map(([word, count]) => (
                    <div key={word} className="p-4 rounded-xl border border-green-300 shadow-sm flex justify-between items-center bg-white hover:bg-green-50 transition-colors cursor-default">
                      <span className="font-black text-lg text-green-700 capitalize">{word}</span>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Mastered</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRules && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold flex items-center gap-2"><Target size={24} /> Sổ Tay Kỷ Luật</h3>
              <button onClick={() => setShowRules(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">🎁 Cách tích lũy Điểm</h4>
                <ul className="text-sm text-green-800 list-disc list-inside space-y-2 font-medium">
                  <li><span className="font-bold">+5 Điểm & +10 Coins:</span> Làm đúng 100% Bài học ở lần đầu tiên.</li>
                  <li><span className="font-bold">+1 Điểm & +2 Coins:</span> Thắng 1 ván Mini-game ôn tập.</li>
                  <li><span className="font-bold">Điểm Danh:</span> Truy cập liên tục mỗi ngày để nhận quà siêu khủng.</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
                <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">⚔️ Phạt Kỷ Luật</h4>
                <ul className="text-sm text-red-800 list-disc list-inside space-y-2 font-medium">
                  <li><span className="font-bold">-5 Điểm & -10 Coins:</span> Phạt cho mỗi 1 ngày lười vắng học.</li>
                  <li><span className="font-bold">-2 Điểm & -4 Coins:</span> Làm sai bài tập 3 lần, sai từ vựng, hoặc gian lận mở tab khác khi thi.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}