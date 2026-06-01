# 🚀 English Tracker: Website Cá Nhân Hóa Tự Học Tiếng Anh 
<img width="2121" height="1172" alt="image" src="https://github.com/user-attachments/assets/50fadb71-a879-4d64-a6ec-70d7dbda9c7b" />

## 🎯 Mục tiêu
Cá nhân hóa lộ trình học tiếng Anh trong 48 ngày với liên kết video YouTube và bài tập kèm theo. Dự án hướng tới việc xây dựng thói quen học tập kỷ luật thông qua các cơ chế kiểm tra từ vựng ngắt quãng, quản lý thời gian học khắt khe và hệ thống điểm thưởng/phạt rõ ràng.

## 🔗 Cách truy cập
1. Truy cập trực tiếp vào đường dẫn trang web: https://english-tracker-sigma.vercel.app/.
2. Tại màn hình chính, nhấp vào nút **Đăng nhập bằng Google**.
3. Sử dụng bất kỳ tài khoản Gmail nào để đăng nhập. Hệ thống sẽ tự động khởi tạo hồ sơ học tập và lưu trữ tiến độ của bạn trên Đám mây.

## ✨ Các tính năng
* **Lộ trình học tập tích hợp:** Mỗi ngày học bao gồm một video bài giảng (nhúng từ YouTube) và bộ bài tập tương ứng (Trắc nghiệm, Đọc hiểu, Viết câu).
* **Kỷ luật thời gian (Time-gating):** Học viên thiết lập cam kết lịch học hàng tuần. Bài học mới chỉ được mở khóa vào đúng ngày có lịch trình đã đăng ký.
* **Lặp lại ngắt quãng (Spaced Repetition):** Bắt buộc gõ đúng danh sách từ vựng của bài ngày hôm trước (Trạm kiểm tra khởi động) trước khi mở khóa nội dung bài mới.
* **Hệ thống Điểm số & Chuỗi ngày (Gamification):**
  * Khởi đầu với **100 điểm** và đếm chuỗi ngày học liên tục (Streak).
  * 🎁 **Thưởng (+5 điểm):** Trả lời đúng 100% bài tập ngay trong lần nộp đầu tiên (One-shot).
  * ⚔️ **Phạt (-5 điểm):** Vắng mặt vào ngày có lịch học hoặc có hành vi gian lận (xem bên dưới).
  * ⚔️ **Phạt (-2 điểm):** Gõ sai từ vựng ngày cũ quá 3 lần hoặc nộp sai bài tập quá 3 lần.
* **Giám thị tự động (Anti-Cheat):** Hệ thống khóa trình duyệt trong lúc làm bài. Nếu học viên chuyển Tab, thu nhỏ cửa sổ, hoặc bấm quay lại/tải lại trang khi chưa nộp bài, hệ thống lập tức hủy bài và phạt 5 điểm.
* **Sổ tay quy tắc:** Tích hợp bảng thông tin (Modal) minh bạch hóa toàn bộ luật cộng/trừ điểm để người học nắm rõ.

## 💻 Công nghệ
* **Frontend:** React.js, Vite, Tailwind CSS (Tùy chỉnh giao diện UI), Lucide React (Icons).
* **Backend (BaaS):** Firebase Authentication (Xác thực người dùng), Cloud Firestore (Cơ sở dữ liệu NoSQL lưu tiến độ theo thời gian thực).
* **Deployment:** Vercel kết hợp với GitHub (Tự động cập nhật code CI/CD).

## ⚙️ Quy trình
1. **Đăng nhập:** Người dùng xác thực thông qua Google Account.
2. **Thiết lập & Tải dữ liệu:** Nếu là người dùng mới, hệ thống yêu cầu ký cam kết lịch học và cấp 100 điểm. Nếu là người dùng cũ, tải toàn bộ dữ liệu (Điểm, Streak, Lộ trình) từ Cloud. Hệ thống đồng thời quét lịch sử để trừ điểm vắng mặt nếu có.
3. **Trạm kiểm tra (Vocab Check):** Vượt qua bài kiểm tra gợi nhớ từ vựng của ngày hôm trước.
4. **Học kiến thức mới:** Xem video (xác nhận đã xem) và làm bộ bài tập dưới sự giám sát của hệ thống Anti-cheat.
5. **Cập nhật tiến độ:** Khi nộp bài, hệ thống tính toán điểm thưởng/phạt, cập nhật trạng thái khóa bài và đồng bộ toàn bộ dữ liệu ngược lên Firestore.

## 📁 Kiến trúc
```text
english-tracker/
├── src/
│   ├── App.jsx         # Component cốt lõi: Auth, Lịch học, Gamification, Time-gating, Anti-cheat xử phạt.
│   ├── Lesson.jsx      # Component bài học: Hiển thị Video, Bài tập, Chấm điểm, Cảm biến Giám thị (Window/Tab tracking).
│   ├── data.js         # CSDL tĩnh: Câu hỏi, Từ vựng, Link YouTube.
│   ├── firebase.js     # Cấu hình kết nối Backend Firebase (Auth & Firestore).
│   ├── index.css       # Cấu hình Tailwind CSS.
│   └── main.jsx        # Điểm neo (Entry point) của React app.
├── .gitignore          # Cấu hình bỏ qua file rác.
├── package.json        # Quản lý metadata và các dependencies.
├── tailwind.config.js  # Tùy chỉnh giao diện.
└── vite.config.js      # Cấu hình biên dịch dự án Vite.
