const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'terminal');
const outputFile = path.join(__dirname, '_site', 'posts.json');

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));

const posts = files.map(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Editorial Logic
    const isFeatured = content.includes('featured: true');
    
    // This looks for: const categoryMatch = content.match(//i);
    const category = categoryMatch ? categoryMatch[1].trim() : 'Intelligence';

    // 2. Content Extraction
    const title = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "Untitled Post";
    const image = content.match(/<img.*?src=["'](.*?)["']/i)?.[1] || "default-thumbnail.jpg";
    const firstPara = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";

    return {
        title: title.replace(/<[^>]*>/g, '').trim(), // Clean any HTML tags from title
        image,
        snippet: firstPara.replace(/<[^>]*>/g, '').trim().substring(0, 160) + "...",
        url: `/terminal/${file.replace('.html', '/')}`, 
        date: fs.statSync(filePath).mtime,
        featured: isFeatured,
        category: category
    };
});

// Sort by date (newest first)
const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Ensure the directory exists before writing
if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
console.log(`Manifest generated: ${sortedPosts.length} posts indexed.`);
fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
console.log('Terminal manifest generated successfully.');
