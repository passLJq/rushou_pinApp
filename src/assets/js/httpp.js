export var httpp = function (data) {
  var method=data.method||'get'
  var newheader=''
  if(data.headers){
      newheader={
          "Authorization": getname('SessionKey'),
          "Content-Type": 'application/json; charset=utf-8'
      }
    }
  if(openapp){
    var lodata={}
    if(method=="get"){
      lodata={
          values:data.data
      }
    }else if(method=="post"){
      lodata={
          body:data.data
      }
    }
    return new Promise((resolve, rejected) => {
      api.ajax({
        url:data.url,
        method: method,
        data:lodata,
        headers:newheader,
        dataType:data.dataType||'json'
      },function(ret, err){
        if (ret) {
          resolve(ret)
        } else {
          if(err.statusCode=='403'){
            api.removePrefs({ key:'SessionUserID'})
            api.removePrefs({ key:'SessionName'})
            api.removePrefs({ key:'SessionKey'})
            api.removePrefs({ key:'SessionShopID'})
            api.setPrefs({ key:'loginStatus',value:'loginFail'})//过期清除信息
            api.openWin({
              name: 'login',
              url: api.wgtRootDir+'/login.html',
              bgColor:'#fff'
            })
          }
          if (err.statusCode == '503') {
            promptMsg('当前访问峰值过高，请稍候再试...')
          } else {
            promptMsg(err.Msg)
          }
          rejected(err)
        }
      })
    })
  }else{
    // console.log(method)
    if(method!='get'){
      return new Promise((res, rej) => {
        axios({
          method:method,
          url:data.url,
          data: data.data||'',
          headers:newheader
        }).then(function(response) {
          res(response.data)
        }).catch(function (error) {
          rej(error.response)
        })
      })
    }else{
      return new Promise((res, rej) => {
        axios({
          method:method,
          url:data.url,
          params: data.data||'',
          headers:newheader
        }).then(function (response) {
          res(response.data)
        }).catch(function (error) {
          rej(error.response)
        })
      })
    }
  }
}