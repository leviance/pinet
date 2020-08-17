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

module.exports.recover_account_valid_mess = {
  "email_incorrect": "Email bạn nhập vào không đúng vui lòng kiểm tra lại.",
  "recover_account_success": "Mật khẩu mới đã được gửi đến Email của bạn.",
  "verify_code_incorrect": "Mã xác thực không hợp lệ",
  "recover_account_success": "Mật khẩu mới đã được gửi đến Email của bạn.",
  "unknown_error": "Đã có lỗi không xác định xảy ra. Vui lòng liên hệ bộ phận hỗ trợ của chúng tôi để được hỗ trợ."
}

module.exports.send_verify_code_mess = {
  "subject": "Khôi phục tài khoản Pinet",
  "html": (verify_code) => {
    return `<p>Mã xác thực của bạn là : <b>${verify_code}</b></p>
            <br>
            <p><i>Mã này sẽ hết hạn sau 1 giờ</i></p>
            <p><i>Lưu ý không chia sẻ mã này với bất kỳ ai!</i></p>`
  }
}

module.exports.send_new_password = {
  "subject": "Khôi phục tài khoản Pinet",
  "html": (password) => {
    return `<p>Mật khẩu mới của bạn là: <b>${password}</b></p>
            <br>
            <p><i>Để đảm bảo an toàn hãy đỗi mật khẩu sau khi đăng nhập thành công.</i></p>
            <p><i>Lưu ý không chia sẻ mã này với bất kỳ ai!</i></p>`
  }
}