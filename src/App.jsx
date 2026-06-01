// src/App.jsx
import React, { useState, useEffect } from 'react';
import { courseData } from './data';
import Lesson from './Lesson';
import { Flame, Lock, CheckCircle2, Calendar, Target, LogOut } from 'lucide-react';
// IMPORT FIREBASE
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  // STATE ĐĂNG NHẬP
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // STATE HỌC TẬP
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [activeLesson, setActiveLesson] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [totalScore, setTotalScore] = useState(100);
  const [showSetup, setShowSetup] = useState(false);
  const [tempSchedule, setTempSchedule] = useState([]);
  const [streak, setStreak] = useState(0);
  const [calendarDay, setCalendarDay] = useState(1);

  // ==========================================
  // 1. LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP
  // ==========================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser.uid);
      } else {
        setLoading(false); // Chưa đăng nhập -> tắt loading hiện nút Login
      }
    });
    return unsubscribe;
  }, []);

  // ==========================================
  // 2. TẢI DỮ LIỆU TỪ CLOUD HOẶC TẠO MỚI
  // ==========================================
  const loadUserData = async (uid) => {
    setLoading(true);
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    const todayStr = new Date().toDateString();

    if (docSnap.exists()) {
      // ĐÃ CÓ DATA -> TẢI VỀ
      const data = docSnap.data();
      setUnlockedDay(data.unlockedDay || 1);
      setTotalScore(data.score !== undefined ? data.score : 100);
      setStreak(data.streak || 0);

      if (data.schedule) {
        setSchedule(data.schedule);
        // Xử lý Logic Quét Vắng mặt
        handleMissedDays(data, userRef, todayStr);
      } else {
        setShowSetup(true); // Có data nhưng chưa setup lịch
      }
      
      // Xử lý Lịch Thời gian thực tế (Calendar Day)
      if(data.startDate){
         const startDate = new Date(data.startDate);
         const currentDate = new Date(todayStr);
         const diffTimeCalendar = currentDate - startDate;
         const diffDaysCalendar = Math.floor(diffTimeCalendar / (1000 * 60 * 60 * 24)) + 1;
         setCalendarDay(diffDaysCalendar);
      }

    } else {
      // USER MỚI TINH -> TẠO HỒ SƠ LÊN CLOUD
      await setDoc(userRef, {
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        unlockedDay: 1,
        score: 100,
        streak: 1,
        startDate: todayStr,
        lastLogin: todayStr,
        createdAt: new Date()
      });
      setShowSetup(true);
      setCalendarDay(1);
      setStreak(1);
    }
    setLoading(false);
  };

  // ==========================================
  // 3. LOGIC XỬ LÝ VẮNG MẶT
  // ==========================================
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

      // Cập nhật Streak
      if (diffDaysStreak === 1) {
        newStreak += 1;
        needsUpdate = true;
      } else if (diffDaysStreak > 1) {
        newStreak = 0;
        needsUpdate = true;
      }

      // Quét ngày nghỉ (Chỉ trừ nếu chưa check in hôm nay)
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

    // Luôn cập nhật lastLogin
    await updateDoc(userRef, {
      lastLogin: todayStr,
      ...(needsUpdate && { streak: newStreak, score: newScore })
    });

    setStreak(newStreak);
    setTotalScore(newScore);
  };


  // ==========================================
  // 4. CÁC HÀM TƯƠNG TÁC NGƯỜI DÙNG
  // ==========================================
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
    let message = "Chúc mừng bạn đã hoàn thành bài học!";

    if (vocabFailCount > 3) { penalty += 2; message += `\n- Bị trừ 2 điểm vì sai từ vựng ${vocabFailCount} lần.`; }
    if (exerciseFailCount > 3) { penalty += 2; message += `\n- Bị trừ 2 điểm vì nộp sai bài ${exerciseFailCount} lần.`; }

    let newScore = totalScore - penalty;
    if (newScore < 0) newScore = 0;

    const nextDay = (dayId === unlockedDay && dayId < 48) ? dayId + 1 : unlockedDay;

    // ĐẨY KẾT QUẢ LÊN CLOUD
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      score: newScore,
      unlockedDay: nextDay
    });

    setTotalScore(newScore);
    setUnlockedDay(nextDay);
    setActiveLesson(null);
    alert(penalty > 0 ? message : message + "\nTuyệt vời! Không bị trừ điểm nào.");
  };

  // ==========================================
  // 5. RENDER GIAO DIỆN
  // ==========================================
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Đang tải dữ liệu từ Đám mây...</div>;
  }

  // NẾU CHƯA ĐĂNG NHẬP
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
          <h1 className="text-3xl font-black mb-2 text-indigo-700">English 48 Days Challenge</h1>
          <p className="text-gray-500 mb-8">Nền tảng học Tiếng Anh cá nhân hóa.</p>
          <button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2">
             Đăng nhập bằng Google
          </button>
        </div>
      </div>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP NHƯNG CHƯA SET LỊCH
  if (showSetup) {
    const days = [
      { id: 1, name: 'Thứ 2' }, { id: 2, name: 'Thứ 3' }, { id: 3, name: 'Thứ 4' },
      { id: 4, name: 'Thứ 5' }, { id: 5, name: 'Thứ 6' }, { id: 6, name: 'Thứ 7' }, { id: 0, name: 'Chủ Nhật' }
    ];
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Ký cam kết kỷ luật ✍️</h2>
          <p className="text-gray-600 mb-6">Hãy chọn các ngày bạn sẽ học trong tuần. Trượt ngày nào trừ 5 điểm ngày đó. Khởi điểm 100 điểm.</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {days.map(d => (
              <button key={d.id} onClick={() => toggleDay(d.id)} className={`p-3 rounded border-2 font-bold ${tempSchedule.includes(d.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                {d.name}
              </button>
            ))}
          </div>
          <button onClick={saveSchedule} className="w-full bg-black text-white py-3 rounded-lg font-bold">Xác nhận lịch học</button>
        </div>
      </div>
    );
  }

  // RENDER BÀI HỌC (Nếu có chọn)
  if (activeLesson) {
    const dayData = courseData.find(d => d.id === activeLesson);
    const prevDayData = activeLesson > 1 ? courseData.find(d => d.id === activeLesson - 1) : null;
    return <Lesson dayData={dayData} prevDayData={prevDayData} onComplete={handleCompleteLesson} onBack={() => setActiveLesson(null)} />;
  }

  // RENDER MÀN HÌNH CHÍNH
  const currentDayOfWeek = new Date().getDay();
  const isScheduledToday = schedule ? schedule.includes(currentDayOfWeek) : false;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Chào {user.displayName} 👋</h1>
            <p className="text-gray-500 mt-1">
              {isScheduledToday ? "🟢 Hôm nay có lịch học. Cố lên!" : "🔴 Hôm nay không có lịch học. Nghỉ ngơi nhé."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-bold">
              <Flame size={20} /> <span>{streak} Streak</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold">
              <Target size={20} /> <span>{totalScore}/100</span>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors" title="Đăng xuất">
              <LogOut size={24} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {courseData.map((day) => {
            const isAcademicallyUnlocked = day.id <= unlockedDay;
            const isTimeUnlocked = day.id <= calendarDay;
            const isUnlocked = isAcademicallyUnlocked && isTimeUnlocked && isScheduledToday && day.id === unlockedDay;
            const isCompleted = day.id < unlockedDay;
            const isWaitingForTomorrow = isAcademicallyUnlocked && !isTimeUnlocked;
            const isTest = day.isTest;

            return (
              <button
                key={day.id}
                disabled={!isUnlocked}
                onClick={() => setActiveLesson(day.id)}
                className={`
                  relative p-4 h-32 rounded-xl flex flex-col justify-center items-center border-2 transition-all
                  ${isCompleted ? 'bg-green-50 border-green-500 text-green-700' : 
                    isWaitingForTomorrow ? 'bg-orange-50 border-orange-300 text-orange-600 cursor-not-allowed opacity-80' :
                    !isUnlocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 
                    isTest ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md hover:scale-105 animate-pulse' : 
                    'bg-white border-blue-500 text-blue-700 shadow-md hover:scale-105 animate-pulse'}
                `}
              >
                {!isUnlocked && !isCompleted && !isWaitingForTomorrow && <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-300" />}
                {!isScheduledToday && isAcademicallyUnlocked && !isCompleted && !isWaitingForTomorrow && <Calendar className="absolute top-2 right-2 w-4 h-4 text-orange-400" />}
                {isWaitingForTomorrow && <Calendar className="absolute top-2 right-2 w-5 h-5 text-orange-400" title="Chờ ngày mai" />}
                {isCompleted && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />}
                
                <span className="text-sm font-semibold opacity-80">{isTest ? 'MAJOR TEST' : 'DAY'}</span>
                <span className="text-3xl font-black">{day.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}