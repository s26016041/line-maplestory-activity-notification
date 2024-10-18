const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');



class MaplestoryApi {
    params = {
        Kind: 72,
        Page: 1,
        method: 3,
        PageSize: 10,
        toAll: 0,
    };
    CSRFToken = ''
    cookiesData = ''
    /**
 *
 * 
 * @returns {Array<{ title: string, urlLink: string, bullentinId: string }>}
 */
    async getActivityTable() {
        try {
            // 楓之谷官網
            const response = await axios.get('https://maplestory.beanfun.com/Main');
            // 獲取該網站所設定的 cookie 
            const cookies = response.headers['set-cookie'];
            //使用 cheerio 加载 HTML
            const $ = cheerio.load(response.data);
            // 查找 __RequestVerificationToken 的值
            const token = $('input[name="__RequestVerificationToken"]').val();
            this.CSRFToken = token;
            this.cookiesData = cookies.join('; ');
            // 獲取活動公告的 API 
            const postResponse = await axios.post('https://maplestory.beanfun.com/main?handler=BulletinProxy', qs.stringify(this.params), {
                headers: {
                    'X-CSRF-Token': this.CSRFToken,
                    'Cookie': this.cookiesData
                },
            });
            return postResponse.data.data.myDataSet.table;
        } catch (error) {
            console.log("楓之谷官網 API 死了")
        }

    }
}






module.exports = MaplestoryApi;