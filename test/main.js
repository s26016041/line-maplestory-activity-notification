const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

// 要发送的数据
const params = {
  Kind: 72,
  Page: 1,
  method: 3,
  PageSize: 10,
  toAll: 0,
};

// 发送 POST 请求
axios.post('https://maplestory.beanfun.com/main?handler=BulletinProxy', qs.stringify(params), {
  headers: {
    'X-CSRF-Token': 'CfDJ8N5WPr6Y241KvDQ5Q5Dp0OK95QJo2Y21AIhPPU2_FXC9vfH_M5no-4OkMVM3rTIuC_7bGflQgcflL4o7bQjiAY3UCfsh4SUds32R0xW_0pyUMtmHxlTr7PUPkFtwkSZmsCyJbtvZDat76xBluTIzVpA',
    'Cookie': '.AspNetCore.Antiforgery.SVSW8BVrGmw=CfDJ8N5WPr6Y241KvDQ5Q5Dp0OKNSYuDDnuUS2eR1AX0e2B5NHm0xxGCDBZmtSFWEiJfMFlC_070BRI3Cctk94-VT1LqgLoMkcJ78yf8xuv7G8PoA6Iwe_4DLLTp4R7uks3BzqihRiwkRqHmontfMlyeOKE; path=/; samesite=strict; httponly'
  },
})
.then(response => {
  console.log('成功响应:', response.data.data.myDataSet.table);
})
.catch(error => {
  console.error('请求错误:', error);
});




// axios.get('https://maplestory.beanfun.com/Main')
//   .then(response => {
//     // 从响应头提取 Set-Cookie
//     const cookies = response.headers['set-cookie'];

//     // 输出提取的 Cookie
//     console.log('提取的 Cookies:', cookies);

//     // 使用 cheerio 加载 HTML
//     const $ = cheerio.load(response.data);

//     // 查找 __RequestVerificationToken 的值
//     const token = $('input[name="__RequestVerificationToken"]').val();

//     // 输出提取的 token
//     console.log('提取的 __RequestVerificationToken:', token);
//   })
//   .catch(error => {
//     console.error('请求错误:', error);
//   });
