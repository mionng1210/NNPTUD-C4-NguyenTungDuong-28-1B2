# NNPTUD-C4-NguyenTungDuong-28-1B2

## Thông tin sinh viên
- **Họ và tên:** Nguyễn Tùng Dương
- **MSSV:** 2280600526

## Mô tả dự án
Ứng dụng CRUD quản lý Posts và Comments sử dụng JSON Server.

## Tính năng
1. **Xoá mềm (Soft Delete):** Thay vì xoá cứng, dữ liệu được đánh dấu `isDeleted: true`
2. **Hiển thị gạch ngang:** Các item đã xoá mềm được hiển thị với style gạch ngang
3. **ID tự tăng:** Khi tạo mới, ID sẽ tự động bằng `maxId + 1`, lưu dưới dạng chuỗi
4. **CRUD đầy đủ cho Comments:** Thêm, sửa, xoá mềm, khôi phục comments

## Cách chạy
1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy JSON Server:
```bash
npx json-server db.json
```

3. Mở file `test.html` trong trình duyệt

## Cấu trúc file
- `main.js` - Logic JavaScript cho CRUD operations
- `test.html` - Giao diện người dùng
- `db.json` - Database JSON Server