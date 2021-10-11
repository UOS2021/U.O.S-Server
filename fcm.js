var FCM = require('fcm-node');
// api 토큰
var serverKey = "AAAAjJLRggY:APA91bE2xhI3ZkbiFx1y3o3WugxQlkM8Aub9c77-3n5qyQ9ROF62h8XPKzvKRPUZB1dwNYiexcD9vjpYnQ4bwsdLF75ya9YxISoPnyk1Oc2NBN0IIlVkGM0bDNZdyDM_uBP0Ys05nL_b";
var fcm = new FCM(serverKey);

var message = {
    // 손님 토큰
    to: "eyqxiwncQ3GGD_fFgMIs-5:APA91bFoPAAKI_WZpckgiQ3aF7Txr-_RJSk2yieQjugZ7l4-gsoBb2Y_CP21T2EYy8cjuNdvObq-FrYTPNRwtQH1I0ffj5La26AyVOQ_c6-LK-Zxibf8CqIY71FPk-fZFb3et7XjtKxg",
    collapse_key: "",
    data: {
        "company_name": "SEXSEX",
        "order_number": 1
    }
};

fcm.send(message, function(err, response) {
    if (err) {
        console.log("Something has gone wrong");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});