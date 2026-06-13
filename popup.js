document.getElementById('scan').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
        document.getElementById('result').innerText = "Error: Cannot read this page's URL.";
        document.getElementById('result').style.color = "orange";
        return;
    }

    document.getElementById('result').innerText = "Analyzing live DOM...";
    document.getElementById('result').style.color = "black";
    
    try {
        let response = await fetch('http://127.0.0.1:8000/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: tab.url })
        });
        
        let data = await response.json();
        
        if (data.is_malicious) {
            document.getElementById('result').innerText = `🚨 PHISHING THREAT (${data.risk_score}% Risk)`;
            document.getElementById('result').style.color = "red";
        } else {
            document.getElementById('result').innerText = "✅ SAFE SITE VERIFIED";
            document.getElementById('result').style.color = "green";
        }
    } catch (e) {
        document.getElementById('result').innerText = "Error: Backend server offline.";
        document.getElementById('result').style.color = "orange";
    }
});