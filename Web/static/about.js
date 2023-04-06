function calculateServerCost() {
    const startDate = new Date("2023-03-15");
    const dailyCost = 3.03;
    const now = new Date();
    const differenceInTime = now.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    const totalCost = (differenceInDays * dailyCost).toFixed(2);
    document.getElementById("server-cost").innerHTML = "$"+totalCost;
}

function showDonationOptions() {
    const donationMethods = document.getElementById("donation-methods");
    donationMethods.style.display = "block";
}

function showQRCode(id) {
    const qrCodeElements = document.querySelectorAll(".qr-code");
    qrCodeElements.forEach((element) => {
        element.style.display = "none";
    });

    const qrCodeToShow = document.getElementById(id);
    qrCodeToShow.style.display = "block";
}

function showQRCode(id) {
    const qrCodeElements = document.querySelectorAll(".qr-code");
    qrCodeElements.forEach((element) => {
        element.style.display = "none";
    });

    const qrCodeToShow = document.getElementById(id);
    qrCodeToShow.style.display = "block";

    // Add a slight delay before scrolling
    setTimeout(() => {
        // Calculate the position to scroll to
        const scrollToPosition = qrCodeToShow.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2);

        // Scroll to the displayed QR code
        window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
    }, 100); // 100ms delay
}

function showDonationOptions() {
    const donationMethods = document.getElementById("donation-methods");
    donationMethods.style.display = "block";

    // Add a slight delay before scrolling
    setTimeout(() => {
        // Calculate the position to scroll to
        const scrollToPosition = donationMethods.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2);

        // Scroll to the donation methods
        window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
    }, 100); // 100ms delay
}

function translateAboutPage() {
    const userLang = navigator.language || navigator.userLanguage;

    if (userLang.startsWith("zh")) {
        // Change the text to Chinese
        document.title = "关于PodFind";
        const titleElement = document.querySelector(".title a");
        titleElement.innerHTML = 'PodFind<span class="colored-text"><span class="c1">.</span><span class="c2">x</span><span class="c3">y</span><span class="c4">z</span></span>';

        const sections = [
            {
                selector: "h2:nth-of-type(1)",
                text: "1. 初衷"
            },
            {
                selector: "h2:nth-of-type(2)",
                text: "2. 为什么选择播客"
            },
            {
                selector: "h2:nth-of-type(3)",
                text: "3. 免费使用？"
            },
            {
                selector: "h2:nth-of-type(4)",
                text: "4. 未来计划"
            }
        ];

        sections.forEach(({ selector, text }) => {
            const element = document.querySelector(selector);
            element.textContent = text;
        });

        const paragraphs = [
            {
                selector: "blockquote",
                text: "PodFind.xyz并非播客搜索引擎。"
            },
            {
                selector: '.designed-for',
                text: "事实上，我更希望它能帮助你获得新的认识。你可以："
            },
            {
                selector: "ul li:nth-of-type(1)",
                text: "搜索关键词来了解Podcaster们对新事物或事件的看法，如硅谷银行、GPT-4。"
            },
            {
                selector: "ul li:nth-of-type(2)",
                text: "点击时间戳，可以只听你感兴趣的部分。"
            },
            {
                selector: ".why-podcast",
                text: "从形式上，播客要求有录音设备、多人对谈，这既是某种过滤，也给深度观点交锋带来了可能性，所以我倾向于认为播客的信噪比(SNR)更高。"
            },
            {
                selector: ".pure-free",
                text: "没错！纯粹出于好玩，服务器会持续产生费用，所以你的捐赠会让它活得更久一点。"
            },
            {
                selector: ".future-plan",
                text: "这个版本实在太简陋了，很多音频没有时间戳。将来(如果有钱)，我会添加<a href='https://github.com/openai/whisper' style='color:#ED784A;'>Whisper</a>为每一集构建时间戳，这样你搜任何关键词，都能直接只听与之有关的片段。"
            },
            {
              selector: ".have-fun",
              text: "总之，玩得开心！"
            },
            {
                selector: "p.mb-4.text-center",
                update: (element) => {
                    element.innerHTML = "至今的服务器费用：<span id='server-cost-zh'></span>";
                }
            },
            {
                selector: "#donation-message",
                text: "捐赠"
            },
            {
                selector: "#alipay-qr",
                alt: "支付宝二维码"
            },
            {
                selector: "#donation-methods a:nth-of-type(1)",
                text: "支付宝"
            },
            {
                selector: "#donation-methods a:nth-of-type(2)",
                text: "Paypal"
            },
            {
                selector: "#alipay-qr",
                alt: "支付宝二维码"
            },
            {
                selector: "p.mb-4.text-center",
                update: (element) => {
                    element.innerHTML = "服务器费用至今：<span id='server-cost'></span>";
                }
            },
        ];

        paragraphs.forEach(({ selector, text, alt }) => {
            const element = document.querySelector(selector);
            if (element) {
                if (text) {
                    element.innerHTML = text;
                }
                if (alt) {
                    element.setAttribute("alt", alt);
                }
            } else {
                console.error(`Element not found: ${selector}`);
            }
        });

        calculateServerCost();
    } else {
        calculateServerCost();
    }

    updateDonationMessage();
}

function updateDonationMessage() {
    const lang = navigator.language || navigator.userLanguage;
    const message = document.getElementById('donation-message');

    if (lang.startsWith('zh')) {
        message.innerHTML = '如果你捐款，请务必<a href="mailto:myfancoo@gmail.com">邮件</a>联系我，你的头像和名字会在这里显示，以感谢你让它活得更久了一点。';
    } else {
        message.innerHTML = 'If you choose to donate, please contact me <a href="mailto:myfancoo@gmail.com">via email</a>, your profile picture and name will be displayed here to express gratitude for helping this website last a bit longer.';
    }
}

// Call the functions when the page loads
window.addEventListener("load", () => {
    translateAboutPage();
});
