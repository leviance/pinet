const settings_model = require('../models/settings.model');

const get_list_settings = (user_id) => {
    return new Promise( async (resolve, reject) => {
        let list_settings = await settings_model.get_list_settings(user_id);

        return resolve(list_settings);
    })
}

const user_change_view_mode = async (user_id) => {
    let mode_user_choose = "";

    let list_settings = await settings_model.get_list_settings(user_id);

    let app_mode = list_settings.app_mode;

    if(app_mode == "dark") mode_user_choose = "light";
    if(app_mode == "light") mode_user_choose = "dark";

    settings_model.user_change_view_mode(user_id, mode_user_choose);
}

module.exports = {
    get_list_settings,
    user_change_view_mode
}