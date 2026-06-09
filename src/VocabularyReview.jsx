// src/VocabularyReview.jsx
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Trophy, BrainCircuit, Skull, ShieldAlert, Crosshair, Swords, HeartCrack, HelpCircle, Play } from 'lucide-react';

function MemoryMatchGame({ learnedVocab, lastPlayedWords, onCompleteGame }) {
  const [showRules, setShowRules] = useState(() => !localStorage.getItem('hideMemoryRules'));
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const [gameWords, setGameWords] = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('playing'); 

  useEffect(() => {
    if (showRules) return;
    const availableVocab = learnedVocab.filter(v => !lastPlayedWords.includes(v.word));
    const pool = availableVocab.length >= 5 ? availableVocab : learnedVocab;
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffledPool.slice(0, 5);
    setGameWords(selected);

    let generatedCards = [];
    selected.forEach((w, index) => {
      generatedCards.push({ id: index, text: w.word, type: 'eng' });
      generatedCards.push({ id: index, text: w.meaning, type: 'vie' });
    });
    generatedCards.sort(() => 0.5 - Math.random());
    setCards(generatedCards);
  }, [learnedVocab, lastPlayedWords, showRules]);

  const handleStartGame = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideMemoryRules', 'true');
    }
    setShowRules(false);
  };

  const handleCardClick = (index) => {
    if (isLocked || flippedIndexes.includes(index) || matchedIds.includes(cards[index].id) || gameState !== 'playing') return;

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.id === card2.id && card1.type !== card2.type) {
        const newMatches = [...matchedIds, card1.id];
        setMatchedIds(newMatches);
        setFlippedIndexes([]);
        setIsLocked(false);

        if (newMatches.length === 5) {
          setGameState('won');
        } else if (nextMoves >= 15) {
          setGameState('lost');
        }
      } else {
        setTimeout(() => {
          setFlippedIndexes([]);
          setIsLocked(false);
          if (nextMoves >= 15) {
            setGameState('lost');
          }
        }, 1000);
      }
    }
  };

  const handleFinish = (isWin) => {
    if (isWin) {
      onCompleteGame(true, gameWords.map(w => w.word));
    } else {
      const matchedWords = gameWords.filter((w, idx) => matchedIds.includes(idx)).map(w => w.word);
      onCompleteGame(false, matchedWords);
    }
  };

  if (showRules) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border max-w-md mx-auto animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3"><HelpCircle size={32}/></div>
          <h3 className="text-2xl font-black text-gray-800">Luật chơi Memory Match</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-3 list-disc list-inside mb-6 font-medium">
          <li>Hệ thống ẩn 5 từ vựng ngẫu nhiên sau 10 ô chữ.</li>
          <li>Lật tuần tự thẻ Tiếng Anh và Nghĩa Tiếng Việt tương ứng để ghép cặp.</li>
          <li>⚠️ <span className="text-red-600 font-bold">RÀNG BUỘC KỶ LUẬT:</span> Tối đa <span className="font-bold text-red-600">15 bước lật thẻ</span>. Quá giới hạn sẽ bị xử <b>Thua</b>.</li>
          <li>💡 Những từ bạn đã ghép trúng vẫn sẽ được cộng vào hệ thống điểm Master.</li>
        </ul>
        <div className="flex items-center gap-2 mb-6 border-t pt-4">
          <input type="checkbox" id="hideRules" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded cursor-pointer"/>
          <label htmlFor="hideRules" className="text-xs sm:text-sm text-gray-500 font-bold cursor-pointer select-none">Không hiển thị lại hướng dẫn này</label>
        </div>
        <button onClick={handleStartGame} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow transition-all"><Play size={18}/> OK - Bắt đầu chơi</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-indigo-700 flex items-center gap-2"><BrainCircuit size={28} /> Memory Match</h2>
          <p className="font-bold text-gray-500 mt-1">Tìm 5 cặp từ tương ứng</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-700 text-sm sm:text-base flex-1 text-center">
            Số bước: <span className={`${moves >= 12 ? 'text-red-600 font-black' : 'text-indigo-600'} text-xl`}>{moves}/15</span>
          </div>
        </div>
      </div>

      {gameState === 'playing' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 mb-8">
          {cards.map((card, index) => {
            const isFlipped = flippedIndexes.includes(index) || matchedIds.includes(card.id);
            const isMatched = matchedIds.includes(card.id);
            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className={`relative w-full aspect-[4/3] rounded-xl font-bold text-sm md:text-base transition-all duration-300 transform ${isFlipped ? 'rotate-0' : 'rotate-y-180 hover:-translate-y-1 hover:shadow-lg'} ${isMatched ? 'bg-green-100 border-2 border-green-500 text-green-700 scale-95 opacity-80 cursor-default' : isFlipped && card.type === 'eng' ? 'bg-blue-50 border-2 border-blue-500 text-blue-700 shadow-md' : isFlipped && card.type === 'vie' ? 'bg-orange-50 border-2 border-orange-500 text-orange-700 shadow-md' : 'bg-indigo-500 border-b-4 border-indigo-700 text-transparent shadow-md'}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center break-words">
                  {isFlipped ? card.text : <BrainCircuit size={32} className="text-indigo-300 opacity-50" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {gameState === 'lost' && (
        <div className="text-center animate-in fade-in zoom-in py-10">
          <div className="inline-block p-6 bg-red-100 rounded-full mb-6"><HeartCrack size={80} className="text-red-600" /></div>
          <h2 className="text-3xl font-black text-red-600 mb-2">Cạn kiệt năng lượng!</h2>
          <p className="text-gray-600 font-bold mb-8 text-lg">Bạn đã vượt quá giới hạn <span className="text-red-600">15 bước đi</span> cho phép.</p>
          <button onClick={() => handleFinish(false)} className="bg-gray-800 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-black shadow-xl transition-transform">Kết thúc (Lưu từ đúng)</button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="text-center animate-in fade-in zoom-in py-10">
          <div className="inline-block p-6 bg-yellow-100 rounded-full mb-6"><Trophy size={80} className="text-yellow-500" /></div>
          <h2 className="text-3xl font-black text-yellow-600 mb-2">Chiến thắng Tuyệt đối!</h2>
          <p className="text-gray-600 font-bold mb-6 text-lg">Hoàn thành xuất sắc thử thách lật thẻ trong <span className="text-indigo-600">{moves}</span> bước.</p>
          <p className="text-green-600 font-black text-xl mb-8">⭐ Bạn được cộng +1 Điểm thưởng!</p>
          <button onClick={() => handleFinish(true)} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-indigo-700 shadow-xl hover:-translate-y-1 transition-transform">Nhận thưởng & Kết thúc</button>
        </div>
      )}
    </div>
  );
}

function ZombieSurvivalGame({ learnedVocab, onCompleteGame }) {
  const [showRules, setShowRules] = useState(() => !localStorage.getItem('hideZombieRules'));
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const [gameState, setGameState] = useState('playing'); 
  const [killed, setKilled] = useState(0);
  const [wrongCount, setWrongCount] = useState(0); // LỖI TỐI ĐA LÀ 10
  const [question, setQuestion] = useState(null);
  
  const [tick, setTick] = useState(0); 
  const [speedLevel, setSpeedLevel] = useState(1);
  const [isWrongFlash, setIsWrongFlash] = useState(false);

  const zombiesRef = useRef([{ id: Date.now(), pos: 0, speed: 0.15 }]);
  const timeRef = useRef(0);
  const spawnTimer = useRef(0);
  
  // CHỈ LƯU NHỮNG TỪ ĐÁNH ĐÚNG ĐỂ TĂNG TIẾN ĐỘ MASTER
  const correctWordsRef = useRef(new Set()); 
  
  // HỆ SỐ NHÂN TỐC ĐỘ: GẤP ĐÔI (x2) MỖI KHI TRẢ LỜI SAI
  const speedMultiplierRef = useRef(1); 

  const generateQuestion = () => {
    const pool = [...learnedVocab];
    const correctWord = pool[Math.floor(Math.random() * pool.length)];

    const others = pool.filter(w => w.word !== correctWord.word).sort(() => 0.5 - Math.random());
    const distractors = others.slice(0, 3).map(w => w.meaning);
    
    const options = [...distractors, correctWord.meaning].sort(() => 0.5 - Math.random());
    setQuestion({ word: correctWord.word, options, correctMeaning: correctWord.meaning });
  };

  useEffect(() => {
    if (showRules || gameState !== 'playing') return;
    generateQuestion();

    const interval = setInterval(() => {
      timeRef.current += 50;
      spawnTimer.current += 50;

      // CÔNG THỨC KHẮC NGHIỆT: (Gốc + Tốc độ theo thời gian) * HỆ SỐ NHÂN PHẠT (Gấp đôi khi sai)
      const currentSpeedLevel = (1 + Math.floor(timeRef.current / 8000) * 0.3) * speedMultiplierRef.current;
      setSpeedLevel(currentSpeedLevel.toFixed(1));

      let isLost = false;
      zombiesRef.current.forEach(z => {
        z.pos += z.speed * currentSpeedLevel;
        if (z.pos >= 90) isLost = true; 
      });

      if (isLost) {
        setGameState('lost');
        clearInterval(interval);
        return;
      }

      if (spawnTimer.current >= 3000) {
        zombiesRef.current.push({ id: Date.now(), pos: 0, speed: 0.1 + Math.random() * 0.1 });
        spawnTimer.current = 0;
      }

      setTick(prev => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, showRules]);

  const handleStartGame = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideZombieRules', 'true');
    }
    setShowRules(false);
  };

  const handleAnswer = (ans) => {
    if (ans === question.correctMeaning) {
      // 1. CHỈ CỘNG NHỮNG TỪ ĐÚNG VÀO DANH SÁCH MASTER
      correctWordsRef.current.add(question.word);

      if (zombiesRef.current.length > 0) {
        let maxPosIdx = 0;
        for (let i = 1; i < zombiesRef.current.length; i++) {
          if (zombiesRef.current[i].pos > zombiesRef.current[maxPosIdx].pos) {
            maxPosIdx = i;
          }
        }
        zombiesRef.current.splice(maxPosIdx, 1); 
      }
      
      const newKilled = killed + 1;
      setKilled(newKilled);
      
      if (newKilled >= 5) {
        setGameState('won'); 
      } else {
        generateQuestion(); 
      }
    } else {
      // 2. TRỪNG PHẠT KHI TRẢ LỜI SAI
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      
      // X2 TỐC ĐỘ DI CHUYỂN CỦA ZOMBIE MỖI LẦN SAI
      speedMultiplierRef.current *= 2; 

      // QUÁ 10 LỖI LÀ THUA NGAY LẬP TỨC
      if (newWrongCount >= 10) {
        setGameState('lost');
      } else {
        setIsWrongFlash(true);
        setTimeout(() => setIsWrongFlash(false), 300);
        generateQuestion();
      }
    }
  };

  const handleFinish = (isWin) => {
    // Trả về Array chứa những từ đã bắn rụng chính xác
    const correctWordsArray = Array.from(correctWordsRef.current);
    onCompleteGame(isWin, correctWordsArray);
  };

  if (showRules) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border max-w-md mx-auto animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-red-100 text-red-600 rounded-full mb-3"><Skull size={32}/></div>
          <h3 className="text-2xl font-black text-gray-800">Luật chơi Zombie Survival</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-3 list-disc list-inside mb-6 font-medium">
          <li>Đàn Zombie liên tục di chuyển áp sát về phía căn cứ (🏠).</li>
          <li>Chọn đúng nghĩa Tiếng Việt để kích hoạt tháp pháo.</li>
          <li>💀 <span className="text-red-600 font-bold">TRỪNG PHẠT TÀN KHỐC:</span> Nếu bạn chọn sai đáp án, lũ Zombie sẽ lập tức <b>TĂNG TỐC ĐỘ GẤP ĐÔI (x2)</b>. Sai tối đa 10 lần.</li>
          <li>💡 Những từ bạn đã bắn rụng chính xác sẽ được cộng vào hệ thống điểm Master.</li>
        </ul>
        <div className="flex items-center gap-2 mb-6 border-t pt-4">
          <input type="checkbox" id="hideZombieRules" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} className="w-4 h-4 text-red-600 rounded cursor-pointer"/>
          <label htmlFor="hideZombieRules" className="text-xs sm:text-sm text-gray-500 font-bold cursor-pointer select-none">Không hiển thị lại hướng dẫn này</label>
        </div>
        <button onClick={handleStartGame} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 shadow transition-all"><Play size={18}/> OK - Sẵn sàng chiến đấu</button>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border transition-colors duration-200 ${isWrongFlash ? 'bg-red-100 border-red-500' : ''}`}>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black text-red-700 flex items-center gap-2"><Skull size={28} /> Zombie Survival</h2>
          <p className="font-bold text-gray-500 mt-1">Bảo vệ khung thành, tiêu diệt 5 Zombie!</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-black text-xl mb-2 flex items-center gap-2 w-fit">
            <Crosshair size={20}/> Kills: {killed}/5
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-sm font-bold flex items-center gap-1 ${speedMultiplierRef.current > 1 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
              <ShieldAlert size={16}/> Tốc độ: x{speedLevel}
            </div>
            <div className="text-sm font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Lỗi: {wrongCount}/10
            </div>
          </div>
        </div>
      </div>

      {gameState === 'playing' && (
        <>
          <div className="relative w-full h-32 bg-gray-800 rounded-xl overflow-hidden border-4 border-gray-900 mb-8 shadow-inner">
            <div className="absolute top-1/2 w-full border-t-2 border-dashed border-gray-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-[10%] bg-blue-900/80 border-l-4 border-blue-500 flex items-center justify-center z-10">
              <span className="text-3xl sm:text-4xl animate-bounce">🏠</span>
            </div>
            {zombiesRef.current.map(z => (
              <div key={z.id} className="absolute top-1/2 -translate-y-1/2 text-3xl sm:text-4xl transition-transform ease-linear" style={{ left: `${z.pos}%` }}>🧟</div>
            ))}
          </div>

          {question && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="text-center mb-6">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Tiêu diệt mục tiêu</span>
                <h3 className="text-3xl font-black text-gray-800 mt-1">"{question.word}"</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(opt)} className="bg-white border-2 border-gray-300 p-4 rounded-xl font-bold text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all hover:-translate-y-1 shadow-sm active:scale-95">{opt}</button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {gameState === 'lost' && (
        <div className="text-center animate-in fade-in zoom-in py-10">
          <div className="inline-block p-6 bg-red-100 rounded-full mb-6"><HeartCrack size={80} className="text-red-600" /></div>
          <h2 className="text-3xl font-black text-red-600 mb-2">Căn cứ đã thất thủ!</h2>
          <p className="text-gray-600 font-bold mb-8 text-lg">Bạn đã mắc {wrongCount} lỗi hoặc Zombie đã tràn vào căn cứ.</p>
          <button onClick={() => handleFinish(false)} className="bg-gray-800 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-black shadow-xl transition-colors">Kết thúc (Lưu từ đúng)</button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="text-center animate-in fade-in zoom-in py-10">
          <div className="inline-block p-6 bg-yellow-100 rounded-full mb-6"><Trophy size={80} className="text-yellow-500" /></div>
          <h2 className="text-3xl font-black text-yellow-600 mb-2">Bảo vệ thành công!</h2>
          <p className="text-gray-600 font-bold mb-6 text-lg">Phản xạ từ vựng của bạn cực kỳ xuất sắc.</p>
          <p className="text-green-600 font-black text-xl mb-8">⭐ Bạn được cộng +1 Điểm thưởng!</p>
          <button onClick={() => handleFinish(true)} className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-red-700 shadow-xl transition-colors">Nhận thưởng & Kết thúc</button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT CHÍNH: MENU HUB
// ==========================================
export default function VocabularyReview({ learnedVocab, onBack, onCompleteGame, lastPlayedWords, dailyGamesPlayed, isAdmin }) {
  const [selectedGame, setSelectedGame] = useState(null);

  if (learnedVocab.length < 5) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Kho từ vựng chưa đủ lớn! 🏗️</h2>
        <p className="text-gray-600 mb-8">Bạn cần hoàn thành thêm các ngày học để tích lũy ít nhất 5 từ vựng mới có thể mở khóa khu vui chơi này.</p>
        <button onClick={onBack} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700">Quay lại Dashboard</button>
      </div>
    );
  }

  if (!selectedGame) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-in fade-in duration-300">
        <button onClick={onBack} className="mb-6 text-blue-500 hover:underline font-bold">← Quay lại Dashboard</button>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-800">Khu Vực Ôn Tập Kỹ Năng 🎮</h2>
          <p className="text-gray-500 font-medium mt-2">Chiến thắng bất kỳ trò chơi nào cũng mang lại cho bạn +1 điểm.</p>
          
          <div className="inline-block mt-5 bg-indigo-100 text-indigo-700 font-black px-6 py-3 rounded-full border-2 border-indigo-200 shadow-inner">
            Lượt chơi còn lại hôm nay: {isAdmin ? 'Vô hạn (Admin Mode)' : `${3 - dailyGamesPlayed}/3`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => setSelectedGame('memory')} className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-400 hover:shadow-xl transition-all text-left flex flex-col justify-between">
            <div>
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><BrainCircuit size={32} className="text-indigo-600" /></div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Memory Match</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Rèn luyện <span className="font-bold text-indigo-500">Trí nhớ không gian</span>. Lật thẻ và ghép 5 cặp từ với số bước giới hạn nghiêm ngặt <b>(Tối đa 15 bước)</b>.</p>
            </div>
          </button>
          
          <button onClick={() => setSelectedGame('zombie')} className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-red-400 hover:shadow-xl transition-all text-left flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Swords size={32} className="text-red-600" /></div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Zombie Survival</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Rèn luyện <span className="font-bold text-red-500">Phản xạ nhạy bén</span>. Trả lời trắc nghiệm thật nhanh để tiêu diệt Zombie trước khi chúng tràn vào nhà. Áp lực thời gian thực.</p>
            </div>
            <Skull size={150} className="absolute -bottom-10 -right-10 text-red-50 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button onClick={() => setSelectedGame(null)} className="mb-4 text-gray-500 hover:text-gray-800 hover:underline font-bold">← Trở về Menu Game</button>
      {selectedGame === 'memory' && <MemoryMatchGame learnedVocab={learnedVocab} lastPlayedWords={lastPlayedWords} onCompleteGame={onCompleteGame} />}
      {selectedGame === 'zombie' && <ZombieSurvivalGame learnedVocab={learnedVocab} onCompleteGame={onCompleteGame} />}
    </div>
  );
}