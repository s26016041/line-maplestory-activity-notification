const MaplestoryApi = require('../src/maplestoryApi/maplestoryApi.js');



(async () => {
    const a = new MaplestoryApi();
    const activityTable = await a.getActivityTable(); // 等待 Promise 解析

    console.log(activityTable[0].title); // 访问 bulletinId
})();
