let convert_timestamp = (time) => {
  let present_time = new Date().getTime()
  let timestamp = new Date(time)
  let re = /^([0-9]+:[0-9]+)/

  if(present_time < time) { 
    console.log("ERROR IN CONVERT TIMESTAMP")
    return
  }

  ts = present_time - time;

  //   second
  ts = ts / 1000
  if(ts < 60){
    // example 09:14 => 9:14
    let string_to_return = timestamp.toTimeString().match(re)[0]
    if(string_to_return[0] == '0') string_to_return = string_to_return.substr(1)
    return string_to_return
  }

  //   minute
  ts = ts / 60
  if(ts < 60){
    let string_to_return = timestamp.toTimeString().match(re)[0]
    if(string_to_return[0] == '0') string_to_return = string_to_return.substr(1)
    return string_to_return
  }

  // hour
  ts = ts / 60
  if(ts < 24){
    let string_to_return = timestamp.toTimeString().match(re)[0]
    if(string_to_return[0] == '0') string_to_return = string_to_return.substr(1)
    return string_to_return
  }

  // day
  if(ts > 24) {
    let timeline = timestamp.toLocaleDateString()
    timeline = timeline.split('/')

    // example 14:14:47 GMT+0700 (Indochina Time) => 14:14 = 14p 14s
    let hour = timestamp.toTimeString().match(re)[0]
    
    return `${hour} ${timeline[1]} Tháng ${timeline[0]}, ${timeline[2]}`
  }
}

module.exports = convert_timestamp