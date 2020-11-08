const {setting_services} = require('../services/index');

const user_change_view_mode = (req, res) => {
    try {
        let user_id = req.session.user_id;
        setting_services.user_change_view_mode(user_id);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = {
    user_change_view_mode
}