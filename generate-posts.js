const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'terminal');
const outputFile = path.join(__dirname, 'posts.json');

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));

const posts = files.map(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    
    // Simple Regex to grab data - you can make these more robust
    const title = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || "Untitled Post";
    const image = content.match(/<img.*?src=["'](.*?)["']/)?.[1] || "default-thumbnail.jpg";
    const firstPara = content.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || "";

    return {
        title: title.trim(),
        image,
        snippet: firstPara.trim().substring(0, 160) + "...",
        url: `/terminal/${file}`,
        date: fs.statSync(path.join(postsDir, file)).mtime // Use file modification date
    };
});

// Sort by newest and take the top 4
const latestPosts = posts.sort((a, b) => b.date - a.date).slice(0, 4);

fs.writeFileSync(outputFile, JSON.stringify(latestPosts, null, 2));
console.log('Terminal manifest generated.');
