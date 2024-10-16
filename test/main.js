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

let cookiesData, CSRFToken;

axios.get('https://maplestory.beanfun.com/Main')
  .then(response => {
    // 从响应头提取 Set-Cookie
    const cookies = response.headers['set-cookie'];

    // 输出提取的 Cookie
    console.log('提取的 Cookies:', cookies);
    
    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(response.data);

    // 查找 __RequestVerificationToken 的值
    const token = $('input[name="__RequestVerificationToken"]').val();

    // 输出提取的 token
    console.log('提取的 __RequestVerificationToken:', token);
    
    // 赋值给 CSRFToken 和 cookiesData
    CSRFToken = token;
    cookiesData = cookies.join('; '); // 确保 cookies 格式正确

    // 发送 POST 请求
    return axios.post('https://maplestory.beanfun.com/main?handler=BulletinProxy', qs.stringify(params), {
      headers: {
        'X-CSRF-Token': CSRFToken,
        'Cookie': cookiesData
      },
    });
  })
  .then(response => {
    console.log('成功响应:', response.data.data.myDataSet.table);
  })
  .catch(error => {
    console.error('请求错误:', error);
  });
