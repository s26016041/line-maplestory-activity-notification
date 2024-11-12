const MaplestoryApi = require('../maplestoryApi/maplestoryApi.js');
const fs = require('fs').promises;
const maplestoryApi = new MaplestoryApi()
const fileName = 'group.json'
const Linebot = require('linebot');
const { Storage } = require('@google-cloud/storage');


Linebot.LineBot
class MaplestoryActivityNotification {
    /**
        * @type {string[]}
        */
    groups = [];

    /**
           * @type {string}
           */
    bullentinId
    lineBot
    /**
     * @type {Storage}
     */
    storage
    constructor(lineBot) {
        this.storage = new Storage()
        this.init()
        this.lineBot = lineBot
        setInterval(() => {
            this.sendNotification()
        }, 5 * 60 * 1000);
        //5 * 60 * 1000

    }
    async init() {
        try {
            const activityTable = await maplestoryApi.getActivityTable();
            this.bullentinId = activityTable[0].bullentinId; // 設置 bulletinId
        } catch (error) {
            console.log("獲取活動表格時發生錯誤:", error);
            process.exit(1); // 終止程序，並返回錯誤碼 1
        }
        try {
            await this.storage.bucket(process.env.LINE_CHANNEL_ID).file(fileName).download({ destination: "./group.json" })
            console.log(`${fileName} 已从 Google Cloud Storage 下载`)
            const data = await fs.readFile(fileName, 'utf8');
            const jsonData = JSON.parse(data);
            this.groups = jsonData.items || []; // 如果 items 不存在，則設為空陣列
            console.log(this.groups);
        } catch (fileError) {
            console.log("讀取文件時發生錯誤將設定預設值:", fileError.message);
            // 不進行任何操作或設置 groups 為空陣列
            this.groups = []; // 可選：設置預設值
        }
    }
    /**
         * @param {string} groupsId 
         */
    async addGroup(groupsId) {
        if (this.groups.includes(groupsId)) {
            return;
        }
        this.groups.push(groupsId);
        const jsonData = JSON.stringify({ items: this.groups }, null, 2); // 將 groups 轉換為 JSON 格式

        try {
            await fs.writeFile(fileName, jsonData);
            console.log('groups 已成功寫入 group.json 文件');
            await this.storage.bucket(process.env.LINE_CHANNEL_ID).upload(fileName);
            console.log(`${fileName} 已上传到 Google Cloud Storage`);
        } catch (err) {
            console.error('寫入文件時發生錯誤:', err);
        }
    }
    /**
        * @param {string} groupsId 
        */
    async deleteGroup(groupsId) {
        const groupIndex = this.groups.indexOf(groupsId);
        if (groupIndex === -1) {
            return;
        }
        this.groups.splice(groupIndex, 1);
        const jsonData = JSON.stringify({ items: this.groups }, null, 2); // 將 groups 轉換為 JSON 格式

        try {
            await fs.writeFile(fileName, jsonData);
            console.log('groups 已成功寫入 group.json 文件');
            await this.storage.bucket(process.env.LINE_CHANNEL_ID).upload(fileName);
            console.log(`${fileName} 已上传到 Google Cloud Storage`);
        } catch (err) {
            console.error('寫入文件時發生錯誤:', err);
        }
    }
    async sendNotification() {
        try {
            const activityTable = await maplestoryApi.getActivityTable()
            console.log(activityTable[0].title)
            console.log(`群組 ID 名單:${this.groups}`)
            for (const data of activityTable) {
                if (data.bullentinId !== this.bullentinId) {
                    const url = data.urlLink ? data.urlLink : `https://maplestory.beanfun.com/bulletin?bid=${data.bullentinId}`;

                    for (const groupId of this.groups) {
                        await this.lineBot.push(groupId, `${data.title}\n${url}`).catch(err => {
                            console.error(`發送到群組 ${groupId} 時發生錯誤:`, err);
                        });
                    }
                } else {
                    break; // 跳出迴圈
                }
            }
            this.bullentinId = activityTable[0].bullentinId
        } catch (err) {
            console.log(`發送訊息有誤 ${err.message}`)
        }
    }
}
module.exports = MaplestoryActivityNotification;