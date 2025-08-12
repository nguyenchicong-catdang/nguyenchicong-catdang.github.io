## Hướng dẫn cài đặt Bun trong môi trường .github.dev (Codespaces)

### 1. Chạy lệnh cài đặt Bun trên terminal

### Đảm bảo đã cài đặt unzip
```bash
sudo apt update
sudo apt install unzip -y
```

Sử dụng các lệnh sau trong terminal của Codespaces (.github.dev):

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun --version
```

### 2. Nếu không nhận được lệnh `bun`

Kiểm tra lại đường dẫn cài đặt Bun:

```bash
echo $PATH
ls ~/.bun/bin
```

Nếu thư mục `~/.bun/bin` có file thực thi `bun`, nhưng vẫn chưa chạy được, hãy thêm Bun vào PATH:

```bash
export PATH="$HOME/.bun/bin:$PATH"
```

Bạn có thể thêm dòng trên vào file `~/.bashrc` để tự động nhận PATH khi mở terminal mới:

```bash
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Kiểm tra lại

Chạy kiểm tra phiên bản để chắc chắn Bun đã được cài:

```bash
bun --version
```

---

**Lưu ý:**  
- Nếu gặp lỗi, kiểm tra lại kết nối mạng và thử khởi động lại terminal.  
- Bun chỉ hỗ trợ trên Ubuntu 22.04 trở lên (Codespaces thường dùng Ubuntu 22.04 hoặc 24.04).

Ảnh minh họa:  
![Hướng dẫn cài đặt Bun trong .github.dev](attachment:image1)