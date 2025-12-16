export const saveTransactionToSheet = async (transaction: { lydo: string; thu: number; chi: number }) => {
  // Đây là URL Web App của bạn
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxXCEFDDimAAxeDvh06Z__0mVY4x5BC9LcYIbYX__rXWrWmhsB_uEQazu5i08LUToD6/exec";

  try {
    // Sử dụng no-cors để gửi dữ liệu một chiều mà không bị trình duyệt chặn
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    
    // Vì no-cors không trả về kết quả, ta mặc định là thành công nếu không có lỗi mạng
    console.log("Đã gửi lệnh lưu đến Google Sheet");
    return true;
  } catch (error) {
    console.error("Lỗi khi lưu vào Sheet:", error);
    return false;
  }
};
