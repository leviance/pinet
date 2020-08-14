module.exports.register_valid_message = {
  "email_used": "Địa chỉ mail đã được sử dụng",
  "name_account_used": "Tên tài khoản đã đã tồn tại",
  "email_incorrect": "Không thể gửi Mail đến địa chỉ Email của bạn. Vui lòng liên hệ bộ phận hỗ trợ!"
}

module.exports.trans_mails = {
  "subject": "Xác thực tài khoản Pinet",
  "html": (url) => {
    return `<p>Bạn vừa đăng ký tài khoản trên Pinet hãy click vào <a href="${url}">ĐÂY</a> để xác thực tài khoản của bạn. nếu bạn không thực hiện đăng ký tài khoản Pinet vui lòng bỏ qua thư này.</p>`
  }
}