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

module.exports.user_login_mess = {
  name_account_incorrect: "Tài khoản bạn vừa nhập vào không hợp lệ",
  password_incorrect: " Mật khẩu bạn vừa nhập vào không hợp lệ",
  account_not_found: "Không tìm thấy tài khoản của bạn.",
  account_deleted: "Tài khoản của bạn đã bị vô hiệu hóa. Nếu đây là một sự nhầm lẫn vui lòng liên hệ bộ phận hỗ trợ của chúng tôi!",
  account_is_not_authenticated: "Tài khoản của bạn chưa được xác thực, vui lòng kiểm tra Email để xác thực tài khoản!",
  password_wrong: "Mật khẩu không chính xác"
}

module.exports.user_settings = {
  avatar_type_error: "Kiểu file không hợp lệ",
  avatar_size_error: "Kích thước ảnh không hợp lệ, tối đa 10MB",
  unspecified_error: "Đã có lỗi bất ngờ xảy ra nếu còn gặp phải lỗi này xin vui lòng liên hệ bộ phận hỗ trợ của chúng tôi",
  username_error: "Tên người dùng không được chứa ký tự đặc biệt, độ dài tối đa 50 ký tự tối thiểu 1 ký tự",
  email_error: "Email bạn nhập vào không hợp lệ",
  age_error: "Tuôi bạn nhập vào không hợp lệ, chỉ chấp nhận số.",
  address_error: "Địa chỉ bạn vừa nhập vào không hợp lệ",
  class_error: "Lớp bạn nhập vào không hợp lệ",
  update_infor_success: "Cập nhập thông tin thành công",
  email_can_not_change: "Không thể thay đổi email do tài khoản của bạn được nhập bằng Google hoặc Facebook",
  student_can_not_change: "Bạn không thể thay đổi tuổi, lớp, địa chỉ, tên người dùng do bạn đăng nhập với tài khoản sinh viên",
  status_change_email: "Link xác thực đã được gửi đến Email của bạn vui lòng kiểm tra để hoàn tất thay đổi Email.",
  update_infor_error: "Đã có lỗi bất ngờ xảy ra nếu tình trạng này còn xảy ra vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi!",
  subject_to_change_email: "Thay đổi Email tài khoản Pinet.",
  html_to_change_email: (url) => `<p>Bạn vừa thực hiện thay đổi Email trên Pinet hãy click vào <a href="${url}">ĐÂY</a> để tiến hành hay đổi. Nếu không phải do bạn thực hiện để đảm bảo an toàn hãy đổi mật khẩu tài khoản Pinet của bạn. Xin cảm ơn.</p>`
}

module.exports.notifications_content = {
  "receive_request_cotact": (sender_conatct_name) => {
    return `${sender_conatct_name} đã gửi cho bạn 1 lời mời kết bạn!`
  }
}