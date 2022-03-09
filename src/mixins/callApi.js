export default{
    methods:{
        sendReq: async function (url, method, data = null) {
            try {
              const headers = {}
              let body
              if (data){
                  headers['Content-type'] = 'application/json'
                  body = JSON.stringify(data)
              }
              const res = await fetch(url, {
                method,
                headers,
                body,
              });
              if (res.status === 200 || res.status === 201){
                var resBody = await res.json();
              }else{
                var resBody = 'error_our_service'
              }
              return resBody
            } catch (error) {
              var resBody = 'error_service_gorzdrav'
              return resBody
            }
          },
    }
}