import React, { useState, useEffect } from 'react';
import { courseData } from './data';
import Lesson from './Lesson';
import { Flame, Lock, CheckCircle2, Calendar, Target } from 'lucide-react';

export default function App() {
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [activeLesson, setActiveLesson] = useState(null);
  
  // STATE MỚI: Lịch học, Điểm số, Thông báo lỗi
  const [schedule, setSchedule] = useState(null); 
  const [totalScore, setTotalScore] = useState(100);
  const [showSetup, setShowSetup] = useState(false);
  const [tempSchedule, setTempSchedule] = useState([]);

  useEffect(() => {
    // 1. Tải Lịch học & Điểm số
    const savedSchedule = localStorage.getItem('eng_schedule');
    const savedScore = localStorage.getItem('eng_score');
    
    if (savedScore) setTotalScore(parseInt(savedScore));
    
    if (!savedSchedule) {
      setShowSetup(true); // Nếu chưa có lịch thì bật màn hình setup lên
      return;
    }
    
    const parsedSchedule = JSON.parse(savedSchedule);
    setSchedule(parsedSchedule);

    // 2. Logic Quét vắng mặt (Chỉ chạy khi đã có lịch)
    const savedDay = localStorage.getItem('eng_unlockedDay');
    if (savedDay) setUnlockedDay(parseInt(savedDay));

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Chuẩn hóa về 0h để tính toán cho chuẩn
    const lastLogin = localStorage.getItem('eng_lastLogin');

    if (lastLogin) {
      let lastDate = new Date(lastLogin);
      lastDate.setHours(0, 0, 0, 0);
      
      let missedDays = 0;
      // Vòng lặp quét từ ngày login cuối cùng đến hôm qua
      let checkDate = new Date(lastDate);
      checkDate.setDate(checkDate.getDate() + 1);

      while (checkDate < today) {
        // Nếu ngày đó nằm trong lịch học mà bạn không vào -> Bỏ bữa
        if (parsedSchedule.includes(checkDate.getDay())) {
          missedDays++;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }

      if (missedDays > 0) {
        const penalty = missedDays * 5;
        let newScore = parseInt(savedScore || 100) - penalty;
        if (newScore < 0) newScore = 0;
        
        setTotalScore(newScore);
        localStorage.setItem('eng_score', newScore);
        alert(`CẢNH BÁO BỎ HỌC!\nBạn đã vắng mặt ${missedDays} buổi theo lịch trình.\nHệ thống trừ của bạn ${penalty} điểm tích lũy!`);
      }
    }
    
    localStorage.setItem('eng_lastLogin', today.toDateString());
  }, []);

  // HÀM LƯU LỊCH HỌC
  const saveSchedule = () => {
    if (tempSchedule.length === 0) {
      alert("Bạn phải chọn ít nhất 1 ngày học trong tuần!");
      return;
    }
    localStorage.setItem('eng_schedule', JSON.stringify(tempSchedule));
    localStorage.setItem('eng_score', 100); // Khởi tạo 100 điểm
    localStorage.setItem('eng_lastLogin', new Date().toDateString());
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

  // XỬ LÝ KHI HOÀN THÀNH BÀI (Tính điểm)
  const handleCompleteLesson = (dayId, vocabFailCount, exerciseFailCount) => {
    let penalty = 0;
    let message = "Chúc mừng bạn đã hoàn thành bài học!";

    if (vocabFailCount > 3) {
      penalty += 2;
      message += `\n- Bị trừ 2 điểm vì sai từ vựng ${vocabFailCount} lần.`;
    }
    if (exerciseFailCount > 3) {
      penalty += 2;
      message += `\n- Bị trừ 2 điểm vì nộp sai bài ${exerciseFailCount} lần.`;
    }

    if (penalty > 0) {
      let newScore = totalScore - penalty;
      if (newScore < 0) newScore = 0;
      setTotalScore(newScore);
      localStorage.setItem('eng_score', newScore);
      alert(message);
    } else {
      alert(message + "\nTuyệt vời! Không bị trừ điểm nào.");
    }

    if (dayId === unlockedDay && dayId < 48) {
      const nextDay = dayId + 1;
      setUnlockedDay(nextDay);
      localStorage.setItem('eng_unlockedDay', nextDay);
    }
    setActiveLesson(null);
  };

  // MÀN HÌNH SETUP LỊCH HỌC LẦN ĐẦU
  if (showSetup) {
    const days = [
      { id: 1, name: 'Thứ 2' }, { id: 2, name: 'Thứ 3' }, { id: 3, name: 'Thứ 4' },
      { id: 4, name: 'Thứ 5' }, { id: 5, name: 'Thứ 6' }, { id: 6, name: 'Thứ 7' }, { id: 0, name: 'Chủ Nhật' }
    ];
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Chọn lịch học hàng tuần ✍️</h2>
          <p className="text-gray-600 mb-6">Khởi điểm Miu có 100 điểm.</p>
          <p className="text-gray-600 mb-6">Nếu ngày nào không học thì sẽ bị trừ 5 điểm. Làm bài tập sai quá 3 lần trừ 2 điểm.</p>
          <p className="text-gray-600 mb-6">Nếu hoàn thành mà trên 90 điểm thì sẽ được thưởng LỚN.</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {days.map(d => (
              <button 
                key={d.id} 
                onClick={() => toggleDay(d.id)}
                className={`p-3 rounded border-2 font-bold ${tempSchedule.includes(d.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600'}`}
              >
                {d.name}
              </button>
            ))}
          </div>
          <button onClick={saveSchedule} className="w-full bg-black text-white py-3 rounded-lg font-bold">Xác nhận lịch học</button>
        </div>
      </div>
    );
  }

  if (activeLesson) {
    const dayData = courseData.find(d => d.id === activeLesson);
    const prevDayData = activeLesson > 1 ? courseData.find(d => d.id === activeLesson - 1) : null;
    return <Lesson dayData={dayData} prevDayData={prevDayData} onComplete={handleCompleteLesson} onBack={() => setActiveLesson(null)} />;
  }

  // LOGIC KHÓA THEO LỊCH HỌC TRONG NGÀY
  const currentDayOfWeek = new Date().getDay();
  const isScheduledToday = schedule ? schedule.includes(currentDayOfWeek) : false;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Tiếng Anh giúp Miu nhìn ra thế giới</h1>
            <p className="text-gray-500 mt-1">
              {isScheduledToday ? "🟢 Hôm nay có lịch học. Cố lên!" : "🔴 Hôm nay không có lịch học. Bài giảng bị khóa."}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold border border-blue-200">
              <Target size={24} className="text-blue-500" />
              <span>{totalScore}/100 Điểm</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {courseData.map((day) => {
            const isAcademicallyUnlocked = day.id <= unlockedDay;
            // Chỉ mở bài nếu học thuật cho phép VÀ hôm nay là ngày có lịch
            const isUnlocked = isAcademicallyUnlocked && isScheduledToday && day.id === unlockedDay;
            const isCompleted = day.id < unlockedDay;
            const isTest = day.isTest;

            return (
              <button
                key={day.id}
                disabled={!isUnlocked}
                onClick={() => setActiveLesson(day.id)}
                className={`
                  relative p-4 h-32 rounded-xl flex flex-col justify-center items-center border-2 transition-all
                  ${isCompleted ? 'bg-green-50 border-green-500 text-green-700' : 
                    !isUnlocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 
                    isTest ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md hover:scale-105 animate-pulse' : 
                    'bg-white border-blue-500 text-blue-700 shadow-md hover:scale-105 animate-pulse'}
                `}
              >
                {!isUnlocked && !isCompleted && <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-300" />}
                {!isScheduledToday && isAcademicallyUnlocked && !isCompleted && <Calendar className="absolute top-2 right-2 w-4 h-4 text-orange-400" />}
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