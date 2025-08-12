# code chính
## xem branch
git status
## tạo nhánh chuyển qua nhánh
git checkout -b ten-nhanh
## đẩy nhánh lên
git push origin <ten-branch>
## git clone vào một thư mục chỉ định
git clone <repo-url> <tên-thư-mục>



# code xử lý
## xóa clone
rm -rf mvc
## git clone đọc tài liệu
git clone <repo-url>
## git clone đọc tài liệu với 1 nhánh cụ thể
git clone -b <tên-branch> <repo-url>

### xử lý khi đã push
Thêm thư mục vào file .gitignore

Ví dụ, thư mục bạn muốn ignore tên là response
response/

Xóa thư mục đó khỏi repo (theo dõi của git), nhưng giữ lại trên máy
git rm -r --cached response

Commit thay đổi .gitignore và việc xóa tracking

git add .gitignore
git commit -m "Bỏ qua thư mục response bằng .gitignore"

Push lên repo

git push
