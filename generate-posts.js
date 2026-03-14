const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'terminal');
const outputFile = path.join(__dirname, '_site', 'posts.json');

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));

const posts = files.map(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    
    // 1. Logic for Featured & Category
    const isFeatured = content.includes('featured: true');
    
    // This regex looks for: const categoryMatch = content.match(//);
    const category = categoryMatch ? categoryMatch[1] : 'Intelligence';

    // 2. Content Extraction
    const title = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || "Untitled Post";
    const image = content.match(/<img.*?src=["'](.*?)["']/)?.[1] || "default-thumbnail.jpg";
    const firstPara = content.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || "";

    return {
        title: title.trim(),
        image,
        snippet: firstPara.trim().substring(0, 160) + "...",
        url: `/terminal/${file.replace('.html', '/')}`, 
        date: fs.statSync(path.join(postsDir, file)).mtime,
        featured: isFeatured,                             
        category: category
    };
});

// Sort all posts by date
const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
console.log('Terminal manifest generated successfully.');
