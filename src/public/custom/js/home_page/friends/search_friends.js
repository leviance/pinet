function model_result_search_friends(user_id,avatar,username,address,user_class){
  return `<div class="friend" data-uid="${user_id}">
            <div class="left">
              <div id="avatar-search-friend" class="friend-avatar">
                  <img src="/assets/images/users/${avatar}" alt="">
              </div>
            </div>
            <div class="between">
              <h5 class="name">${username}</h5>
              <p class="address">
                  ${address}
                </p>
              <p class="class-name">
                  ${user_class}
                </p>
            </div>
            <div class="right">
                <div class="btn">Thêm</div>
            </div>
          </div>`
}

function show_result_search_friend(data){
  console.log(data);
  data.forEach(function(item){
    if(item.address == null) item.address = "";
    if(item.age == null) item.age = "";
    if(item.class == null) item.class = "";
    console.log(item._id,item.avatar,item.username,item.address,item.class)
    $('.result-search-friend').append(model_result_search_friends(item._id,item.avatar,item.username,item.address,item.class))
  })
}

function user_search_friends(){
  let key_word = $('#search-friend-input').val().trim();
  
  if(key_word.length == 0) return

  $('.result-search-friend').show();
  $('.result-search-friend .loading').show();

  $.ajax({
    url: `/search-friend-to-add-contact-${key_word}`,
    type: 'GET',
    success: function(msg) {
      $('#search-friend-not-fond').hide();
      $('.result-search-friend .loading').hide();
      show_result_search_friend(msg)
    },
    error: function() {
      $('#search-friend-not-fond').show();
      $('.result-search-friend .loading').hide();
      $('.result-search-friend .friend').remove();
    }
  })

}

$(document).ready(function(){
  // click search
  $('#btn-search-friends').bind('click', function(){
    user_search_friends()
  })

  $('#search-friend-input').bind('keyup', function(event){
    if(event.keyCode == 13) user_search_friends()
  })

  // click cancel
  $('#btn-close-search-friends').bind('click', function(){
    $('.result-search-friend').hide();
    $('.result-search-friend .loading').hide();
  })
})