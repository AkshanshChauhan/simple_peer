const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
const e = require("express");
const port = process.env.PORT || 1000;
let app = express();

app.use(express.urlencoded())

function gtTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);

    const hour = ("0" + now.getHours()).slice(-2);
    const minute = ("0" + now.getMinutes()).slice(-2);
    const second = ("0" + now.getSeconds()).slice(-2);

    // YYYY-MM-DD hh:mm:ss
    const formatted = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return formatted;
}

var faq = {
    q: [
        "hello",
        "who develop you",
        "who create you",
        "who make you",
        "what is this",
        "how many people connected at one time",
        "location area coordinates",
        "mobile number",
        "what is this",
        "webrtc",
        "time",
        "collage itg itgopeshwar student of",
        "help, how to start",
    ],
    a: [
        "hi, how can i help you?",
        "<b>Akshansh Chauhan</b> Develop Me",
        "I am Created by <b>Akshansh Chauhan</b>",
        "I am build by <b>Akshansh Chauhan</b>",
        "This site is for <b>Communication</b>, Through <b>Video</b> and <b>Audio</b>",
        "Mainly <b>Two</b>, as <mark>peer1</mark> and <mark>peer2</mark>. But you can make Several Peer1 and Peer2 at a same time",
        "Uttarakhand, <b>India</b>",
        "<b>+91</b> ******5377, :)",
        "This is <mark>real time communication</mark> web application",
        "<img src='https://res.cloudinary.com/practicaldev/image/fetch/s--GQZMu9WG--/c_imagga_scale,f_auto,fl_progressive,h_500,q_66,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/9tsx7bf26ejjb1wcj2ve.gif' width='200px' alt='webrtc.img.image'><br><br><h3>Introduction to WebRTC</h3><br><aside>WebRTC stands for Web Real-Time Communication. It is an open source and free project that used to provide real-time communication to mobile applications and web browsers with the help of API’s(Application Programming Interface).</aside><a href='https://www.geeksforgeeks.org/introduction-to-webrtc/'>more.</a>",
        gtTime(),
        "<img src='https://itgopeshwar.ac.in/wp-content/uploads/2020/07/cropped-ITG-LOGO-2-1-446x79.png' width='200px' style='background-color: white;'><br><br><h3>Institute of Technology, Gopeshwar Founded in 2013</h3><br><p>Institute of Technology, Gopeshwar is one of the Four constituent colleges of Uttarakhand Technical University that was established in October 2013 with the approval of Uttarakhand Government. IT Gopeshwar is approved by AICTE,Ministry of HRD, New Delhi. IT Gopeshwar,is an Institute which aims to promote technological advancement in the state of uttarakhand. It provides such a conductive environment to his students in which they become intellectually capable, innovative and entrepreneurial professionals. IT Gopeshwar also provides an educational training that promotes and emphasizes social awareness as well as development of professional skills among the students. Here the knowledge of the students is broadened, deepened and enriched as the institute provide such solutions that benefit humanity and the natural environment.</p><a href='https://itgopeshwar.ac.in'>More.</a>",
        "<h2>Watch this Video :</h2><br><video src='tutorial.mp4' width='200px' controls maximize autoplay></video>"
    ]
}

// const options = {
//     key: fs.readFileSync(path.join(__dirname, './certs/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem'))
// }

let server = http.createServer(app).listen(port, () => {
    console.log("Express Server listening on port " + port)
});

let io = new Server(server);

app.use(express.static("material"));

app.get('/', (q, r) => {
    r.sendFile(__dirname + "/home/index.html");
})

var ind = 0;
var cond = false
app.post('/faq', async(q, r, err) => {
    faq.q.forEach((e, i) => {
        if (e.includes(q.body.quest)) {
            ind = i
            cond = true
        }
    })
    if (cond == true) {
        r.json({ status: "ok", message: faq.a[ind] })
        ind = 0
    } else {
        r.json({ status: "notfound", message: "<span style='color: rgb(140, 180,180)'>srorry, i can't get!</span>" })
        fs.appendFileSync("faq.txt", "question [" + gtTime() + "] : " + q.body.quest + "\n", "utf-8")
        ind = 0
    }
    cond = false
})

app.get('/peer2-display', (q, r) => {
    r.sendFile(__dirname + "/home/peer2-display.html")
})

app.get('/faq/q/', (q, r) => {
    r.sendFile(__dirname + "/faq.txt")
})

app.get('/jquery', (q, r) => {
    r.sendFile(__dirname + "/node_modules/jquery/dist/jquery.min.js")
})

app.get('/peer1', (q, r) => {
    r.sendFile(__dirname + "/home/peer1.html")
})

app.get('/peer2', (q, r) => {
    r.sendFile(__dirname + "/home/peer2.html")
})

app.get('/socket.io', (q, r) => {
    r.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.min.js")
})

var count_user = 0;

io.on("connect", (o) => {

    count_user = count_user + 1;

    o.on("disconnect", () => {
        count_user = count_user - 1;
        console.log("disconnected", count_user, o.id);
        o.emit("conn", count_user)
        o.broadcast.emit("conn", count_user)
    })

    o.emit("conn", count_user)
    o.broadcast.emit("conn", count_user)

    console.log("connected", count_user, o.id)

    o.on("p1off", (p1off) => {
        console.log(p1off)
        o.broadcast.emit("p1offer", p1off)
    })

    o.on("p2ans", (p2ans) => {
        console.log(p2ans)
        o.broadcast.emit("p2answer", p2ans)
    })

    o.on("reload", () => {
        o.broadcast.emit("reload", {})
    })

})