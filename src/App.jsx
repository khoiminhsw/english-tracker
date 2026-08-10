// src/App.jsx
import React, { useState, useEffect } from 'react';
import { courseData } from './data';
import Lesson from './Lesson';
import VocabularyReview from './VocabularyReview';
import { Flame, Lock, CheckCircle2, Calendar, Target, LogOut, Info, X, Gamepad2, BookOpen, Crown, Medal, Award, Coins, Store, Shield, Ticket, Lightbulb, BrainCircuit, Dices, ShieldAlert, PieChart, TrendingUp, AlertTriangle, ArrowRightLeft, Sparkles, PlayCircle, Bookmark } from 'lucide-react';

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
  const [inventory, setInventory] = useState({ hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 });
  const [shopStats, setShopStats] = useState({ immortalBoughtCount: 0, dailyHintBought: 0 });
  
  const [exchangeStats, setExchangeStats] = useState({ dailyCount: 0, monthlyCount: 0, lastDate: null, lastMonth: null });
  const [lessonScores, setLessonScores] = useState({});
  const [learningStats, setLearningStats] = useState({ totalVocabFails: 0, totalExerciseFails: 0 });
  const [bookmarks, setBookmarks] = useState({}); 
  
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
  const [showAnalytics, setShowAnalytics] = useState(false); 
  const [showDailyReminder, setShowDailyReminder] = useState(false);

  const [notebook, setNotebook] = useState([]);
  const [dailyGamesPlayed, setDailyGamesPlayed] = useState(0);
  const [dailyRedoCount, setDailyRedoCount] = useState(0); 
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
      const currentMonth = new Date().getMonth();

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUnlockedDay(Number(data.unlockedDay || 1));
        setTotalScore(Number(data.score !== undefined ? data.score : 100));
        setCoins(Number(data.coins !== undefined ? data.coins : 0));
        setWordProgress(data.wordProgress || {}); 
        setBookmarks(data.bookmarks || {}); 
        
        setInventory(data.inventory || { hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 });
        
        let sStats = data.shopStats || { immortalBoughtCount: 0, dailyHintBought: 0 };
        if (data.lastGameDate !== todayStr) {
           sStats.dailyHintBought = 0; 
        }
        setShopStats(sStats);
        
        setLessonScores(data.lessonScores || {});
        setLearningStats(data.learningStats || { totalVocabFails: 0, totalExerciseFails: 0 });

        let eStats = data.exchangeStats || { dailyCount: 0, monthlyCount: 0, lastDate: todayStr, lastMonth: currentMonth };
        if (eStats.lastDate !== todayStr) {
            eStats.dailyCount = 0;
            eStats.lastDate = todayStr;
        }
        if (eStats.lastMonth !== currentMonth) {
            eStats.monthlyCount = 0;
            eStats.lastMonth = currentMonth;
        }
        setExchangeStats(eStats);

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
          setDailyRedoCount(Number(data.dailyRedoCount || 0));
        } else {
          setDailyGamesPlayed(0); 
          setDailyRedoCount(0);
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
          bookmarks: {},
          inventory: { hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 },
          shopStats: { immortalBoughtCount: 0, dailyHintBought: 0 },
          exchangeStats: { dailyCount: 0, monthlyCount: 0, lastDate: todayStr, lastMonth: currentMonth },
          lessonScores: {},
          learningStats: { totalVocabFails: 0, totalExerciseFails: 0 },
          checkin: { lastDate: null, day: 0 },
          claimedAchievements: [],
          streak: 1,
          startDate: todayStr,
          lastLogin: todayStr,
          dailyGamesPlayed: 0,
          dailyRedoCount: 0,
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
        setBookmarks({});
        setInventory(newProfile.inventory);
        setShopStats(newProfile.shopStats);
        setExchangeStats(newProfile.exchangeStats);
        setLessonScores({});
        setLearningStats(newProfile.learningStats);
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
    let currentInventory = data.inventory || { hints: 0, tickets: 0, immortals: 0, gachaTickets: 0 };
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
          newStreak = 0; 
          needsUpdate = true;
          
          const pointPenalty = missedDaysCount * 5;
          const coinPenalty = missedDaysCount * 10; 
          
          newScore -= pointPenalty;
          newCoins -= coinPenalty;
          if (newScore < 0) newScore = 0;
          if (newCoins < 0) newCoins = 0;
          alert(`CẢNH BÁO BỎ HỌC!\nBạn đã vắng mặt ${missedDaysCount} buổi.\nPhạt ${pointPenalty} Điểm Kỷ Luật và ${coinPenalty} Coins!`);
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

  useEffect(() => {
    try {
        if (schedule && !loading && user && !checkinState.show) {
            const todayStr = new Date().toDateString();
            const currentDayOfWeek = new Date().getDay();
            const isScheduledToday = schedule.includes(currentDayOfWeek);
            const hasNotStudiedToday = lastCompletedDate !== todayStr;
            
            if (isScheduledToday && hasNotStudiedToday && !sessionStorage.getItem('dailyReminderShown') && unlockedDay <= 48) {
                setShowDailyReminder(true);
                sessionStorage.setItem('dailyReminderShown', 'true');
            }
        }
    } catch(e) {}
  }, [schedule, loading, user, lastCompletedDate, checkinState.show, unlockedDay]);

  const handleUpdateWordProgress = async (wordsArray) => {
    if (!wordsArray || wordsArray.length === 0) return;
    const newProgress = { ...(wordProgress || {}) }; 
    wordsArray.forEach(w => {
      if (!w) return;
      const wordLower = String(w).toLowerCase();
      if (!newProgress[wordLower]) newProgress[wordLower] = 0;
      if (newProgress[wordLower] < 4) newProgress[wordLower] += 1;
    });
    setWordProgress(newProgress);
    await updateDoc(doc(db, 'users', user.uid), { wordProgress: newProgress });
  };

  const handleToggleBookmark = async (dayId, qIdx) => {
    const currentBookmarks = bookmarks[dayId] || [];
    const newBookmarksForDay = currentBookmarks.includes(qIdx)
        ? currentBookmarks.filter(id => id !== qIdx)
        : [...currentBookmarks, qIdx];
    
    const newBookmarks = { ...bookmarks, [dayId]: newBookmarksForDay };
    setBookmarks(newBookmarks);
    await updateDoc(doc(db, 'users', user.uid), { bookmarks: newBookmarks });
  };

  const handleCompleteLesson = async (dayId, vocabFailCount, exerciseFailCount, actualScore = 0, totalQuestions = 0, isRedoMode = false, currentAnswers = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const newLessonScores = { ...lessonScores };
    const oldLessonData = newLessonScores[dayId] || {};
    const currentLessonRedoCount = oldLessonData.redoCount || 0;

    // XỬ LÝ CHẾ ĐỘ ÔN TẬP (REDO)
    if (isRedoMode) {
        if (actualScore < totalQuestions) {
            alert(`❌ Ôn tập chưa đạt!\nBạn mới đúng ${actualScore}/${totalQuestions} câu. Phải đúng 100% mới được nhận Xu ôn tập!`);
            return; 
        }

        let coinBonus = 0;
        let message = "📊 TỔNG KẾT ÔN TẬP:\n\n";
        
        if (currentLessonRedoCount < 3) {
            coinBonus = 2;
            message += `✅ Ôn tập xuất sắc 100%! Bạn nhận được +2 Coins (Lượt thưởng: ${currentLessonRedoCount + 1}/3 của bài này).\n`;
        } else {
            message += `✅ Ôn tập hoàn tất! (Bài học này đã đạt giới hạn 6 Xu thưởng. Đạt mốc tối đa!).\n`;
        }

        let newCoins = Number(coins) + coinBonus;
        newLessonScores[dayId] = { ...oldLessonData, redoCount: currentLessonRedoCount + 1 };

        await updateDoc(userRef, {
            coins: newCoins,
            lessonScores: newLessonScores
        });

        setCoins(newCoins);
        setLessonScores(newLessonScores);
        setActiveLesson(null);
        alert(message);
        return; 
    }

    // LÀM BÀI MỚI CHÍNH THỨC
    let pointPenalty = 0;
    let coinPenalty = 0;
    let pointBonus = 0;
    let coinBonus = 0;
    let message = "📊 TỔNG KẾT BÀI HỌC CỦA BẠN:\n\n";

    const isTestDay = courseData.find(d => d.id === dayId)?.isTest;
    const isMajorTestPass = isTestDay && actualScore >= 36; 
    const isLazyTest = isTestDay && actualScore < 10;       
    const isLazyNormal = !isTestDay && actualScore < 5;     
    
    const scale10 = totalQuestions > 0 ? ((actualScore / totalQuestions) * 10).toFixed(2) : 10.00;

    if (isLazyTest) {
       pointPenalty += 20; coinPenalty += 40;
       message += `🚨 PHẠT LƯỜI BIẾNG (TEST): -20 Điểm & -40 Coins (Bạn chỉ đúng ${actualScore}/${totalQuestions} câu. Hãy làm bài nghiêm túc!).\n`;
    } else if (isLazyNormal) {
       pointPenalty += 10; coinPenalty += 20;
       message += `🚨 PHẠT LƯỜI BIẾNG (BÀI TẬP): -10 Điểm & -20 Coins (Bạn chỉ đúng ${actualScore}/${totalQuestions} câu. Hãy học hành đàng hoàng!).\n`;
    } else if (isMajorTestPass) {
       message += `🏆 XUẤT SẮC! BẠN ĐÃ ĐẠT CHUẨN (${actualScore}/${totalQuestions} câu) TRONG BÀI TEST LỚN. MIỄN TOÀN BỘ PHẠT!\n`;
    } else {
       if (vocabFailCount > 3) { 
         pointPenalty += 2; coinPenalty += 4; 
         message += `❌ PHẠT: -2 Điểm & -4 Coins (Sai từ vựng đầu giờ).\n`; 
       }
       if (exerciseFailCount >= (isTestDay ? 5 : 3)) { 
         pointPenalty += 2; coinPenalty += 4; 
         message += `❌ PHẠT: -2 Điểm & -4 Coins (Làm sai bài tập vượt số lần cho phép).\n`; 
       } else if (exerciseFailCount > 0) {
         message += `✅ HOÀN THÀNH BÀI TẬP.\n⚠️ Lưu ý: Vì có lỗi sai nên bạn không được cộng phần thưởng Tuyệt Đối.\n`;
       }
    }

    const currentUnlocked = Number(unlockedDay);
    const currentDayId = Number(dayId);
    const isFirstTime = currentDayId >= currentUnlocked;

    if (isFirstTime) {
      if (!isLazyNormal && !isLazyTest) {
         if (exerciseFailCount === 0 || isMajorTestPass) { 
           pointBonus = 5; 
           coinBonus = 10;
           if(!isMajorTestPass) message += `⭐ XUẤT SẮC: +5 Điểm & +10 Coins (Hoàn hảo!).\n`; 
         }
      }
    }

    let newScore = Number(totalScore) - pointPenalty + pointBonus;
    let newCoins = Number(coins) - coinPenalty + coinBonus; 
    if (newScore < 0) newScore = 0;
    if (newCoins < 0) newCoins = 0;

    newLessonScores[dayId] = {
        score: actualScore,
        total: totalQuestions,
        scale10: Number(scale10),
        isTest: !!isTestDay,
        date: new Date().toLocaleDateString('vi-VN'),
        savedAnswers: currentAnswers,
        redoCount: 0 
    };

    const newStats = { ...learningStats };
    newStats.totalVocabFails += vocabFailCount;
    newStats.totalExerciseFails += exerciseFailCount;

    const nextDay = (currentDayId === currentUnlocked && currentDayId < 48) ? currentDayId + 1 : currentUnlocked;
    const todayStr = new Date().toDateString();
    const newActivityLog = activityLog.includes(todayStr) ? activityLog : [...activityLog, todayStr];

    await updateDoc(userRef, {
      score: newScore,
      coins: newCoins,
      unlockedDay: nextDay,
      lastCompletedDate: todayStr,
      activityLog: newActivityLog,
      lessonScores: newLessonScores,
      learningStats: newStats
    });

    setTotalScore(newScore);
    setCoins(newCoins);
    setUnlockedDay(nextDay);
    setLastCompletedDate(todayStr);
    setActivityLog(newActivityLog);
    setLessonScores(newLessonScores);
    setLearningStats(newStats);
    setActiveLesson(null);

    alert(message);
  };

  const handleCheat = async () => {
    if (isAdmin) {
      alert("🛠 Admin Mode: Bỏ qua hình phạt gian lận.");
      setActiveLesson(null);
      return;
    }
    
    let pointPenalty = 10;
    let coinPenalty = 20;
    
    let newScore = Number(totalScore) - pointPenalty;
    let newCoins = Number(coins) - coinPenalty;
    
    if (newScore < 0) newScore = 0;
    if (newCoins < 0) newCoins = 0;
    
    const todayStr = new Date().toDateString();
    const newActivityLog = activityLog.includes(todayStr) ? activityLog : [...activityLog, todayStr];

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 
          score: newScore, 
          coins: newCoins,
          activityLog: newActivityLog
      });
      
      setTotalScore(newScore);
      setCoins(newCoins);
      setActivityLog(newActivityLog);
      setActiveLesson(null);

      setTimeout(() => {
         alert(`🚨 BIÊN BẢN PHẠT GIAN LẬN:\n\nHệ thống đã tự động thu bài và áp dụng hình phạt:\n- Trừ ${pointPenalty} Điểm.\n- Trừ ${coinPenalty} Coins.\n\nHãy trung thực hơn trong lần học sau!`);
      }, 100);
    } catch (error) {
      console.error("Lỗi khi xử lý phạt gian lận: ", error);
      setActiveLesson(null);
    }
  };

  const handlePlaceBet = async (amount) => {
      if (coins < amount) return false;
      const newCoins = coins - amount;
      setCoins(newCoins);
      await updateDoc(doc(db, 'users', user.uid), { coins: newCoins });
      return true;
  };

  const handleGameComplete = async (isWin, correctlyAnsweredWords, gameType, betAmount = 0) => {
    const todayStr = new Date().toDateString();
    let newScore = Number(totalScore);
    let newCoins = Number(coins);
    let newDailyGames = dailyGamesPlayed + 1;
    let newTotalGames = totalGamesPlayed + 1;
    let earnedScore = 0;
    let rewardCoins = 0;

    if (isWin) {
      earnedScore = 1;
      rewardCoins = betAmount > 0 ? (betAmount * 2) : 2; 
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
       if (betAmount > 0) alert(`🎰 THẮNG CƯỢC! Bạn đã nhân đôi tài sản, nhận về ${rewardCoins} Coins và +1 Điểm học tập!`);
       else alert(`🎮 Chiến thắng! Bạn nhận được +1 Điểm, +2 Coins.`);
    } else {
       if (betAmount > 0) alert(`💀 THUA CƯỢC! Bạn đã mất trắng ${betAmount} Coins tiền cược.`);
       else alert(`💀 Game Over!`);
    }
  };

  const getLearnedVocab = () => {
    let vocabPool = [];
    courseData.forEach(day => {
      if (day.id < unlockedDay && day.vocabulary && day.vocabulary.length > 0) {
          vocabPool = [...vocabPool, ...day.vocabulary];
      }
    });
    
    let safeWP = {};
    try {
       safeWP = (wordProgress && typeof wordProgress === 'object' && !Array.isArray(wordProgress)) ? wordProgress : {};
    } catch (e) {}

    return vocabPool.filter(v => {
       if (!v || !v.word) return false;
       const w = String(v.word).toLowerCase();
       return (safeWP[w] || 0) < 4;
    });
  };

  const completedLessons = unlockedDay > 1 ? unlockedDay - 1 : 0;
  
  let wordsMasteredCount = 0;
  let masteredWordsList = [];
  try {
     const safeWP = (wordProgress && typeof wordProgress === 'object' && !Array.isArray(wordProgress)) ? wordProgress : {};
     masteredWordsList = Object.entries(safeWP).filter(([w, c]) => typeof c === 'number' && c >= 4);
     wordsMasteredCount = masteredWordsList.length;
  } catch (err) {}

  const achievementsList = [
    { id: "streak_7", title: "Khởi động", desc: "Đăng nhập liên tục 7 ngày", achieved: streak >= 7, rewardCoins: 20, icon: "🔥", color: "text-orange-500", bg: "bg-orange-50", iconBg: "bg-white", border: "border-orange-100" },
    { id: "streak_30", title: "Thói quen", desc: "Đăng nhập liên tục 30 ngày", achieved: streak >= 30, rewardCoins: 100, icon: "🔥", color: "text-red-500", bg: "bg-red-50", iconBg: "bg-white", border: "border-red-100" },
    { id: "streak_50", title: "Bền bỉ", desc: "Đăng nhập liên tục 50 ngày", achieved: streak >= 50, rewardCoins: 300, icon: "🔥", color: "text-rose-500", bg: "bg-rose-50", iconBg: "bg-white", border: "border-rose-100" },
    { id: "streak_80", title: "Kỷ luật thép", desc: "Đăng nhập liên tục 80 ngày", achieved: streak >= 80, rewardCoins: 500, icon: "💎", color: "text-cyan-500", bg: "bg-cyan-50", iconBg: "bg-white", border: "border-cyan-100" },
    
    { id: "lessons_10", title: "Chăm chỉ", desc: "Hoàn thành 10 bài học", achieved: completedLessons >= 10, rewardCoins: 40, icon: "📝", color: "text-blue-500", bg: "bg-blue-50", iconBg: "bg-white", border: "border-blue-100" },
    { id: "lessons_24", title: "Băng rừng", desc: "Hoàn thành 24 bài (Nửa khóa)", achieved: completedLessons >= 24, rewardCoins: 200, icon: "⏳", color: "text-indigo-500", bg: "bg-indigo-50", iconBg: "bg-white", border: "border-indigo-100" },
    { id: "lessons_48", title: "Học giả", desc: "Tốt nghiệp toàn bộ 48 bài", achieved: completedLessons >= 48, rewardCoins: 500, icon: "🎓", color: "text-purple-600", bg: "bg-purple-50", iconBg: "bg-white", border: "border-purple-100" },
    
    { id: "words_50", title: "Tân binh", desc: "Làm chủ 50 từ vựng", achieved: wordsMasteredCount >= 50, rewardCoins: 30, icon: "🧠", color: "text-fuchsia-500", bg: "bg-fuchsia-50", iconBg: "bg-white", border: "border-fuchsia-100" },
    { id: "words_100", title: "Trí nhớ tốt", desc: "Làm chủ 100 từ vựng", achieved: wordsMasteredCount >= 100, rewardCoins: 100, icon: "📚", color: "text-indigo-500", bg: "bg-indigo-50", iconBg: "bg-white", border: "border-indigo-100" },
    { id: "words_250", title: "Từ điển sống", desc: "Làm chủ 250 từ vựng", achieved: wordsMasteredCount >= 250, rewardCoins: 300, icon: "👑", color: "text-amber-500", bg: "bg-amber-50", iconBg: "bg-white", border: "border-amber-100" },
    
    { id: "games_10", title: "Game Thủ", desc: "Thắng mini-game 10 lần", achieved: totalGamesPlayed >= 10, rewardCoins: 20, icon: "🎮", color: "text-emerald-500", bg: "bg-emerald-50", iconBg: "bg-white", border: "border-emerald-100" },
    { id: "games_30", title: "Kẻ hủy diệt", desc: "Thắng mini-game 30 lần", achieved: totalGamesPlayed >= 30, rewardCoins: 100, icon: "⚔️", color: "text-teal-600", bg: "bg-teal-50", iconBg: "bg-white", border: "border-teal-100" },
    { id: "games_60", title: "Cao thủ", desc: "Thắng mini-game 60 lần", achieved: totalGamesPlayed >= 60, rewardCoins: 200, icon: "🔥", color: "text-orange-600", bg: "bg-orange-50", iconBg: "bg-white", border: "border-orange-100" },
    { id: "games_100", title: "Thần thoại", desc: "Thắng mini-game 100 lần", achieved: totalGamesPlayed >= 100, rewardCoins: 500, icon: "👑", color: "text-yellow-500", bg: "bg-yellow-50", iconBg: "bg-white", border: "border-yellow-100" },
    { id: "games_200", title: "Huyền thoại", desc: "Thắng mini-game 200 lần", achieved: totalGamesPlayed >= 200, rewardCoins: 1000, icon: "🌟", color: "text-amber-500", bg: "bg-amber-50", iconBg: "bg-white", border: "border-amber-100" },
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
       cost = 20 * Math.pow(2, shopStats.immortalBoughtCount || 0);
    }

    if (key === 'hints') {
        if (newShopStats.dailyHintBought >= 3) return alert("❌ Bạn đã mua tối đa 3 Thẻ Gợi ý trong hôm nay! Hãy quay lại vào ngày mai hoặc mở Gacha để kiếm thêm.");
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
    if (key === 'hints') {
       newShopStats.dailyHintBought = (newShopStats.dailyHintBought || 0) + 1;
    }

    alert(`✅ Mua thành công: ${itemName}`);

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { coins: newCoins, inventory: newInv, shopStats: newShopStats });
    
    setCoins(newCoins);
    setInventory(newInv);
    setShopStats(newShopStats);
  };

  const handleExchangePoints = async () => {
     if (exchangeStats.dailyCount >= 10) return alert("Hôm nay bạn đã đổi tối đa 10 lần rồi. Hãy quay lại vào ngày mai!");
     if (exchangeStats.monthlyCount >= 50) return alert("Tháng này bạn đã đổi tối đa 50 lần rồi. Vui lòng chờ đến tháng sau!");
     if (totalScore < 1) return alert("Bạn không có Điểm để đổi!");

     const confirm = window.confirm("Xác nhận đổi 1 Điểm học tập lấy 10 Coins?");
     if (!confirm) return;

     const newScore = totalScore - 1;
     const newCoins = coins + 10;
     const newExStats = {
        ...exchangeStats,
        dailyCount: exchangeStats.dailyCount + 1,
        monthlyCount: exchangeStats.monthlyCount + 1
     };

     await updateDoc(doc(db, 'users', user.uid), { score: newScore, coins: newCoins, exchangeStats: newExStats });
     setTotalScore(newScore);
     setCoins(newCoins);
     setExchangeStats(newExStats);
     alert("💰 Quy đổi thành công! +10 Coins.");
  };

  const gachaItems = [
    { id: 'hint', icon: '💡', label: "Thẻ Gợi ý", bg: "bg-yellow-50", border: "border-yellow-400", text: "text-yellow-700", isPremium: false },
    { id: 'ticket', icon: '🎟️', label: "Vé Chơi Game", bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-700", isPremium: false },
    { id: 'coins', icon: '💰', label: "50 Coins", bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-700", isPremium: false },
    { id: 'jackpot', icon: '🎯', label: "+5 ĐIỂM", bg: "bg-gradient-to-br from-red-100 to-orange-100", border: "border-red-500", text: "text-red-700", isPremium: true },
    { id: 'immortal', icon: '🛡️', label: "Thẻ Bất Tử", bg: "bg-gradient-to-br from-purple-100 to-fuchsia-100", border: "border-purple-500", text: "text-purple-700", isPremium: true },
    { id: 'super_jackpot', icon: '💎', label: "500 Coins", bg: "bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500", border: "border-yellow-200", text: "text-white", isPremium: true }
  ];

  const handleSpinGacha = async () => {
    let useTicket = (inventory.gachaTickets || 0) > 0;
    if (!useTicket && coins < 25) return alert("Bạn không đủ 25 Coins hoặc Vé để quay!");
    
    let newCoins = Number(coins);
    let newInv = { ...inventory };

    if (useTicket) newInv.gachaTickets -= 1;
    else newCoins -= 25;

    setCoins(newCoins);
    setInventory(newInv);
    setIsSpinning(true);
    setGachaPrize(null);

    // Tỉ lệ mới: 500 Xu (0.1%), Bất tử (1%), 5 Điểm (5%), Vé (20%), 50 Xu (15%), Hint (58.9%)
    const rand = Math.random();
    let prizeKey = '';
    if (rand < 0.589) prizeKey = 'hint';         
    else if (rand < 0.789) prizeKey = 'ticket';    
    else if (rand < 0.939) prizeKey = 'coins';   
    else if (rand < 0.989) prizeKey = 'jackpot'; 
    else if (rand < 0.999) prizeKey = 'immortal';
    else prizeKey = 'super_jackpot';                 

    const targetIndex = gachaItems.findIndex(i => i.id === prizeKey);
    const baseSpins = 30; 
    const stepsToTarget = (targetIndex - currentSpinIndex + 6) % 6;
    const totalSpins = baseSpins + stepsToTarget;

    let currentStep = 0;
    let tempIndex = currentSpinIndex;

    const spinInterval = setInterval(() => {
      currentStep++;
      tempIndex = (tempIndex + 1) % 6;
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

    if (prizeKey === 'hint') updatedInv.hints = (updatedInv.hints || 0) + 1;
    else if (prizeKey === 'ticket') updatedInv.tickets = (updatedInv.tickets || 0) + 1;
    else if (prizeKey === 'immortal') updatedInv.immortals = (updatedInv.immortals || 0) + 1;
    else if (prizeKey === 'coins') updatedCoins += 50; 
    else if (prizeKey === 'super_jackpot') updatedCoins += 500;
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

  const currentImmortalPrice = 20 * Math.pow(2, shopStats?.immortalBoughtCount || 0);

  const getAnalyticsData = () => {
    const scoresArray = Object.values(lessonScores || {});
    if (scoresArray.length === 0) return { avgEx: 0, avgTest: 0, advice: "Bạn chưa làm bài nào. Hãy bắt đầu ngay!", scoresArray: [] };

    const exScores = scoresArray.filter(s => !s.isTest);
    const testScores = scoresArray.filter(s => s.isTest);

    const avgEx = exScores.length > 0 ? (exScores.reduce((a, b) => a + b.scale10, 0) / exScores.length).toFixed(2) : 0;
    const avgTest = testScores.length > 0 ? (testScores.reduce((a, b) => a + b.scale10, 0) / testScores.length).toFixed(2) : 0;

    let advice = "";
    const { totalVocabFails = 0, totalExerciseFails = 0 } = learningStats || {};
    
    if (totalVocabFails > totalExerciseFails * 1.5) {
      advice = "⚠️ Kỹ năng Từ vựng (Vocabulary): Bạn thường xuyên sai ở trạm kiểm tra từ vựng đầu giờ. Hãy dành thêm thời gian chơi Mini-game để cải thiện bộ nhớ từ vựng nhé!";
    } else if (totalExerciseFails > totalVocabFails * 1.5) {
      advice = "⚠️ Kỹ năng Ngữ pháp & Đọc hiểu (Grammar/Reading): Bạn mắc khá nhiều lỗi trong lúc làm bài tập. Cần cẩn thận hơn và ghi chép lại các cấu trúc đã sai.";
    } else if (avgEx >= 8 && avgTest >= 8) {
      advice = "🌟 Tuyệt vời! Bạn đang phát triển rất cân bằng và vững chắc cả về Từ vựng lẫn Ngữ pháp. Hãy tiếp tục giữ vững phong độ này!";
    } else {
      advice = "📝 Phong độ của bạn đang ở mức trung bình. Hãy phân bổ thời gian đều đặn mỗi ngày để ôn tập lại bài cũ và không được lạm dụng Thẻ Hint nhé.";
    }

    const sortedScores = Object.entries(lessonScores || {}).map(([day, data]) => ({ day, ...data })).sort((a,b) => Number(a.day) - Number(b.day));
    return { avgEx, avgTest, advice, scoresArray: sortedScores };
  };

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
    const isLessonCompleted = activeLesson < unlockedDay;
    const savedAnswers = lessonScores[activeLesson]?.savedAnswers || {};
    const bookmarkedForDay = bookmarks[activeLesson] || [];

    return <Lesson 
              dayData={dayData} 
              prevDayData={prevDayData} 
              isCompleted={isLessonCompleted} 
              savedAnswers={savedAnswers}
              bookmarkedQuestions={bookmarkedForDay}
              onBookmark={handleToggleBookmark}
              onComplete={handleCompleteLesson} 
              onBack={() => setActiveLesson(null)} 
              onCheat={handleCheat} 
              isAdmin={isAdmin} 
              inventory={inventory} 
              consumeItem={consumeItem} 
              onUpdateWordProgress={handleUpdateWordProgress} 
           />;
  }

  if (isPlayingVocab) {
    const learnedVocab = getLearnedVocab();
    return <VocabularyReview learnedVocab={learnedVocab} wordProgress={wordProgress} lastPlayedWords={lastPlayedWords} onBack={() => setIsPlayingVocab(false)} onCompleteGame={handleGameComplete} dailyGamesPlayed={dailyGamesPlayed} isAdmin={isAdmin} onPlaceBet={handlePlaceBet} />;
  }

  const currentDayOfWeek = new Date().getDay();
  const isScheduledToday = schedule ? schedule.includes(currentDayOfWeek) : false;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 relative">
      
      {showDailyReminder && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[120] p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-[50%]"></div>
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-white rounded-full mx-auto border-4 border-indigo-100 flex items-center justify-center text-5xl mb-4 shadow-lg animate-bounce">
                   🚀
                 </div>
                 <h2 className="text-2xl font-black text-gray-800 mb-2">Đến giờ học rồi!</h2>
                 <p className="text-gray-600 font-medium mb-6">Hôm nay bạn có lịch chinh phục <b className="text-indigo-600">Ngày {unlockedDay}</b>. Đừng để lỡ chuỗi Streak rực lửa nhé!</p>
                 <button onClick={() => { setShowDailyReminder(false); setActiveLesson(unlockedDay); }} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:scale-105 transition-all">
                   VÀO HỌC NGAY
                 </button>
                 <button onClick={() => setShowDailyReminder(false)} className="mt-4 text-gray-400 font-bold hover:text-gray-600 transition-colors">Để sau</button>
              </div>
           </div>
         </div>
      )}

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

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 px-4 sm:px-6 py-3 rounded-xl font-black border border-orange-100 flex-1">
            <Flame size={20} /> <span className="text-sm sm:text-lg">Streak: {streak}</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-yellow-50 text-yellow-600 px-4 sm:px-6 py-3 rounded-xl font-black border border-yellow-100 flex-1">
            <Coins size={20} /> <span className="text-sm sm:text-lg">Coin: {coins}</span>
          </div>
          <button onClick={() => setShowAnalytics(true)} className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors px-4 sm:px-6 py-3 rounded-xl font-black border border-indigo-200 flex-1 shadow-sm">
            <PieChart size={20} /> <span className="text-sm sm:text-lg">Theo dõi học tập</span>
          </button>
          <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 sm:px-6 py-3 rounded-xl font-black border border-blue-100 flex-1 relative">
            <Target size={20} /> <span className="text-sm sm:text-lg">Điểm: {totalScore}</span>
            <button onClick={() => setShowRules(true)} className="absolute right-3 text-blue-300 hover:text-blue-600 transition-transform hover:scale-110 hidden sm:block"><Info size={20} /></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <button onClick={() => {
                if (isAdmin || dailyGamesPlayed < 3) setIsPlayingVocab(true);
                else if (inventory.tickets > 0) {
                  if (window.confirm("Bạn đã hết lượt. Dùng 1 Vé chơi game dự phòng để chơi tiếp?")) consumeItem('tickets').then(() => setIsPlayingVocab(true));
                } else alert("Bạn đã hết lượt chơi hôm nay. Hãy điểm danh hoặc kiếm thêm Lượt!");
              }} 
              className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors shadow-sm whitespace-nowrap">
            <Gamepad2 size={20} /> Game Center
          </button>
          <button onClick={() => setShowShop(true)} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-sm whitespace-nowrap">
            <Store size={20} /> Store & Gacha
          </button>
          <button onClick={openNotebook} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm whitespace-nowrap">
            <BookOpen size={20} /> Library
          </button>
          <button onClick={() => setShowVocabMastery(true)} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 rounded-xl font-bold text-white bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors shadow-sm whitespace-nowrap">
            <BrainCircuit size={20} /> Mastered
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

      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {courseData.map((day) => {
          const todayStr = new Date().toDateString();
          const isCompleted = day.id < unlockedDay;
          const isAcademicallyNext = day.id === unlockedDay;
          const hasNotStudiedToday = lastCompletedDate !== todayStr;
          
          const isUnlocked = isAdmin || isCompleted || (isAcademicallyNext && isScheduledToday && hasNotStudiedToday);
          const isWaitingForTomorrow = !isAdmin && isAcademicallyNext && (!isScheduledToday || !hasNotStudiedToday);
          
          // Lấy đúng số lượt redo của BÀI NÀY
          const currentLessonRedo = lessonScores[day.id]?.redoCount || 0;
          const canEarnRedoCoins = isCompleted && currentLessonRedo < 3;
          const maxedRedo = isCompleted && currentLessonRedo >= 3;

          return (
            <button key={day.id} disabled={!isUnlocked} onClick={() => setActiveLesson(day.id)} className={`relative aspect-[4/3] sm:aspect-square p-4 rounded-2xl flex flex-col justify-center items-center border-2 transition-all ${isCompleted && !isAdmin ? 'bg-green-50/50 border-green-500 text-green-700 hover:scale-105 cursor-pointer shadow-sm' : isWaitingForTomorrow ? 'bg-orange-50 border-orange-300 text-orange-600 cursor-not-allowed opacity-80' : !isUnlocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : day.isTest ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md hover:scale-105 animate-pulse' : 'bg-white border-blue-500 text-blue-700 shadow-md hover:scale-105 animate-pulse'}`}>
              
              {isCompleted && !isAdmin && canEarnRedoCoins && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md animate-bounce border-2 border-white flex items-center gap-1 z-10">
                     <Coins size={10}/> +2 Ôn tập
                  </div>
              )}
              {isCompleted && !isAdmin && maxedRedo && (
                  <div className="absolute -top-3 -right-3 bg-gray-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border-2 border-white z-10">
                     Đã xong
                  </div>
              )}

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

      {showAnalytics && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <PieChart size={28}/>
                <h3 className="text-2xl font-black">Bảng Theo Dõi Học Tập</h3>
              </div>
              <button onClick={() => setShowAnalytics(false)} className="hover:bg-black/20 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
               {(() => {
                  const data = getAnalyticsData();
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col items-center justify-center text-center">
                            <span className="text-indigo-400 font-bold uppercase tracking-wider mb-2 text-sm flex items-center gap-2"><TrendingUp size={16}/> Trung bình Bài tập</span>
                            <span className="text-5xl font-black text-indigo-600">{data.avgEx}</span>
                         </div>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col items-center justify-center text-center">
                            <span className="text-purple-400 font-bold uppercase tracking-wider mb-2 text-sm flex items-center gap-2"><Award size={16}/> Trung bình Major Test</span>
                            <span className="text-5xl font-black text-purple-600">{data.avgTest}</span>
                         </div>
                      </div>

                      <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200 mb-8 shadow-sm">
                         <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2"><AlertTriangle size={20}/> Phân Tích Kỹ Năng (AI)</h4>
                         <p className="text-yellow-700 font-medium leading-relaxed">{data.advice}</p>
                      </div>

                      <h4 className="font-black text-gray-800 mb-4 text-xl border-b pb-2">Lịch sử các bài đã làm</h4>
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
                         <table className="w-full text-left min-w-[500px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                               <tr>
                                  <th className="p-4 font-bold text-gray-600">Ngày học</th>
                                  <th className="p-4 font-bold text-gray-600">Thể loại</th>
                                  <th className="p-4 font-bold text-gray-600">Số câu đúng</th>
                                  <th className="p-4 font-bold text-gray-600">Thang điểm 10</th>
                               </tr>
                            </thead>
                            <tbody>
                               {data.scoresArray.length === 0 ? (
                                  <tr><td colSpan="4" className="p-6 text-center text-gray-500 font-medium">Chưa có dữ liệu bài làm.</td></tr>
                               ) : (
                                  data.scoresArray.map((s, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                       <td className="p-4 font-bold text-gray-800">Ngày {s.day} <span className="text-xs text-gray-400 font-normal ml-2">({s.date})</span></td>
                                       <td className="p-4">{s.isTest ? <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Major Test</span> : <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Bài tập</span>}</td>
                                       <td className="p-4 font-medium text-gray-700">{s.score} / {s.total}</td>
                                       <td className="p-4 font-black text-indigo-600">{s.scale10.toFixed(2)}</td>
                                    </tr>
                                  ))
                               )}
                            </tbody>
                         </table>
                      </div>
                    </>
                  );
               })()}
            </div>
          </div>
        </div>
      )}

      {checkinState.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-indigo-600 mb-2">Quà Điểm Danh 🎁</h2>
            <p className="text-gray-600 mb-6 font-medium">Chuỗi điểm danh 7 ngày liên tiếp</p>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
                {[1,2,3,4,5,6,7].map(d => {
                   let isToday = checkinState.day === d;
                   let isPast = checkinState.day > d;
                   
                   let icon = '🪙'; 
                   if (d===2) icon = '💰';
                   if (d>=3 && d<=5) icon = '🎟️'; 
                   if (d===6) icon = '🎲'; 
                   if (d===7) icon = '🛡️'; 

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

      {/* SHOP UI FIX LAYOUT RESPONSIVE HOÀN HẢO */}
      {showShop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-2"><Store size={28} /> Cửa Hàng Vật Phẩm</h3>
                <p className="font-medium text-yellow-100 flex items-center gap-2 mt-1">Sức mua hiện tại: <span className="bg-black/20 px-2 py-1 rounded flex items-center gap-1"><Coins size={16}/> {coins} Coins</span> | <span className="bg-black/20 px-2 py-1 rounded flex items-center gap-1"><Target size={16}/> {totalScore} Điểm</span></p>
              </div>
              <button onClick={() => setShowShop(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col">
              
              {/* TRẠM QUY ĐỔI ĐIỂM SANG XU NẰM FULL WIDTH TRÊN CÙNG */}
              <div className="border-2 border-emerald-400 bg-emerald-50 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500 transition-colors relative overflow-hidden mb-6 shadow-sm w-full">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none"><ArrowRightLeft size={180}/></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm border border-emerald-200"><ArrowRightLeft size={24}/></div>
                       <h4 className="text-xl sm:text-2xl font-black text-emerald-900">Trạm Quy Đổi</h4>
                    </div>
                    <p className="text-sm text-emerald-800 font-medium mb-2">Đổi Điểm học tập lấy Coins (Tỷ giá: 1 Điểm = 10 Coins).</p>
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-emerald-700">
                       <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-emerald-100">Hôm nay: {exchangeStats.dailyCount}/10 lần</span>
                       <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-emerald-100">Tháng này: {exchangeStats.monthlyCount}/50 lần</span>
                    </div>
                  </div>
                  <button onClick={handleExchangePoints} className="w-full md:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-8 rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-transform active:scale-95 flex items-center justify-center gap-2">
                     <Target size={20}/> -1 Điểm <ArrowRightLeft size={16}/> +10 Coins
                  </button>
                </div>
              </div>

              {/* LƯỚI VẬT PHẨM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="border-2 border-red-200 rounded-2xl p-5 flex flex-col justify-between hover:border-red-400 transition-colors bg-red-50/40 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10"><ShieldAlert size={100}/></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-sm border border-red-200"><ShieldAlert size={24}/></div>
                        <span className="bg-white text-gray-700 font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-gray-100">Đang có: {inventory.immortals || 0}</span>
                      </div>
                      <h4 className="text-xl font-black text-red-900 mb-1">Thẻ Bất Tử</h4>
                      <p className="text-xs text-red-700 font-bold mb-4 bg-white/50 p-2 rounded-lg border border-red-100">Chống phạt trừ điểm (Dùng khi đúng >= 60%). Giá x2 sau mỗi lần mua.</p>
                    </div>
                    <button onClick={() => buyItem("Thẻ Bất Tử", currentImmortalPrice, 'immortals')} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black py-3 rounded-xl hover:shadow-lg transition-transform active:scale-95 flex justify-center gap-2 relative z-10"><Coins size={20}/> {currentImmortalPrice} Coins</button>
                  </div>

                  <div className="border-2 border-yellow-200 rounded-2xl p-5 flex flex-col justify-between hover:border-yellow-400 transition-colors bg-yellow-50/40">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shadow-sm border border-yellow-200"><Lightbulb size={24}/></div>
                        <span className="bg-white text-gray-700 font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-gray-100">Đang có: {inventory.hints || 0}</span>
                      </div>
                      <h4 className="text-xl font-black text-yellow-900 mb-1">Thẻ Gợi Ý (Hint)</h4>
                      <p className="text-xs text-yellow-700 font-bold mb-4 bg-white/50 p-2 rounded-lg border border-yellow-100">Loại bỏ 2 đáp án sai (50/50). <br/><span className="text-red-500">Mua: {shopStats.dailyHintBought}/3 lần hôm nay.</span></p>
                    </div>
                    <button onClick={() => buyItem("Thẻ Gợi Ý", 20, 'hints')} className="w-full bg-yellow-600 text-white font-black py-3 rounded-xl hover:bg-yellow-700 transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 20 Coins</button>
                  </div>

                  <div className="border-2 border-blue-200 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400 transition-colors bg-blue-50/40">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-200"><Ticket size={24}/></div>
                        <span className="bg-white text-gray-700 font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-gray-100">Đang có: {inventory.tickets || 0}</span>
                      </div>
                      <h4 className="text-xl font-black text-blue-900 mb-1">Vé Chơi Game</h4>
                      <p className="text-xs text-blue-700 font-bold mb-4 bg-white/50 p-2 rounded-lg border border-blue-100">Cung cấp thêm 1 lượt chơi Minigame khi hết lượt miễn phí.</p>
                    </div>
                    <button onClick={() => buyItem("Vé Chơi Game", 10, 'tickets')} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-transform active:scale-95 flex justify-center gap-2"><Coins size={20}/> 10 Coins</button>
                  </div>
              </div>

              {/* VÒNG QUAY GACHA FULL WIDTH */}
              <div className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center hover:border-purple-500 transition-colors shrink-0 shadow-sm gap-4 w-full">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                     <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-md animate-pulse shrink-0"><Dices size={32}/></div>
                     <div>
                       <h4 className="text-2xl font-black text-purple-900 mb-1">Vòng Quay Nhân Phẩm</h4>
                       <p className="text-sm text-purple-800 font-medium">Cơ hội trúng <b className="text-amber-600">500 Coins VIP</b>, Bất Tử, +5 Điểm và nhiều hơn thế!</p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
                     {(inventory.gachaTickets > 0) && <span className="bg-purple-200 text-purple-800 font-black px-4 py-2 rounded-xl text-sm shadow-inner text-center border border-purple-300">Sẵn sàng: {inventory.gachaTickets} Vé quay</span>}
                     <button onClick={() => {setShowShop(false); setShowGachaModal(true);}} className="w-full bg-purple-600 text-white font-black py-4 px-8 rounded-xl hover:bg-purple-700 shadow-lg hover:shadow-purple-500/40 transition-transform active:scale-95 flex justify-center items-center gap-2 whitespace-nowrap">
                       <PlayCircle size={20}/> MỞ GACHA NGAY
                     </button>
                  </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* GACHA MODAL VỚI HIỆU ỨNG TIER 1 SIÊU ĐẸP CHO 500 COINS */}
      {showGachaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center animate-in zoom-in duration-300 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
            
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2 flex justify-center items-center gap-3">
              <Dices size={36} className="text-purple-600"/> Vòng Quay Gacha
            </h3>
            <p className="text-gray-500 font-bold mb-8 uppercase tracking-wider text-sm bg-gray-100 inline-block px-4 py-1.5 rounded-full shadow-inner">25 Coins hoặc 1 Vé / Lượt</p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
              {gachaItems.map((item, idx) => {
                const isTier1 = item.tier === 1;
                const isTier2 = item.tier === 2;
                const isSelected = currentSpinIndex === idx;
                
                let containerClass = `relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-[3px] transition-all duration-150 w-[30%] sm:w-[28%] aspect-square overflow-hidden `;
                
                if (isSelected) {
                    containerClass += `scale-110 z-10 shadow-2xl ${item.bg} ${item.border} ${item.text} `;
                    if (isTier1) containerClass += `ring-4 ring-yellow-400 ring-offset-2 shadow-[0_0_30px_rgba(234,179,8,0.8)] `;
                    else if (isTier2) containerClass += `ring-2 ring-purple-300 ring-offset-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] `;
                } else {
                    containerClass += `border-gray-200 bg-gray-50 opacity-60 grayscale `;
                    if (isTier1) containerClass += `!opacity-100 grayscale-0 border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)] `; 
                    if (isTier2) containerClass += `!opacity-90 grayscale-0 border-purple-200 `; 
                }

                return (
                  <div key={item.id} className={containerClass}>
                    {isTier1 && <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/30 to-amber-500/30 animate-[spin_3s_linear_infinite] rounded-xl pointer-events-none"></div>}
                    {(isTier1 || isTier2) && (<div className="absolute top-1 right-1 text-yellow-400 animate-pulse drop-shadow-md"><Sparkles size={14}/></div>)}
                    {isSelected && (isTier1 || isTier2) && (<div className="absolute inset-0 bg-white/40 animate-[pulse_0.3s_ease-in-out_infinite] rounded-xl mix-blend-overlay"></div>)}
                    
                    <div className={`text-3xl sm:text-4xl mb-2 transition-transform duration-200 z-10 ${isSelected ? 'scale-125 drop-shadow-lg' : ''}`}>{item.icon}</div>
                    <div className={`font-black text-[10px] sm:text-xs leading-tight text-center z-10 ${isSelected ? 'drop-shadow-sm' : ''} ${isTier1 && !isSelected ? 'text-amber-600' : ''}`}>{item.label}</div>
                  </div>
                );
              })}
            </div>

            {gachaPrize ? (
              <div className="mb-8 animate-in zoom-in duration-300">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Phần thưởng của bạn</p>
                <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl border-2 shadow-xl ${gachaPrize.bg} ${gachaPrize.border} ${gachaPrize.text} relative overflow-hidden`}>
                   {gachaPrize.tier === 1 && <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_ease-in-out_infinite]"></div>}
                   <span className="text-4xl drop-shadow-md relative z-10">{gachaPrize.icon}</span>
                   <span className="text-3xl font-black tracking-tight relative z-10">{gachaPrize.label}</span>
                </div>
              </div>
            ) : (
              <div className="mb-8 h-[94px]"></div> 
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowGachaModal(false)} disabled={isSpinning} className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors">Đóng</button>
              <button onClick={handleSpinGacha} disabled={isSpinning || (!inventory.gachaTickets && coins < 25)} className="flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2 text-lg relative overflow-hidden">
                {isSpinning && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                <span className="relative z-10 flex items-center gap-2">
                  {isSpinning ? 'Đang quay...' : (inventory.gachaTickets || 0) > 0 ? <><Ticket size={22}/> Dùng Vé Gacha</> : <><Coins size={22}/> Quay (25 Coins)</>}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CÁC PHẦN BẢNG ĐIỂM / CHECKIN / PROFILE ĐƯỢC GIỮ NGUYÊN */}
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
                    <div key={idx} className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${ach.achieved ? `border-transparent ${ach.bg} shadow-md hover:-translate-y-1` : 'border-gray-100 bg-white opacity-60 grayscale'}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm ${ach.achieved ? `${ach.iconBg} ${ach.color}` : 'bg-gray-100 text-gray-400'}`}>{ach.icon}</div>
                      <h5 className={`font-black text-lg mb-1 ${ach.achieved ? 'text-gray-800' : 'text-gray-400'}`}>{ach.title}</h5>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed mb-3">{ach.desc}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black shadow-sm ${ach.achieved ? 'bg-white text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>+{ach.rewardCoins} Coins</span>
                      {ach.achieved && <div className="absolute top-4 right-4 text-amber-500 bg-white rounded-full shadow-sm"><CheckCircle2 size={20}/></div>}
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
                  {masteredWordsList.map(([word, count]) => {
                    const displayWord = word ? word.toString().charAt(0).toUpperCase() + word.toString().slice(1) : 'Unknown';
                    return (
                      <div key={word} className="p-4 rounded-xl border border-green-300 shadow-sm flex justify-between items-center bg-white hover:bg-green-50 transition-colors cursor-default">
                        <span className="font-black text-lg text-green-700">{displayWord}</span>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Mastered</span>
                      </div>
                    )
                  })}
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
                  <li><span className="font-bold">-10 đến -20 Điểm:</span> Phạt nặng khi chống đối, lười biếng (số câu đúng cực thấp).</li>
                  <li><span className="font-bold">Phạt thêm:</span> Làm sai bài tập vượt giới hạn, hoặc gian lận mở tab khác.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}